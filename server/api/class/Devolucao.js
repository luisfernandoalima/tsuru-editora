import Credito from "./Credito.js";

export default class Devolucao {
  #id;
  #data_devolucao;
  #motivo;
  #parceiro;
  #campanha;
  #credito;

  constructor(devolucao) {
    this.#id = devolucao.id;

    this.#data_devolucao = devolucao.data_devolucao;
    this.#motivo = devolucao.motivo;
    this.#credito = new Credito(
      devolucao.valor_atual,
      devolucao.valor_original,
    );
  }

  getId() {
    return this.#id;
  }

  setId(id) {
    this.#id = id;
  }

  getDataDevolucao() {
    return this.#data_devolucao;
  }

  setDataDevolucao(data_devolucao) {
    this.#data_devolucao = data_devolucao;
  }

  getMotivo() {
    return this.#motivo;
  }

  setMotivo(motivo) {
    this.#motivo = motivo;
  }

  getParceiro() {
    return this.#parceiro;
  }

  setParceiro(parceiro) {
    this.#parceiro = parceiro;
  }

  getCampanha() {
    return this.#campanha;
  }

  setCampanha(campanha) {
    this.#campanha = campanha;
  }

  getCredito() {
    return this.#credito;
  }

  setCredito(credito) {
    this.#credito = credito;
  }
}
