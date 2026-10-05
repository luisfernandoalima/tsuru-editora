import { pool } from "../database/connection.js";

import Saida from "../class/Saida.js";

export default class SaidaDAO {
  Registrar = async (newExit) => {
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

  Consultar = async (cupomFiscal) => {
    try {
      const result = await pool.query(
        `
        SELECT
          s.id,
          s.numero_cupom_fiscal,
          to_char(s.data_saida, 'YYYY-MM-DD') AS data_saida,
          s.valor_total,
          s.credito_usado,
          s.valor_final,
          s.metodo_pagamento,
          u.nome AS usuario_nome,
          u.email AS usuario_email,
          sl.quantidade,
          sl.subtotal,
          l.id AS lote_id,
          l.codigo AS lote_codigo,
          p.id AS produto_id,
          p.titulo,
          p.capa_url
        FROM saida s
        JOIN usuario u ON u.id = s.fk_usuario_id
        LEFT JOIN saida_lote sl ON sl.fk_saida_id = s.id
        LEFT JOIN lote l ON l.id = sl.fk_lote_id
        LEFT JOIN produto p ON p.id = l.fk_produto_id
        WHERE s.numero_cupom_fiscal = $1
        ORDER BY l.id;
        `,
        [cupomFiscal],
      );

      return result.rows[0];
    } catch (err) {
      console.error(`Erro ao buscar saida: ${err}`);
      return false;
    }
  };

  Listar = async (cupom) => {
    try {
      const result = await pool.query(
        "SELECT * FROM saida WHERE numero_cupom_fiscal ILIKE $1;",
        [`%${cupom}%`],
      );

      console.log(result.rows);

      return result.rows;
    } catch (err) {
      console.log(`Erro ao buscar entradas: ${err}`);
    }
  };

  listarPorCupom = async (cupomFiscal) => {
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
