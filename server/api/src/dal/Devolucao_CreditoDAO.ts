import { pool } from "../database/connection.js";

export default class Devolucao_CreditoDAO {
  public Consultar = async (partnerId: number) => {
    try {
      const result = await pool.query(
        "SELECT * FROM devolucao_credito WHERE fk_parceiro_id",
      );

      return result.rows;
    } catch (error) {
      console.log(`Erro ao consultar créditos: ${error}`);
      throw error;
    }
  };
}
