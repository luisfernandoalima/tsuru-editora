import type { IDevolucao } from "./../interfaces/IDevolucao.js";
import type { CampanhaDoacao } from "./CampanhaDoacao.js";
import Credito from "./Credito.js";
import type Parceiro from "./Parceiro.js";

export default class Devolucao {
  private id?: number;
  private data_devolucao: number;
  private motivo: string;
  private credito: Credito;
  private parceiro?: Parceiro;
  private campanha?: CampanhaDoacao;

  constructor(devolucao: IDevolucao) {
    if (devolucao.id !== undefined) {
      this.id = devolucao.id;
    }

    this.data_devolucao = devolucao.data_devolucao;
    this.motivo = devolucao.motivo;

    this.credito = new Credito(devolucao.valor_atual, devolucao.valor_original);
  }

  public getId(): number | undefined {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getDataDevolucao(): number {
    return this.data_devolucao;
  }

  public setDataDevolucao(data_devolucao: number): void {
    this.data_devolucao = data_devolucao;
  }

  public getMotivo(): string {
    return this.motivo;
  }

  public setMotivo(motivo: string): void {
    this.motivo = motivo;
  }

  public getParceiro() {
    return this.parceiro;
  }

  public setParceiro(parceiro: Parceiro): void {
    this.parceiro = parceiro;
  }

  public getCampanha() {
    return this.campanha;
  }

  public setCampanha(campanha: CampanhaDoacao): void {
    this.campanha = campanha;
  }

  public getCredito() {
    return this.credito;
  }

  public setCredito(credito: Credito) {
    this.credito = credito;
  }
}
