import Usuario from "./Usuario.js";
import { StatusOrdem } from "../enums/StatusOrdem.js";
import type { IOrdemDeImpressao } from "../interfaces/IOrdemDeImpressao.js";

export default class OrdemDeImpressao {
  private id?: number | undefined;
  private nome: string;
  private dataCriacao: Date;
  private dataFechamento: Date | null;
  private totalObras: number | null;
  private totalUnidades: number | null;
  private statusOrdem: StatusOrdem;
  private criador: Usuario;
  private aprovador: Usuario | null;

  constructor(ordem: IOrdemDeImpressao) {
    this.id = ordem.id;
    this.nome = ordem.nome;
    this.dataCriacao = new Date(ordem.data_criacao);
    this.dataFechamento = ordem.data_aprovacao;
    this.totalObras = ordem.total_obras;
    this.totalUnidades = ordem.total_unidades;
    this.statusOrdem = ordem.status;
    this.criador = ordem.fk_usuario_criador_id;
    this.aprovador = ordem.fk_usuario_aprovador_id;
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

  public getDataAprovacao(): Date | null {
    return this.dataFechamento;
  }

  public setDataAprovacao(dataFechamento: Date): void {
    this.dataFechamento = dataFechamento;
  }

  public getTotalObras(): number | null {
    return this.totalObras;
  }

  public setTotalObras(totalObras: number): void {
    this.totalObras = totalObras;
  }

  public getTotalUnidades(): number | null {
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

  public getCriador(): Usuario {
    return this.criador;
  }

  public setCriador(criador: Usuario): void {
    this.criador = criador;
  }

  public getAprovador(): Usuario | null {
    return this.aprovador;
  }

  public setAprovador(aprovador: Usuario): void {
    this.aprovador = aprovador;
  }
}
