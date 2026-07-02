import Usuario from "./Usuario.js";
import { StatusOrdem } from "../enums/StatusOrdem.js";
import type { IOrdemDeImpressao } from "../interfaces/IOrdemDeImpressao.js";

export default class OrdemDeImpressao {
  private id?: number | undefined;
  private nome: string;
  private dataCriacao: Date;
  private dataAprovacao: Date;
  private totalObras: number;
  private totalUnidades: number;
  private statusOrdem: StatusOrdem;
  private aprovador: Usuario;

  constructor(ordem: IOrdemDeImpressao) {
    this.id = ordem.id;
    this.nome = ordem.nome;
    this.dataCriacao = ordem.dataCriacao;
    this.dataAprovacao = ordem.dataAprovacao;
    this.totalObras = ordem.totalObras;
    this.totalUnidades = ordem.totalUnidades;
    this.statusOrdem = ordem.statusOrdem;
    this.aprovador = ordem.aprovador;
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

  public getDataCriacao(): Date {
    return this.dataCriacao;
  }

  public setDataCriacao(dataCriacao: Date): void {
    this.dataCriacao = dataCriacao;
  }

  public getDataAprovacao(): Date {
    return this.dataAprovacao;
  }

  public setDataAprovacao(dataAprovacao: Date): void {
    this.dataAprovacao = dataAprovacao;
  }

  public getTotalObras(): number {
    return this.totalObras;
  }

  public setTotalObras(totalObras: number): void {
    this.totalObras = totalObras;
  }

  public getTotalUnidades(): number {
    return this.totalUnidades;
  }

  public setTotalUnidades(totalUnidades: number): void {
    this.totalUnidades = totalUnidades;
  }

  public getStatusOrdem(): StatusOrdem {
    return this.statusOrdem;
  }

  public setStatusOrdem(statusOrdem: StatusOrdem): void {
    this.statusOrdem = statusOrdem;
  }

  public getAprovador(): Usuario {
    return this.aprovador;
  }

  public setAprovador(aprovador: Usuario): void {
    this.aprovador = aprovador;
  }
}
