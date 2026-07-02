import ProdutoEntrada from "./ProdutoEntrada.js";
import type Usuario from "./Usuario.js";

import type { IEntrada } from "../interfaces/IEntrada.js";

export default class Entrada {
  private _id: number | null;
  private _cupomFiscal: string;
  private _data: Date;
  private _nomeFornecedor: String;
  private _cnpjFornecedor: String;
  private _precoTotal: number;
  private _produtos: ProdutoEntrada[];
  private _colaborador: Usuario;

  constructor(entrada: IEntrada) {
    this._id = entrada.id || null;
    this._cupomFiscal = entrada.cupomFiscal;
    this._produtos = entrada.produtos;
    this._data = entrada.data;
    this._nomeFornecedor = entrada.nomeFornecedor;
    this._cnpjFornecedor = entrada.cnpjFornecedor;
    this._precoTotal = entrada.precoTotal;
    this._colaborador = entrada.colaborador;
  }

  getId = (): number | null => this._id;

  setId = (id: number): boolean => {
    if (!id || id <= 0) {
      return false;
    }
    this._id = id;
    return true;
  };

  getCupomFiscal = () => this._cupomFiscal;

  getData = (): Date => this._data;

  setData = (data: Date): boolean => {
    if (!data) {
      return false;
    }
    this._data = data;
    return true;
  };

  getNomeFornecedor = (): String => this._nomeFornecedor;

  setNomeFornecedor = (nomeFornecedor: String): boolean => {
    if (!nomeFornecedor || nomeFornecedor == "") {
      return false;
    }
    this._nomeFornecedor = nomeFornecedor;
    return true;
  };

  getCnpjFornecedor = (): String => this._cnpjFornecedor;

  setCnpjFornecedor = (cnpjFornecedor: String): boolean => {
    if (!cnpjFornecedor || cnpjFornecedor == "") {
      return false;
    }
    this._cnpjFornecedor = cnpjFornecedor;
    return true;
  };

  getPrecoTotal = (): number => this._precoTotal;

  setPrecoTotal = (precoTotal: number): boolean => {
    if (precoTotal == null || precoTotal < 0) {
      return false;
    }
    this._precoTotal = precoTotal;
    return true;
  };

  getProdutos = (): ProdutoEntrada[] => this._produtos;

  setProdutos = (produtos: ProdutoEntrada[]): boolean => {
    if (!produtos) {
      return false;
    }
    this._produtos = produtos;
    return true;
  };

  getColaborador = (): Usuario => this._colaborador;

  setColaborador = (colaborador: Usuario): boolean => {
    if (!colaborador) {
      return false;
    }
    this._colaborador = colaborador;
    return true;
  };
}
