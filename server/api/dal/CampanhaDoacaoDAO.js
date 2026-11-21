import { pool } from "../database/connection.js";
import showLog from "../utils/showLog.js";

const erro = (status, message) => Object.assign(new Error(message), { status });

export default class CampanhaDoacaoDAO {
  Criar = async ({ nome, descricao, data, status }) => {
    try {
      showLog("Criando nova campanha no Banco de Dados");

      const result = await pool.query(
        `
        INSERT INTO campanha (nome, descricao, data, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nome, descricao, data, status
        `,
        [nome, descricao, data, status],
      );

      return result.rows[0];
    } catch (error) {
      showLog(
        `Não foi possível criar uma nova campanha no Banco de Dados: ${error}`,
      );
      return false;
    }
  };

  Consultar = async (id) => {
    try {
      showLog(`Buscando campanha ${id} no Banco de Dados`);

      const result = await pool.query(
        `
        SELECT id, nome, descricao, data, status
        FROM campanha
        WHERE id = $1
        `,
        [id],
      );

      return result.rows[0] ?? null;
    } catch (error) {
      showLog(
        `Não foi possível consultar a campanha no Banco de Dados: ${error}`,
      );
      return false;
    }
  };

  Listar = async () => {
    try {
      showLog("Listando campanhas no Banco de Dados");

      const result = await pool.query(
        `
        SELECT id, nome, descricao, data, status
        FROM campanha
        ORDER BY data DESC, id DESC
        `,
      );

      return result.rows;
    } catch (error) {
      showLog(
        `Não foi possível listar as campanhas no Banco de Dados: ${error}`,
      );
      return false;
    }
  };

  Excluir = async (id) => {
    try {
      showLog(`Excluindo campanha ${id} no Banco de Dados`);

      const result = await pool.query(
        `DELETE FROM campanha WHERE id = $1 RETURNING id`,
        [id],
      );

      return result.rows[0] ?? null;
    } catch (error) {
      showLog(
        `Não foi possível excluir a campanha no Banco de Dados: ${error}`,
      );

      // 23503 = violação de chave estrangeira (campanha em uso por outra tabela)
      if (error.code === "23503") return "EM_USO";
      return false;
    }
  };

  ConsultarPorId = async (campanhaId) => {
    try {
      showLog(`Consultando campanha ${campanhaId}`);

      const { rows } = await pool.query(
        `
        SELECT id, nome, descricao, data, status
        FROM campanha
        WHERE id = $1
        `,
        [campanhaId],
      );

      return rows[0] ?? null;
    } catch (error) {
      showLog(`Não foi possível consultar a campanha: ${error}`);
      throw error;
    }
  };

  ListarLotesDevolvidos = async (campanhaId) => {
    try {
      showLog(`Listando lotes devolvidos da campanha ${campanhaId}`);

      // ASSUMINDO: doacao.fk_campanha_id, doacao_lote.fk_doacao_id,
      // doacao_lote.fk_devolucao_lote_id e doacao_lote.quantidade
      const { rows } = await pool.query(
        `
  SELECT
    dl.id               AS devolucao_lote_id,
    l.id                AS lote_id,
    l.codigo            AS codigo,
    dlote.quantidade    AS quantidade,
    dc.data_devolucao   AS data_devolucao,
    dc.motivo           AS motivo
  FROM doacao d
  JOIN doacao_lote dlote       ON dlote.fk_doacao_id = d.id
  JOIN devolucao_lote dl       ON dl.id = dlote.fk_devolucao_lote_id
  JOIN devolucao_credito dc    ON dc.id = dl.fk_devolucao_credito_id
  JOIN lote l                  ON l.id = dl.fk_lote_id
  WHERE d.fk_campanha_id = $1
  ORDER BY dc.data_devolucao DESC, dl.id DESC
  `,
        [campanhaId],
      );

      return rows;
    } catch (error) {
      showLog(`Não foi possível listar os lotes da campanha: ${error}`);
      throw error;
    }
  };

  ListarLotesDisponiveis = async () => {
    try {
      showLog("Listando lotes devolvidos sem campanha");

      const { rows } = await pool.query(
        `
      SELECT
        dl.id             AS devolucao_lote_id,
        dl.quantidade     AS quantidade,
        l.id              AS lote_id,
        l.codigo          AS codigo,
        dc.data_devolucao AS data_devolucao,
        dc.motivo         AS motivo
      FROM devolucao_lote dl
      JOIN devolucao_credito dc ON dc.id = dl.fk_devolucao_credito_id
      JOIN lote l               ON l.id = dl.fk_lote_id
      WHERE NOT EXISTS (
        SELECT 1
        FROM doacao_lote dlote
        WHERE dlote.fk_devolucao_lote_id = dl.id
      )
      ORDER BY dc.data_devolucao DESC, dl.id DESC
      `,
      );

      return rows;
    } catch (error) {
      showLog(`Não foi possível listar os lotes disponíveis: ${error}`);
      throw error;
    }
  };

  VincularLotes = async ({ campanhaId, devolucaoLoteIds, usuarioId }) => {
    try {
      showLog(
        `Vinculando ${devolucaoLoteIds.length} lote(s) à campanha ${campanhaId}`,
      );
      await pool.query("BEGIN");

      const campanha = await pool.query(
        "SELECT id FROM campanha WHERE id = $1",
        [campanhaId],
      );
      if (!campanha.rows[0]) throw erro(404, "Campanha não encontrada.");

      const lotes = await pool.query(
        `
      SELECT id, quantidade
      FROM devolucao_lote
      WHERE id = ANY($1::int[])
      ORDER BY id
      FOR UPDATE
      `,
        [devolucaoLoteIds],
      );

      if (lotes.rows.length !== devolucaoLoteIds.length) {
        throw erro(400, "Algum lote selecionado não existe.");
      }

      const jaVinculados = await pool.query(
        `
      SELECT fk_devolucao_lote_id
      FROM doacao_lote
      WHERE fk_devolucao_lote_id = ANY($1::int[])
      `,
        [devolucaoLoteIds],
      );

      if (jaVinculados.rows.length) {
        throw erro(
          409,
          "Algum lote selecionado já foi vinculado a uma campanha.",
        );
      }

      const doacao = await pool.query(
        `
      INSERT INTO doacao (fk_campanha_id, fk_usuario_id)
      VALUES ($1, $2)
      RETURNING id
      `,
        [campanhaId, usuarioId],
      );
      const doacaoId = doacao.rows[0].id;

      for (const { id, quantidade } of lotes.rows) {
        await pool.query(
          `
        INSERT INTO doacao_lote (fk_doacao_id, fk_devolucao_lote_id, quantidade)
        VALUES ($1, $2, $3)
        `,
          [doacaoId, id, quantidade],
        );
      }

      const updateStatus = await pool.query(
        "UPDATE campanha SET status='fechada' WHERE id=$1",
        [campanhaId],
      );

      await pool.query("COMMIT");
      return { doacaoId, totalLotes: lotes.rows.length };
    } catch (error) {
      await pool.query("ROLLBACK");
      showLog(`Não foi possível vincular os lotes: ${error}`);
      throw error;
    }
  };
}
