import Endereco from "./Endereco.js";

export default class Parceiro {
  #id;
  #nome;
  #cnpj;
  #email;
  #contato;
  #ativo;
  #dataCadastro;
  #enderecos;

  constructor(parceiro) {
    this.#id = parceiro.id;
    this.#nome = parceiro.nome;
    this.#cnpj = parceiro.cnpj;
    this.#email = parceiro.email;
    this.#contato = parceiro.contato;
    this.#ativo = parceiro.ativo;
    this.#dataCadastro = parceiro.data_cadastro;
    this.#enderecos = parceiro.enderecos;
  }

  getId() {
    return this.#id;
  }

  setId(id) {
    this.#id = id;
  }

  getNome() {
    return this.#nome;
  }

  setNome(nome) {
    this.#nome = nome;
  }

  getCnpj() {
    return this.#cnpj;
  }

  setCnpj(cnpj) {
    this.#cnpj = cnpj;
  }

  getEmail() {
    return this.#email;
  }

  setEmail(email) {
    this.#email = email;
  }

  getContato() {
    return this.#contato;
  }

  setContato(contato) {
    this.#contato = contato;
  }

  getAtivo() {
    return this.#ativo;
  }

  setAtivo(ativo) {
    this.#ativo = ativo;
  }

  getDataCadastro() {
    return this.#dataCadastro;
  }

  setDataCadastro(dataCadastro) {
    this.#dataCadastro = dataCadastro;
  }

  getEnderecos() {
    return this.#enderecos;
  }

  setEnderecos(enderecos) {
    this.#enderecos = enderecos;
  }
}
