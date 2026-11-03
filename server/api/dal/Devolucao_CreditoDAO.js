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
}
