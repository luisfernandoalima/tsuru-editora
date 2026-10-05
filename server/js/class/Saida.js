import SaidaLote from "./SaidaLote.js";
import Usuario from "./Usuario.js";
import { TipoPagamento } from "../enums/TipoPagamento.js";

export default class Saida {
  #id;
  #cupomFiscal;
  #valorTotal;
  #creditoUsado;
  #valorFinal;
  #data;
  #tipoPagamento;
  #produtos;
  #endereco;
  #colaborador;

  constructor(saida) {
    this.#id = saida.id;
    this.#cupomFiscal = saida.numero_cupom_fiscal;
    this.#valorTotal = saida.valor_total;
    this.#creditoUsado = saida.credito_usado;
    this.#valorFinal = saida.valor_final;
    this.#data = saida.data_saida;
    this.#tipoPagamento = saida.tipoPagamento;
    this.#produtos = saida.produtos;
    this.#endereco = saida.endereco;
    this.#colaborador = saida.colaborador;
  }

  getId = () => this.#id;

  setId = (id) => {
    if (!id || id <= 0) {
      return false;
    }

    this.#id = id;
    return true;
  };

  getCupomFiscal = () => this.#cupomFiscal;

  setCupomFiscal = (cupomFiscal) => {
    if (!cupomFiscal || cupomFiscal.trim() === "") {
      return false;
    }

    this.#cupomFiscal = cupomFiscal;
    return true;
  };

  getValorTotal = () => this.#valorTotal;

  setValorTotal = (valorTotal) => {
    if (valorTotal == null || valorTotal < 0) {
      return false;
    }

    this.#valorTotal = valorTotal;
    return true;
  };

  getCreditoUsado = () => this.#creditoUsado;

  setCreditoUsado = (creditoUsado) => {
    if (creditoUsado == null || creditoUsado < 0) {
      return false;
    }

    this.#creditoUsado = creditoUsado;
    return true;
  };

  getValorFinal = () => this.#valorFinal;

  setValorFinal = (valorFinal) => {
    if (valorFinal == null || valorFinal < 0) {
      return false;
    }

    this.#valorFinal = valorFinal;
    return true;
  };

  getData = () => this.#data;

  setData = (data) => {
    if (!data) {
      return false;
    }

    this.#data = data;
    return true;
  };

  getTipoPagamento = () => this.#tipoPagamento;

  setTipoPagamento = (tipoPagamento) => {
    if (!tipoPagamento) {
      return false;
    }

    this.#tipoPagamento = tipoPagamento;
    return true;
  };

  getProdutos = () => this.#produtos;

  setProdutos = (produtos) => {
    if (!produtos) {
      return false;
    }

    this.#produtos = produtos;
    return true;
  };

  getEndereco = () => this.#endereco;

  setEndereco = (endereco) => {
    if (!endereco) {
      return false;
    }

    this.#endereco = endereco;
    return true;
  };

  getColaborador = () => this.#colaborador;

  setColaborador = (colaborador) => {
    if (!colaborador) {
      return false;
    }

    this.#colaborador = colaborador;
    return true;
  };
}
