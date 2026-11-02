import { pool } from "../database/connection.js";

import Saida from "../class/Saida.js";

import showLog from "../utils/showLog.js";

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
      showLog(`Iniciando busca no banco de dados do cupom: ${cupomFiscal}`);

      const result = await pool.query(
        `
      SELECT
        s.id,
        s.data_saida,
        s.valor_total,
        s.valor_final,
        s.credito_usado,
        s.metodo_pagamento,
        s.numero_cupom_fiscal,
        u.nome  AS usuario_nome,
        u.email AS usuario_email,
        e.logradouro, e.numero, e.bairro, e.cidade, e.estado, e.cep,
        p.nome  AS parceiro_nome,
        COALESCE(
          json_agg(
            json_build_object(
              'lote_id', l.id,
              'lote_codigo', l.codigo,
              'produto', pr.titulo,
              'isbn', pr.isbn,
              'capaUrl', pr.capa_url,
              'quantidade', sl.quantidade,
              'subtotal', sl.subtotal
            )
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'
        ) AS itens
      FROM saida s
      JOIN usuario u          ON u.id = s.fk_usuario_id
      JOIN endereco e         ON e.id = s.fk_endereco_id
      LEFT JOIN parceiro p    ON p.id = e.fk_parceiro_id
      LEFT JOIN saida_lote sl ON sl.fk_saida_id = s.id
      LEFT JOIN lote l        ON l.id = sl.fk_lote_id
      LEFT JOIN produto pr    ON pr.id = l.fk_produto_id
      WHERE s.numero_cupom_fiscal = $1
      GROUP BY s.id, u.id, e.id, p.id
      `,
        [cupomFiscal],
      );

      // Retorna a saída encontrada ou null se não existir
      return result.rows[0] ?? null;
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
