import type Endereco from "../class/Endereco.js";

export default class EnderecoDAO {
  Criar = (data: Endereco) => {
    console.log("Cadastrado!");
    console.log("Response Code: 201 - Dados cadastrados no Banco de Dados.");
  };
}
