import type OrdemDeImpressao from "../class/OrdemDeImpressao.js";
import type Produto from "../class/Produto.js";
import { pool } from "../database/connection.js";
import type { ILote } from "../interfaces/ILote.js";
export default class LoteDAO {
  Criar = async (
    produto: Produto,
    nomeLote: string,
    order: OrdemDeImpressao,
    quantidade: number,
  ) => {
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
  consultarOrdem = async (ordemId: number): Promise<ILote[]> => {
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
  atualizarEstoque = async () => {};

  Atualizar = async (id: number, quantidade: number) => {
    const result = await pool.query(
      ` UPDATE lote SET quantidade_inicial = $1, quantidade_atual = $1 WHERE id = $2 RETURNING * `,
      [quantidade, id],
    );
    return result.rows[0];
  };
  /** * Deleta um lote */
  Deletar = async (id: number) => {
    const result = await pool.query(
      ` DELETE FROM lote WHERE id = $1 RETURNING * `,
      [id],
    );
    return result.rows[0];
  };

  Aprovar = async (id: number) => {
    const result = await pool.query(
      "UPDATE lote set status='EM ESTOQUE' WHERE id=$1",
      [id],
    );
    return true;
  };

  Cancelar = async (id: number) => {
    const result = await pool.query(
      "UPDATE lote set status='CANCELADO' WHERE id=$1",
      [id],
    );
    return true;
  };
}
