import Parceiro from "./Parceiro.js";
import type { IDevolucao } from "./../interfaces/IDevolucao.js";

export default class Devolucao {
  private id?: number | undefined;
  private dataDevolucao: number;
  private saldoAtual: number;
  private parceiro: Parceiro;

  constructor(devolucao: IDevolucao) {
    this.id = devolucao.id;
    this.dataDevolucao = devolucao.dataDevolucao;
    this.saldoAtual = devolucao.saldoAtual;
    this.parceiro = devolucao.parceiro;
  }

  public getId(): number | undefined {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getDataDevolucao(): number {
    return this.dataDevolucao;
  }

  public setDataDevolucao(dataDevolucao: number): void {
    this.dataDevolucao = dataDevolucao;
  }

  public getSaldoAtual(): number {
    return this.saldoAtual;
  }

  public setSaldoAtual(saldoAtual: number): void {
    this.saldoAtual = saldoAtual;
  }

  public getParceiro(): Parceiro {
    return this.parceiro;
  }

  public setParceiro(parceiro: Parceiro): void {
    this.parceiro = parceiro;
  }
}
