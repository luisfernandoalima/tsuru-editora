import { pool } from "../database/connection.js";

import Usuario from "../class/Usuario.js";
import showLog from "../utils/showLog.js";

export default class UsuarioDAO {
  Criar = async (user) => {
    try {
      await pool.query(
        "INSERT INTO usuario (nome, email, senha, ativo, perfil, primeiro_login, telefone, cpf) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          user.getNome(),
          user.getEmail(),
          user.getSenha(),
          user.getAtivo(),
          user.getCargo(),
          user.getPrimeiroLogin(),
          user.getTelefone(),
          user.getCPF(),
        ],
      );

      return true;
    } catch (err) {
      console.error(`Erro ao cadastrar usuário: ${err}`);
      if (err.errors)
        err.errors.forEach((e) =>
          console.error(" -", e.code, e.address, e.port),
        );

      return false;
    }
  };

  Consultar = async (id) => {
    try {
      const result = await pool.query("SELECT * FROM usuario WHERE id = $1", [
        id,
      ]);

      return result.rows[0];
    } catch (err) {
      console.error(`Erro ao buscar usuário: ${err}`);
    }
  };

  Alterar = async (updatedUser) => {
    try {
      await pool.query(
        "UPDATE usuario SET nome = $1, email = $2, senha = $3, telefone = $4, cpf = $5, perfil = $6, ativo = $7, primeiro_login = $8 WHERE id = $9",
        [
          updatedUser.getNome(),
          updatedUser.getEmail(),
          updatedUser.getSenha(),
          updatedUser.getTelefone(),
          updatedUser.getCPF(),
          updatedUser.getCargo(),
          updatedUser.getAtivo(),
          updatedUser.getPrimeiroLogin(),
          updatedUser.getId(),
        ],
      );

      return true;
    } catch (err) {
      console.error(`Erro ao atualizar usuário: ${err}`);
      return false;
    }
  };

  Excluir = async (id) => {
    try {
      await pool.query("DELETE FROM usuario WHERE id = $1", [id]);

      return true;
    } catch (err) {
      console.error(`Erro ao buscar usuários: ${err}`);
      return false;
    }
  };

  Login = async (email) => {
    try {
      const result = await pool.query("SELECT * FROM usuario WHERE email=$1", [
        email,
      ]);

      if (result.rowCount == 1) {
        return result.rows[0];
      }
    } catch (err) {
      console.error(`Erro ao buscar usuário: ${err}`);
      return false;
    }
  };

  listarUsuarios = async () => {
    try {
      const result = await pool.query("SELECT * FROM usuario ORDER BY nome");

      return result.rows;
    } catch (err) {
      console.error(`Erro ao buscar usuários: ${err}`);
    }
  };

  Pesquisar = async (pesquisa) => {
    try {
      const result = await pool.query(
        "SELECT * FROM usuario WHERE nome ILIKE $1 OR email ILIKE $1 OR cpf ILIKE $1 ORDER BY nome",
        [`%${pesquisa}%`],
      );

      showLog(
        `Número de usuários encontrados para a pesquisa "${pesquisa}": ${result.rowCount}`,
      );
      return result.rows;
    } catch (err) {
      showLog(`Erro ao buscar usuários para a pesquisa "${pesquisa}": ${err}`);
      throw err;
    }
  };
}
