import OrdemDeImpressao from "../class/OrdemDeImpressao.js";
import { pool } from "../database/connection.js";

export default class OrdemDeImpressaoDAO {
  Criar = async (novaOrdem: OrdemDeImpressao) => {
    try {
      return true;
    } catch (err) {
      console.log(`Erro ao criar nova Ordem de Impressão: ${err}`);
      return false;
    }
  };
  Alterar = async (ordem: OrdemDeImpressao) => {
    try {
      return true;
    } catch (err) {
      console.log(`Erro ao atualizar Ordem de Impressão: ${err}`);
      return false;
    }
  };
  Consultar = async (id: number) => {
    try {
      const result = await pool.query("SELECT * FROM produto WHERE id = $1", [
        id,
      ]);

      return result.rows[0];
    } catch (err) {
      console.log(`Erro ao atualizar Ordem de Impressão: ${err}`);
    }
  };
  Rejeitar = async (id: number, userId: number) => {
    try {
      return true;
    } catch (err) {
      console.log(`Erro ao rejeitar Ordem de Impressão: ${err}`);
      return false;
    }
  };
  Aprovar = async (id: number, userId: number) => {
    try {
      return true;
    } catch (err) {
      console.log(`Erro ao aprovar Ordem de Impressão: ${err}`);
      return false;
    }
  };
  Listar = async () => {};
  Buscar = async () => {};
  salvarProdutos = async () => {};
}
