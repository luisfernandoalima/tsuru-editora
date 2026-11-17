import { pool } from "../database/connection.js";
import showLog from "../utils/showLog.js";

const erro = (status, message) => Object.assign(new Error(message), { status });

export default class DevolucaoDAO {
  Criar = async ({ saidaId, motivo, itens }) => {
    const PERCENTUAL_CREDITO = 0.05;
    const client = await pool.connect();

    try {
      showLog(`Registrando devolução da saída ${saidaId}`);
      await client.query("BEGIN");

      // Parceiro dono da saída (via endereço)
      const saida = await client.query(
        `
        SELECT e.fk_parceiro_id AS parceiro_id
        FROM saida s
        JOIN endereco e ON e.id = s.fk_endereco_id
        WHERE s.id = $1
        `,
        [saidaId],
      );

      if (!saida.rows[0]) throw erro(404, "Saída não encontrada.");

      const parceiroId = saida.rows[0].parceiro_id;
      if (!parceiroId)
        throw erro(400, "A saída não está vinculada a um parceiro.");

      let valorTotal = 0;
      const itensValidados = [];

      for (const { loteId, quantidade } of itens) {
        // Trava o lote para evitar devoluções simultâneas acima do limite
        await client.query("SELECT id FROM lote WHERE id = $1 FOR UPDATE", [
          loteId,
        ]);

        const saidaLote = await client.query(
          `
          SELECT quantidade, subtotal
          FROM saida_lote
          WHERE fk_saida_id = $1 AND fk_lote_id = $2
          `,
          [saidaId, loteId],
        );

        if (!saidaLote.rows[0]) {
          throw erro(400, `O lote ${loteId} não pertence a essa saída.`);
        }

        const qtdSaida = Number(saidaLote.rows[0].quantidade);
        const subtotal = Number(saidaLote.rows[0].subtotal);

        // Quanto desse lote o parceiro já devolveu
        const jaDevolvido = await client.query(
          `
          SELECT COALESCE(SUM(dl.quantidade), 0) AS total
          FROM devolucao_lote dl
          JOIN devolucao_credito dc ON dc.id = dl.fk_devolucao_credito_id
          WHERE dl.fk_lote_id = $1 AND dc.fk_parceiro_id = $2
          `,
          [loteId, parceiroId],
        );

        const disponivel = qtdSaida - Number(jaDevolvido.rows[0].total);

        if (quantidade > disponivel) {
          throw erro(
            400,
            `Lote ${loteId}: só é possível devolver mais ${Math.max(disponivel, 0)} unidade(s).`,
          );
        }

        // Preço realmente pago por unidade nessa saída
        valorTotal += quantidade * (subtotal / qtdSaida);
        itensValidados.push({ loteId, quantidade });
      }

      const valorDevolvido = Math.round(valorTotal * 100) / 100;
      const valorCredito =
        Math.round(valorDevolvido * PERCENTUAL_CREDITO * 100) / 100;

      const devolucao = await client.query(
        `
        INSERT INTO devolucao_credito
          (data_devolucao, motivo, valor_original, valor_atual, fk_parceiro_id)
        VALUES (CURRENT_DATE, $1, $2, $2, $3)
        RETURNING id, data_devolucao, motivo, valor_original, valor_atual, fk_parceiro_id
        `,
        [motivo, valorCredito, parceiroId],
      );

      const devolucaoId = devolucao.rows[0].id;

      for (const { loteId, quantidade } of itensValidados) {
        await client.query(
          `
          INSERT INTO devolucao_lote (quantidade, fk_lote_id, fk_devolucao_credito_id)
          VALUES ($1, $2, $3)
          `,
          [quantidade, loteId, devolucaoId],
        );
      }

      await client.query("COMMIT");
      return { ...devolucao.rows[0], valorDevolvido, itens: itensValidados };
    } catch (error) {
      await client.query("ROLLBACK");
      showLog(`Não foi possível registrar a devolução: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  };

  ConsultarSaldo = async (partnerId) => {
    const { rows } = await pool.query(
      `
    SELECT
      COALESCE(SUM(valor_original), 0) AS valor_original,
      COALESCE(SUM(valor_atual), 0)    AS valor_atual
    FROM devolucao_credito
    WHERE fk_parceiro_id = $1
    `,
      [partnerId],
    );

    console.log(rows[0]);

    return {
      valorOriginal: Number(rows[0].valor_original),
      valorAtual: Number(rows[0].valor_atual),
    };
  };

  Listar = async () => {
    try {
      showLog("Listando devoluções");

      const { rows } = await pool.query(
        `
      SELECT
        dc.id,
        dc.data_devolucao,
        dc.motivo,
        dc.valor_original,
        dc.valor_atual,
        dc.fk_parceiro_id,
        pa.cnpj,
        COALESCE(
          json_agg(
            json_build_object(
              'devolucao_lote_id', dl.id,
              'lote_id',           l.id,
              'codigo',            l.codigo,
              'quantidade',        dl.quantidade
            )
            ORDER BY dl.id
          ) FILTER (WHERE dl.id IS NOT NULL),
          '[]'
        ) AS lotes
      FROM devolucao_credito dc
      JOIN parceiro pa            ON pa.id = dc.fk_parceiro_id
      LEFT JOIN devolucao_lote dl ON dl.fk_devolucao_credito_id = dc.id
      LEFT JOIN lote l            ON l.id = dl.fk_lote_id
      GROUP BY dc.id, pa.cnpj
      ORDER BY dc.data_devolucao DESC, dc.id DESC
      `,
      );

      return rows;
    } catch (error) {
      showLog(`Não foi possível listar as devoluções: ${error}`);
      throw error;
    }
  };

  // Saldo do parceiro dono do endereço de entrega
  ConsultarSaldoPorEndereco = async (enderecoId) => {
    const { rows } = await pool.query(
      `
    SELECT COALESCE(SUM(dc.valor_atual), 0) AS saldo
    FROM endereco e
    JOIN devolucao_credito dc ON dc.fk_parceiro_id = e.fk_parceiro_id
    WHERE e.id = $1
    `,
      [enderecoId],
    );

    return Number(rows[0].saldo);
  };

  // Abate o valor dos créditos mais antigos primeiro (FIFO)
  Utilizar = async ({ saidaId, valor }) => {
    const client = await pool.connect();

    try {
      showLog(`Utilizando R$ ${valor} em créditos na saída ${saidaId}`);
      await client.query("BEGIN");

      // Parceiro dono da saída (via endereço)
      const parceiro = await client.query(
        `
      SELECT e.fk_parceiro_id AS parceiro_id
      FROM saida s
      JOIN endereco e ON e.id = s.fk_endereco_id
      WHERE s.id = $1
      `,
        [saidaId],
      );
      if (!parceiro.rows[0]) throw erro(404, "Saída não encontrada.");

      // Trava os créditos para evitar uso simultâneo do mesmo saldo
      const creditos = await client.query(
        `
      SELECT id, valor_atual
      FROM devolucao_credito
      WHERE fk_parceiro_id = $1 AND valor_atual > 0
      ORDER BY data_devolucao ASC, id ASC
      FOR UPDATE
      `,
        [parceiro.rows[0].parceiro_id],
      );

      // Em centavos, para evitar erro de ponto flutuante
      let restante = Math.round(valor * 100);

      for (const credito of creditos.rows) {
        if (restante <= 0) break;

        const disponivel = Math.round(Number(credito.valor_atual) * 100);
        const usado = Math.min(disponivel, restante);

        await client.query(
          `UPDATE devolucao_credito SET valor_atual = valor_atual - $1 WHERE id = $2`,
          [usado / 100, credito.id],
        );

        await client.query(
          `
        INSERT INTO saida_credito (valor_utilizado, fk_devolucao_credito_id, fk_saida_id)
        VALUES ($1, $2, $3)
        `,
          [usado / 100, credito.id, saidaId],
        );

        restante -= usado;
      }

      if (restante > 0) throw erro(400, "Saldo de créditos insuficiente.");

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      showLog(`Não foi possível utilizar os créditos: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  };
}
