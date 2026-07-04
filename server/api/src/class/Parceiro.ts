import Endereco from "./Endereco.js";
import type { IParceiro } from "../interfaces/IParceiro.js";

export default class Parceiro {
  private id?: number | undefined;
  private nome: string;
  private cnpj: string;
  private email: string;
  private contato: string;
  private ativo: boolean;
  private dataCadastro: Date;
  private enderecos: Endereco[];

  constructor(parceiro: IParceiro) {
    this.id = parceiro.id;
    this.nome = parceiro.nome;
    this.cnpj = parceiro.cnpj;
    this.email = parceiro.email;
    this.contato = parceiro.contato;
    this.ativo = parceiro.ativo;
    this.dataCadastro = parceiro.dataCadastro;
    this.enderecos = parceiro.enderecos;
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

  public getCnpj(): string {
    return this.cnpj;
  }

  public setCnpj(cnpj: string): void {
    this.cnpj = cnpj;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getContato(): string {
    return this.contato;
  }

  public setContato(contato: string): void {
    this.contato = contato;
  }

  public isAtivo(): boolean {
    return this.ativo;
  }

  public setAtivo(ativo: boolean): void {
    this.ativo = ativo;
  }

  public getDataCadastro(): Date {
    return this.dataCadastro;
  }

  public setDataCadastro(dataCadastro: Date): void {
    this.dataCadastro = dataCadastro;
  }

  public getEnderecos(): Endereco[] {
    return this.enderecos;
  }

  public setEnderecos(enderecos: Endereco[]): void {
    this.enderecos = enderecos;
  }
}
