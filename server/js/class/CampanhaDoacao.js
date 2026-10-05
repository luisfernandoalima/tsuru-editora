import Devolucao from "./Devolucao.js";

export class CampanhaDoacao {
  #id;
  #nome;
  #descricao;
  #dataInicio;
  #dataFinal;
  #statusCampanha;
  #devolucoes;

  constructor(campanha) {
    this.#id = campanha.id;
    this.#nome = campanha.nome;
    this.#descricao = campanha.descricao;
    this.#dataInicio = campanha.dataInicio;
    this.#dataFinal = campanha.dataFinal;
    this.#statusCampanha = campanha.statusCampanha;
    this.#devolucoes = campanha.devolucoes;
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

  getDescricao() {
    return this.#descricao;
  }

  setDescricao(descricao) {
    this.#descricao = descricao;
  }

  getDataInicio() {
    return this.#dataInicio;
  }

  setDataInicio(dataInicio) {
    this.#dataInicio = dataInicio;
  }

  getDataFinal() {
    return this.#dataFinal;
  }

  setDataFinal(dataFinal) {
    this.#dataFinal = dataFinal;
  }

  getStatusCampanha() {
    return this.#statusCampanha;
  }

  setStatusCampanha(statusCampanha) {
    this.#statusCampanha = statusCampanha;
  }

  getDevolucoes() {
    return this.#devolucoes;
  }

  setDevolucoes(devolucoes) {
    this.#devolucoes = devolucoes;
  }
}
