import Produto from "./Produto.js";

export default abstract class Registro {
  private _produto: Produto;
  private _quantidade: number;
  private _precoItens: number;

  constructor(produto: Produto, quantidade: number, precoItens: number) {
    this._produto = produto;
    this._quantidade = quantidade;
    this._precoItens = precoItens;
  }

  getProduto = (): Produto => this._produto;

  setProduto = (produto: Produto): boolean => {
    if (!produto) {
      return false;
    }
    this._produto = produto;
    return true;
  };

  getQuantidade = (): number => this._quantidade;

  setQuantidade = (quantidade: number): boolean => {
    if (!quantidade || quantidade <= 0) {
      return false;
    }
    this._quantidade = quantidade;
    return true;
  };

  getPrecoItens = (): number => this._precoItens;

  setPrecoItens = (precoItens: number): boolean => {
    if (precoItens == null || precoItens < 0) {
      return false;
    }
    this._precoItens = precoItens;
    return true;
  };
}
