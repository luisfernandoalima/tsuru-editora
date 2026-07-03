import Devolucao from "./Devolucao.js";
import type { StatusCampanha } from "../enums/StatusCampanha.js";
import type { ICampanhaDoacao } from "../interfaces/ICampanhaDoacao.js";

export class CampanhaDoacao {
  private id?: number | undefined;
  private nome: string;
  private descricao: string;
  private dataInicio: Date;
  private dataFinal: Date;
  private statusCampanha: StatusCampanha;
  private devolucoes: Devolucao[];

  constructor(campanha: ICampanhaDoacao) {
    this.id = campanha.id;
    this.nome = campanha.nome;
    this.descricao = campanha.descricao;
    this.dataInicio = campanha.dataInicio;
    this.dataFinal = campanha.dataFinal;
    this.statusCampanha = campanha.statusCampanha;
    this.devolucoes = campanha.devolucoes;
  }

  public getId(): number | undefined {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getNome(): string {
    return this.nome;
  }

  public setNome(nome: string): void {
    this.nome = nome;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public setDescricao(descricao: string): void {
    this.descricao = descricao;
  }

  public getDataInicio(): Date {
    return this.dataInicio;
  }

  public setDataInicio(dataInicio: Date): void {
    this.dataInicio = dataInicio;
  }

  public getDataFinal(): Date {
    return this.dataFinal;
  }

  public setDataFinal(dataFinal: Date): void {
    this.dataFinal = dataFinal;
  }

  public getStatusCampanha(): StatusCampanha {
    return this.statusCampanha;
  }

  public setStatusCampanha(statusCampanha: StatusCampanha): void {
    this.statusCampanha = statusCampanha;
  }

  public getDevolucoes(): Devolucao[] {
    return this.devolucoes;
  }

  public setDevolucoes(devolucoes: Devolucao[]): void {
    this.devolucoes = devolucoes;
  }
}
