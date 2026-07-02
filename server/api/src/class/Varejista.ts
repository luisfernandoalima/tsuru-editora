import Endereco from "./Endereco.js";
import type { IVarejista } from "../interfaces/IVarejista.js";

export default class Varejista {
  private id?: number | undefined;
  private nome: string;
  private cnpj: string;
  private email: string;
  private contato: string;
  private ativo: boolean;
  private dataCadastro: Date;
  private enderecos: Endereco[];

  constructor(varejista: IVarejista) {
    this.id = varejista.id;
    this.nome = varejista.nome;
    this.cnpj = varejista.cnpj;
    this.email = varejista.email;
    this.contato = varejista.contato;
    this.ativo = varejista.ativo;
    this.dataCadastro = varejista.dataCadastro;
    this.enderecos = varejista.enderecos;
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
