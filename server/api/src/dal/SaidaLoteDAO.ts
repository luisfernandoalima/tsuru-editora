import type SaidaLote from "../class/SaidaLote.js";
import { pool } from "../database/connection.js";

export default class SaidaLoteDAO {
  Registrar = async (saidaId: number, saidaLote: SaidaLote) => {
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
}
