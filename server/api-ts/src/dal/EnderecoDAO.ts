import type Endereco from "../class/Endereco.js";
import { pool } from "../database/connection.js";
import type { IEndereco } from "../interfaces/IEndereco.js";
export default class EnderecoDAO {
  Criar = async (data: Endereco, partnerId: number) => {
    try {
      const response = pool.query(
        "INSERT INTO endereco (logradouro, numero, bairro, cidade, estado, cep, fk_parceiro_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          data.getLogradouro(),
          data.getNumero(),
          data.getBairro(),
          data.getCidade(),
          data.getEstado(),
          data.getCep(),
          partnerId,
        ],
      );

      console.log("Cadastrado!");
      return true;
    } catch (error) {
      console.log("Response Code: 201 - Dados cadastrados no Banco de Dados.");
      return error;
    }
  };

  Consultar = async (id: number) => {
    try {
      const response = await pool.query(`SELECT * FROM endereco WHERE id=$1`, [
        id,
      ]);

      console.log("Busca de endereço para o ID: " + id);
      let result = response.rows[0];
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  listarEndereco = async (id: number) => {
    try {
      const response = await pool.query(
        `SELECT * FROM endereco WHERE fk_parceiro_id=$1`,
        [id],
      );

      console.log("Busca de endereço para o ID: " + id);
      let result: IEndereco[] = response.rows;

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  Excluir = async (id: number) => {
    console.log("Excluído!");
    console.log("Response Code: 200 - Dados excluídos no Banco de Dados.");
    return true;
  };
}
