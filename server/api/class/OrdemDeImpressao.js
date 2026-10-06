import Usuario from "./Usuario.js";
import { StatusOrdem } from "../enums/StatusOrdem.js";

export default class OrdemDeImpressao {
  #id;
  #nome;
  #dataCriacao;
  #dataFechamento;
  #totalObras;
  #totalUnidades;
  #statusOrdem;
  #criador;
  #aprovador;

  constructor(ordem) {
    this.#id = ordem.id;
    this.#nome = ordem.nome;
    this.#dataCriacao = new Date(ordem.data_criacao);
    this.#dataFechamento = ordem.data_aprovacao;
    this.#totalObras = ordem.total_obras;
    this.#totalUnidades = ordem.total_unidades;
    this.#statusOrdem = ordem.status;
    this.#criador = ordem.fk_usuario_criador_id;
    this.#aprovador = ordem.fk_usuario_aprovador_id;
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

  getDataCriacao() {
    return this.#dataCriacao;
  }

  setDataCriacao(dataCriacao) {
    this.#dataCriacao = dataCriacao;
  }

  getDataAprovacao() {
    return this.#dataFechamento;
  }

  setDataAprovacao(dataFechamento) {
    this.#dataFechamento = dataFechamento;
  }

  getTotalObras() {
    return this.#totalObras;
  }

  setTotalObras(totalObras) {
    this.#totalObras = totalObras;
  }

  getTotalUnidades() {
    return this.#totalUnidades;
  }

  setTotalUnidades(totalUnidades) {
    this.#totalUnidades = totalUnidades;
  }

  getStatusOrdem() {
    return this.#statusOrdem;
  }

  setStatusOrdem(statusOrdem) {
    this.#statusOrdem = statusOrdem;
  }

  getCriador() {
    return this.#criador;
  }

  setCriador(criador) {
    this.#criador = criador;
  }

  getAprovador() {
    return this.#aprovador;
  }

  setAprovador(aprovador) {
    this.#aprovador = aprovador;
  }
}
