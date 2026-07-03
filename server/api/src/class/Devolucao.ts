import Varejista from "./Varejista.js";
import type { IDevolucao } from "./../interfaces/IDevolucao.js";

export default class Devolucao {
  private id?: number | undefined;
  private dataDevolucao: number;
  private saldoAtual: number;
  private varejista: Varejista;

  constructor(devolucao: IDevolucao) {
    this.id = devolucao.id;
    this.dataDevolucao = devolucao.dataDevolucao;
    this.saldoAtual = devolucao.saldoAtual;
    this.varejista = devolucao.varejista;
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

  public getVarejista(): Varejista {
    return this.varejista;
  }

  public setVarejista(varejista: Varejista): void {
    this.varejista = varejista;
  }
}
