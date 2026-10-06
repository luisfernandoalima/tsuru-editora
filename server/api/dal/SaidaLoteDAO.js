import { pool } from "../database/connection.js";

export default class SaidaLoteDAO {
  Registrar = async (saidaId, saidaLote) => {
    try {
      await pool.query("INSERT INTO saida_lote VALUES ($1, $2, $3, $4)", [
        saidaId,
        saidaLote.getLote().getId(),
        saidaLote.getQuantidade(),
        saidaLote.getSubtotal(),
      ]);

      return true;
    } catch (err) {
      console.error(`Erro ao relação produto: ${err}`);
      throw err;
    }
  };

  Consultar = async (id) => {
    try {
      const result = await pool.query(
        "SELECT * FROM saida_lote WHERE fk_saida_id = $1",
        [id],
      );

      return result.rows;
    } catch (err) {
      console.error(`Erro ao consultar lote do produto: ${err}`);

      throw err;
    }
  };
}
