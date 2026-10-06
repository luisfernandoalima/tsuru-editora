import Produto from "./Produto.js";
import { StatusLote } from "../enums/StatusLote.js";

export default class Lote {
  // #id;
  // #codigo;
  // #quantidadeInicial;
  // #quantidadeAtual;
  // #statusLote;
  // #produto;

  constructor(lote) {
    this.id = lote.id;
    this.codigo = lote.codigo;
    this.quantidadeInicial = lote.quantidade_inicial;
    this.quantidadeAtual = lote.quantidade_atual;
    this.statusLote = lote.status;
  }

  getId() {
    if (this.id) {
      return this.id;
    }
  }

  setId(id) {
    this.id = id;
  }

  getCodigo() {
    return this.codigo;
  }

  setCodigo(codigo) {
    this.codigo = codigo;
  }

  getQuantidadeInicial() {
    return this.quantidadeInicial;
  }

  setQuantidadeInicial(quantidadeInicial) {
    this.quantidadeInicial = quantidadeInicial;
  }

  getQuantidadeAtual() {
    return this.quantidadeAtual;
  }

  setQuantidadeAtual(quantidadeAtual) {
    this.quantidadeAtual = quantidadeAtual;
  }

  getStatusLote() {
    return this.statusLote;
  }

  setStatusLote(statusLote) {
    this.statusLote = statusLote;
  }

  getProduto() {
    return this.produto;
  }

  setProduto(produto) {
    this.produto = produto;
  }
}
