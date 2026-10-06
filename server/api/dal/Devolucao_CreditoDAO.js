import { pool } from "../database/connection.js";

export default class Devolucao_CreditoDAO {
  Consultar = async (partnerId) => {
    try {
      const result = await pool.query(
        "SELECT * FROM devolucao_credito WHERE fk_parceiro_id=$1",
        [partnerId],
      );

      return result.rows;
    } catch (error) {
      console.log(`Erro ao consultar créditos: ${error}`);
      throw error;
    }
  };
}
