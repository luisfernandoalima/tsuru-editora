import Produto from "./Produto.js";
import { StatusLote } from "../enums/StatusLote.js";
import type { ILote } from "../interfaces/ILote.js";

export default class Lote {
  private id?: number | undefined;
  private codigo: string;
  private quantidadeInicial: number;
  private quantidadeAtual: number;
  private statusLote: StatusLote;
  private produto: Produto;

  constructor(lote: ILote) {
    this.id = lote.id;
    this.codigo = lote.codigo;
    this.quantidadeInicial = lote.quantidadeInicial;
    this.quantidadeAtual = lote.quantidadeAtual;
    this.statusLote = lote.statusLote;
    this.produto = lote.produto;
  }

  public getId(): number | undefined {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getCodigo(): string {
    return this.codigo;
  }

  public setCodigo(codigo: string): void {
    this.codigo = codigo;
  }

  public getQuantidadeInicial(): number {
    return this.quantidadeInicial;
  }

  public setQuantidadeInicial(quantidadeInicial: number): void {
    this.quantidadeInicial = quantidadeInicial;
  }

  public getQuantidadeAtual(): number {
    return this.quantidadeAtual;
  }

  public setQuantidadeAtual(quantidadeAtual: number): void {
    this.quantidadeAtual = quantidadeAtual;
  }

  public getStatusLote(): StatusLote {
    return this.statusLote;
  }

  public setStatusLote(statusLote: StatusLote): void {
    this.statusLote = statusLote;
  }

  public getProduto(): Produto {
    return this.produto;
  }

  public setProduto(produto: Produto): void {
    this.produto = produto;
  }
}
