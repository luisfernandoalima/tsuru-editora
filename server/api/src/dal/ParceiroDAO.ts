import Parceiro from "../class/Parceiro.js";
import { pool } from "../database/connection.js";

export default class ParceiroDAO {
  Criar = async (parceiro: Parceiro) => {
    try {
      const response = await pool.query(
        "INSERT INTO parceiro (nome, cnpj, email, telefone, ativo) VALUES ($1, $2, $3, $4, $5)",
        [
          parceiro.getNome(),
          parceiro.getCnpj(),
          parceiro.getEmail(),
          parceiro.getContato(),
          parceiro.getAtivo(),
        ],
      );
      return true;
    } catch (err) {
      console.error(`Erro ao cadastrar parceiro: ${err}`);
      return false;
    }
  };

  Consultar = async (id: number) => {
    try {
      const result = await pool.query("SELECT * FROM parceiro WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    } catch (err) {
      console.error(`Erro ao buscar parceiro: ${err}`);
    }
  };

  Alterar = async (parceiro: Parceiro) => {
    try {
      await pool.query(
        `UPDATE parceiro SET nome = $1, cnpj = $2, email = $3, contato = $4 WHERE id = $6`,
        [
          parceiro.getNome(),
          parceiro.getCnpj(),
          parceiro.getEmail(),
          parceiro.getContato(),
          parceiro.getId(),
        ],
      );
      console.log("Alterado");
      return true;
    } catch (err) {
      console.error(`Erro ao atualizar parceiro: ${err}`);
      return false;
    }
  };

  Excluir = async (id: number) => {
    try {
      return true;
    } catch (err) {
      console.error(`Erro ao excluir parceiro: ${err}`);
      return false;
    }
  };

  Listar = async () => {
    try {
      const result = await pool.query("SELECT * FROM parceiro ORDER BY nome");

      console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(`Erro ao buscar parceiro: ${err}`);
    }
  };

  pesquisarParceiros = async (pesquisa: string) => {
    try {
      const result = await pool.query(
        "SELECT * FROM parceiro WHERE nome ILIKE $1 OR cnpj ILIKE $1",
        [`%${pesquisa}%`],
      );
      console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(`Erro ao buscar parceiro: ${err}`);
      throw err;
    }
  };
}
