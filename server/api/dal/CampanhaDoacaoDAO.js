import { pool } from "../database/connection.js";
import showLog from "../utils/showLog.js";

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
}
