import type { IEndereco } from "./../interfaces/IEndereco.js";

export default class Endereco {
  private id?: number | undefined;
  private cep: string;
  private logradouro: string;
  private numero: string;
  private bairro: string;
  private cidade: string;
  private estado: string;

  constructor(endereco: IEndereco) {
    this.id = endereco.id;
    this.cep = endereco.cep;
    this.logradouro = endereco.logradouro;
    this.numero = endereco.numero;
    this.bairro = endereco.bairro;
    this.cidade = endereco.cidade;
    this.estado = endereco.estado;
  }

  public getId(): number | undefined {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getCep(): string {
    return this.cep;
  }

  public setCep(cep: string): void {
    this.cep = cep;
  }

  public getLogradouro(): string {
    return this.logradouro;
  }

  public setLogradouro(logradouro: string): void {
    this.logradouro = logradouro;
  }

  public getNumero(): string {
    return this.numero;
  }

  public setNumero(numero: string): void {
    this.numero = numero;
  }

  public getBairro(): string {
    return this.bairro;
  }

  public setBairro(bairro: string): void {
    this.bairro = bairro;
  }

  public getCidade(): string {
    return this.cidade;
  }

  public setCidade(cidade: string): void {
    this.cidade = cidade;
  }

  public getEstado(): string {
    return this.estado;
  }

  public setEstado(estado: string): void {
    this.estado = estado;
  }
}
