import ProdutoSaida from "./SaidaLote.js";
import Usuario from "./Usuario.js";
import { TipoPagamento } from "../enums/TipoPagamento.js";
import type { ISaida } from "./../interfaces/ISaida.js";
import type Endereco from "./Endereco.js";

export default class Saida {
  private id: number | null;
  private cupomFiscal: string;
  private data: Date;
  private valorTotal: number;
  private creditoUsado: number;
  private valorFinal: number;
  private tipoPagamento: TipoPagamento;
  private produtos: ProdutoSaida[];
  private endereco: Endereco;
  private colaborador: Usuario;

  constructor(saida: ISaida) {
    this.id = saida.id;
    this.cupomFiscal = saida.numero_cupom_fiscal;
    this.valorTotal = saida.valor_total;
    this.creditoUsado = saida.credito_usado;
    this.valorFinal = saida.valor_final;
    this.data = saida.data_saida;
    this.tipoPagamento = saida.tipoPagamento;
    this.produtos = saida.produtos;
    this.endereco = saida.endereco;
    this.colaborador = saida.colaborador;
  }

  getId = (): number | null => this.id;

  setId = (id: number): boolean => {
    if (!id || id <= 0) {
      return false;
    }

    this.id = id;
    return true;
  };

  getCupomFiscal = (): string => this.cupomFiscal;

  setCupomFiscal = (cupomFiscal: string): boolean => {
    if (!cupomFiscal || cupomFiscal.trim() === "") {
      return false;
    }

    this.cupomFiscal = cupomFiscal;
    return true;
  };

  getValorTotal = (): number => this.valorTotal;

  setValorTotal = (valorTotal: number): boolean => {
    if (valorTotal == null || valorTotal < 0) {
      return false;
    }

    this.valorTotal = valorTotal;
    return true;
  };

  getCreditoUsado = (): number => this.creditoUsado;

  setCreditoUsado = (creditoUsado: number): boolean => {
    if (creditoUsado == null || creditoUsado < 0) {
      return false;
    }

    this.creditoUsado = creditoUsado;
    return true;
  };

  getValorFinal = (): number => this.valorFinal;

  setValorFinal = (valorFinal: number): boolean => {
    if (valorFinal == null || valorFinal < 0) {
      return false;
    }

    this.valorFinal = valorFinal;
    return true;
  };

  getData = (): Date => this.data;

  setData = (data: Date): boolean => {
    if (!data) {
      return false;
    }

    this.data = data;
    return true;
  };

  getTipoPagamento = (): TipoPagamento => this.tipoPagamento;

  setTipoPagamento = (tipoPagamento: TipoPagamento): boolean => {
    if (!tipoPagamento) {
      return false;
    }

    this.tipoPagamento = tipoPagamento;
    return true;
  };

  getProdutos = (): ProdutoSaida[] => this.produtos;

  setProdutos = (produtos: ProdutoSaida[]): boolean => {
    if (!produtos) {
      return false;
    }

    this.produtos = produtos;
    return true;
  };

  getEndereco = (): Endereco => this.endereco;

  setEndereco = (endereco: Endereco): boolean => {
    if (!endereco) {
      return false;
    }

    this.endereco = endereco;
    return true;
  };

  getColaborador = (): Usuario => this.colaborador;

  setColaborador = (colaborador: Usuario): boolean => {
    if (!colaborador) {
      return false;
    }

    this.colaborador = colaborador;
    return true;
  };
}
