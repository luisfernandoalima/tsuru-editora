export default class Endereco {
  #id;
  #cep;
  #logradouro;
  #numero;
  #bairro;
  #cidade;
  #estado;

  constructor(endereco) {
    this.#id = endereco.id;
    this.#cep = endereco.cep;
    this.#logradouro = endereco.logradouro;
    this.#numero = endereco.numero;
    this.#bairro = endereco.bairro;
    this.#cidade = endereco.cidade;
    this.#estado = endereco.estado;
  }

  getId() {
    return this.#id;
  }

  setId(id) {
    this.#id = id;
  }

  getCep() {
    return this.#cep;
  }

  setCep(cep) {
    this.#cep = cep;
  }

  getLogradouro() {
    return this.#logradouro;
  }

  setLogradouro(logradouro) {
    this.#logradouro = logradouro;
  }

  getNumero() {
    return this.#numero;
  }

  setNumero(numero) {
    this.#numero = numero;
  }

  getBairro() {
    return this.#bairro;
  }

  setBairro(bairro) {
    this.#bairro = bairro;
  }

  getCidade() {
    return this.#cidade;
  }

  setCidade(cidade) {
    this.#cidade = cidade;
  }

  getEstado() {
    return this.#estado;
  }

  setEstado(estado) {
    this.#estado = estado;
  }
}
