import { pool } from "../database/connection.js";

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
      console.error(error);
      throw error;
    }
  };

  Consultar = async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM lote WHERE id=$1`, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Erro ao consultar lotes:", error);
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
          data_criacao,
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
      console.error("Erro ao consultar lotes:", error);
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
      console.error("Erro ao consultar lotes:", error);
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
      console.error("Erro ao atualizar lotes:", error);
      throw error;
    }
  };

  Atualizar = async (id, quantidade) => {
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
    const result = await pool.query(
      "UPDATE lote SET status='EM ESTOQUE' WHERE id=$1",
      [id],
    );

    return true;
  };

  Cancelar = async (id) => {
    const result = await pool.query(
      "UPDATE lote SET status='CANCELADO' WHERE id=$1",
      [id],
    );

    return true;
  };
}
