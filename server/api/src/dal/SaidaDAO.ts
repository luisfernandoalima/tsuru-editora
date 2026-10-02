import { pool } from "../database/connection.js";
import Saida from "../class/Saida.js";

export default class SaidaDAO {
  Registrar = async (newExit: Saida) => {
    try {
      await pool.query(
        "INSERT INTO saida (id, numero_cupom_fiscal, metodo_pagamento, data_saida, valor_total, credito_usado, valor_final, fk_endereco_id, fk_usuario_id) VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8)",
        [
          newExit.getCupomFiscal(),
          newExit.getTipoPagamento(),
          newExit.getData(),
          newExit.getValorTotal(),
          newExit.getCreditoUsado(),
          newExit.getValorFinal(),
          newExit.getEndereco().getId(),
          newExit.getColaborador().getId(),
        ],
      );

      const exitId = await pool.query(
        "SELECT id FROM saida WHERE numero_cupom_fiscal = $1",
        [newExit.getCupomFiscal()],
      );

      console.log(exitId);

      return exitId.rows[0].id;
    } catch (err) {
      console.error(`Erro ao registrar saída: ${err}`);
      return false;
    }
  };

  Consultar = async (cupomFiscal: string) => {
    try {
      const result = await pool.query(
        "SELECT * FROM saida WHERE numero_cupom_fiscal = $1",
        [cupomFiscal],
      );

      return result.rows;
    } catch (err) {
      console.error(`Erro ao buscar saida: ${err}`);
      return false;
    }
  };

  Listar = async () => {
    try {
      const result = await pool.query("SELECT * FROM saida");
      return result.rows;
    } catch (err) {
      console.log(`Erro ao buscar entradas: ${err}`);
    }
  };

  listarPorCupom = async (cupomFiscal: number) => {
    try {
      const result = await pool.query(
        "SELECT * FROM saida WHERE cupom_fiscal ILIKE $1",
        [`%${cupomFiscal}%`],
      );
      return result.rows;
    } catch (err) {
      console.log(`Erro ao buscar saidas: ${err}`);
      return false;
    }
  };
}
