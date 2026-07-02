import ProdutoSaida from "./ProdutoSaida.js";
import Usuario from "./Usuario.js";
import { TipoPagamento } from "../enums/TipoPagamento.js";
import type { ISaida } from "./../interfaces/ISaida.js";
export default class Saida {
  private _id: number | null;
  private _cupomFiscal: string;
  private _precoTotal: number;
  private _cliente: String;
  private _data: Date;
  private _cpfCliente: String;
  private _tipoPagamento: TipoPagamento;
  private _produtos: ProdutoSaida[];
  private _colaborador: Usuario;

  constructor(saida: ISaida) {
    this._id = saida.id;
    this._cupomFiscal = saida.cupomFiscal;
    this._precoTotal = saida.precoTotal;
    this._cliente = saida.cliente;
    this._data = saida.data;
    this._cpfCliente = saida.cpfCliente;
    this._tipoPagamento = saida.tipoPagamento;
    this._produtos = saida.produtos;
    this._colaborador = saida.colaborador;
  }

  getId = () => this._id;

  setId = (id: number): boolean => {
    if (!id || id <= 0) {
      return false;
    }
    this._id = id;
    return true;
  };

  getCupomFiscal = () => this._cupomFiscal;

  getPrecoTotal = (): number => this._precoTotal;

  setPrecoTotal = (precoTotal: number): boolean => {
    if (precoTotal == null || precoTotal < 0) {
      return false;
    }
    this._precoTotal = precoTotal;
    return true;
  };

  getCliente = (): String => this._cliente;

  setCliente = (cliente: String): boolean => {
    if (!cliente || cliente == "") {
      return false;
    }
    this._cliente = cliente;
    return true;
  };

  getData = (): Date => this._data;

  setData = (data: Date): boolean => {
    if (!data) {
      return false;
    }
    this._data = data;
    return true;
  };

  getCpfCliente = (): String => this._cpfCliente;

  setCpfCliente = (cpfCliente: String): boolean => {
    if (!cpfCliente || cpfCliente == "") {
      return false;
    }
    this._cpfCliente = cpfCliente;
    return true;
  };

  getTipoPagamento = () => this._tipoPagamento;

  setTipoPagamento = (tipoPagamento: any): boolean => {
    if (!tipoPagamento || tipoPagamento == "") {
      return false;
    }
    this._tipoPagamento = tipoPagamento;
    return true;
  };

  getProdutos = (): ProdutoSaida[] => this._produtos;

  setProdutos = (produtos: ProdutoSaida[]): boolean => {
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
