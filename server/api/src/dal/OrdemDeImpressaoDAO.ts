import OrdemDeImpressao from "../class/OrdemDeImpressao.js";
import { pool } from "../database/connection.js";

export default class OrdemDeImpressaoDAO {
  Criar = async (novaOrdem: OrdemDeImpressao) => {
    try {
      const result = await pool.query(
        " INSERT INTO ordem_impressao ( nome, data_criacao, fk_usuario_criador_id, status ) VALUES ($1, $2, $3, $4)",
        [
          novaOrdem.getNome(),
          novaOrdem.getDataCriacao(),
          novaOrdem.getCriador().getId(),
          novaOrdem.getStatusOrdem(),
        ],
      );
      return true;
    } catch (err) {
      console.log(`Erro ao criar nova Ordem de Impressão: ${err}`);
      return false;
    }
  };
  Alterar = async (ordem: OrdemDeImpressao) => {
    try {
      const result = await pool.query(
        `
    UPDATE ordem_impressao
    SET
      nome = $1,
      data_aprovacao = $2,
      total_obras = $3,
      total_unidades = $4,
      status = $5,
      fk_usuario_aprovador_id = $6
    WHERE id = $7
    RETURNING *
  `,
        [
          ordem.getNome(),
          ordem.getDataAprovacao(),
          ordem.getTotalObras(),
          ordem.getTotalUnidades(),
          ordem.getStatusOrdem(),
          ordem.getAprovador(),
          ordem.getId(),
        ],
      );
      return true;
    } catch (err) {
      console.log("Olá 2");
      console.log(`Erro ao atualizar Ordem de Impressão: ${err}`);
      return false;
    }
  };
  Consultar = async (id: number) => {
    try {
      const result = await pool.query(
        "SELECT * FROM ordem_impressao WHERE id = $1",
        [id],
      );

      console.log(result.rows);

      return result.rows[0];
    } catch (err) {
      console.log(`Erro ao atualizar Ordem de Impressão: ${err}`);
    }
  };
  Rejeitar = async (id: number, userId: number) => {
    try {
      const response = await pool.query(
        "UPDATE ordem_impressao set data_aprovacao = $1, status = 'CANCELADA', fk_usuario_aprovador_id = $2 WHERE id = $3",
        [new Date(), userId, id],
      );

      console.log("Ordem " + id + " rejeitada com sucesso: " + response);
      return true;
    } catch (err) {
      console.log(`Erro ao rejeitar Ordem de Impressão: ${err}`);
      return false;
    }
  };
  Aprovar = async (id: number, userId: number) => {
    try {
      const response = await pool.query(
        "UPDATE ordem_impressao set data_aprovacao = $1, status = 'APROVADA', fk_usuario_aprovador_id = $2 WHERE id = $3",
        [new Date(), userId, id],
      );

      console.log("Ordem " + id + " aprovada com sucesso: " + response);
      return true;
    } catch (err) {
      console.log(`Erro ao aprovar Ordem de Impressão: ${err}`);
      return err;
    }
  };
  Listar = async () => {
    try {
      const response = await pool.query(
        "SELECT * FROM ordem_impressao ORDER BY data_criacao DESC",
      );
      console.log(response.rows);
      return response.rows;
    } catch (error) {
      console.error("Erro ao listar as ordens: " + error);
      throw error;
    }
  };
  Buscar = async () => {};
  listarProdutos = async (orderId: number) => {
    try {
      const result = await pool.query(
        `
    SELECT 
        p.*,
        l.id AS lote_id,
        l.quantidade_inicial
    FROM lote l
    JOIN produto p ON p.id = l.fk_produto_id
    WHERE l.fk_ordem_impressao_id = $1
  `,
        [orderId],
      );

      return result.rows;
    } catch (error) {
      console.error("Erro ao listar os produtos: " + error);
      throw error;
    }
  };
}
