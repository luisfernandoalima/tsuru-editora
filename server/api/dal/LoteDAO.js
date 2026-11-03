import { pool } from "../database/connection.js";
import showLog from "../utils/showLog.js";

export default class LoteDAO {
  Criar = async (produto, nomeLote, order, quantidade) => {
    try {
      const result = await pool.query(
        `
        INSERT INTO lote (
          codigo,
          quantidade_inicial,
          quantidade_atual,
          status,
          fk_ordem_impressao_id,
          fk_produto_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
          nomeLote,
          quantidade,
          quantidade,
          "PENDENTE APROVAÇÃO",
          order.getId(),
          produto.getId(),
        ],
      );

      console.log("Lote registrado!");

      return true;
    } catch (error) {
      showLog(error);
      throw error;
    }
  };

  Consultar = async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM lote WHERE id=$1`, [id]);

      return result.rows[0];
    } catch (error) {
      showLog("Erro ao consultar lotes:", error);
      throw error;
    }
  };

  consultarOrdem = async (ordemId) => {
    try {
      const result = await pool.query(
        `
        SELECT
          id,
          codigo,
          quantidade_inicial,
          quantidade_atual,
          data_criacao_pedido,
          status,
          fk_ordem_impressao_id,
          fk_produto_id
        FROM lote
        WHERE fk_ordem_impressao_id = $1
        ORDER BY id
        `,
        [ordemId],
      );

      return result.rows;
    } catch (error) {
      showLog("Erro ao consultar lotes:", error);
      throw error;
    }
  };

  consultarPorProduto = async (produto) => {
    try {
      const result = await pool.query(
        `SELECT * FROM lote WHERE fk_produto_id=$1`,
        [produto.getId()],
      );

      return result.rows;
    } catch (error) {
      showLog("Erro ao consultar lotes:", error);
      throw error;
    }
  };

  atualizarEstoque = async (id, quantidade) => {
    try {
      const result = await pool.query(
        `
        UPDATE lote
        SET quantidade_atual = quantidade_atual - $1
        WHERE id = $2
          AND quantidade_atual >= $1
        RETURNING id, quantidade_atual
        `,
        [quantidade, id],
      );

      if (result.rowCount === 0) {
        throw new Error(
          `Falha ao debitar lote ${id}: saldo insuficiente ou lote inexistente`,
        );
      }

      return result.rows[0];
    } catch (error) {
      showLog("Erro ao atualizar lotes:", error);
      throw error;
    }
  };

  Atualizar = async (id, quantidade) => {
    try {
      const result = await pool.query(
        `
      UPDATE lote
      SET quantidade_inicial = $1,
          quantidade_atual = $1
      WHERE id = $2
      RETURNING *
      `,
        [quantidade, id],
      );

      return result.rows[0];
    } catch (error) {
      showLog("Erro ao atualizar lotes:", error);
      throw error;
    }
  };

  Deletar = async (id) => {
    const result = await pool.query(
      `
      DELETE FROM lote
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    return result.rows[0];
  };

  Aprovar = async (id) => {
    try {
      const result = await pool.query(
        "UPDATE lote SET status='PRODUÇÃO SOLICITADA', data_criacao_pedido=$2 WHERE id=$1",
        [id, new Date()],
      );

      showLog(`Solicitação de produção dos lotes registrada no banco de dados`);
      return true;
    } catch (error) {
      showLog(`Erro ao cancelar ordem: ${error}`);
      throw error;
    }
  };

  Cancelar = async (id) => {
    try {
      const result = await pool.query(
        "UPDATE lote SET status='CANCELADO' WHERE id=$1",
        [id],
      );

      showLog(`Lotes cancelados no banco de dados`);
      return true;
    } catch (error) {
      showLog(`Erro ao cancelar ordem: ${error}`);
      throw error;
    }
  };

  Fechar = async (id) => {
    try {
      const result = await pool.query(
        "UPDATE lote SET status='EM ESTOQUE', data_producao=$2 WHERE id=$1",
        [id, new Date()],
      );
      showLog(`Lotes registrados no banco de dados`);
      return true;
    } catch (error) {
      showLog(`Erro ao fechar ordem: ${error}`);
      throw error;
    }
  };

  consultarPorSaida = async (saidaId) => {
    try {
      const result = await pool.query(
        `
      SELECT
        l.id,
        l.codigo,
        l.quantidade_inicial,
        l.quantidade_atual,
        l.status,
        l.data_producao,
        pr.titulo AS produto_titulo,
        pr.isbn,
         pr.preco  AS preco_produto,
        sl.quantidade AS quantidade_saida,
        sl.subtotal
      FROM saida_lote sl
      JOIN lote l     ON l.id = sl.fk_lote_id
      JOIN produto pr ON pr.id = l.fk_produto_id
      WHERE sl.fk_saida_id = $1
      ORDER BY l.id
      `,
        [saidaId],
      );

      return result.rows;
    } catch (error) {
      showLog(`Erro ao consultar lotes da saída: ${error}`);
      throw error;
    }
  };
}
