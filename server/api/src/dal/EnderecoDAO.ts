import type Endereco from "../class/Endereco.js";

export default class EnderecoDAO {
  Criar = (data: Endereco) => {
    console.log("Cadastrado!");
    console.log("Response Code: 201 - Dados cadastrados no Banco de Dados.");
  };

  Excluir = async (id: number) => {
    console.log("Excluído!");
    console.log("Response Code: 200 - Dados excluídos no Banco de Dados.");
    return true;
  };
}
