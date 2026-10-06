import type { IDevolucao } from "../interfaces/IDevolucao.js";

export default class Credito {
  private valor_original: number;
  private valor_atual: number;

  constructor(valorAtual?: number, valorTotal?: number) {
    this.valor_original = valorTotal || 0;
    this.valor_atual = valorAtual || 0;
  }

  public getValorOriginal(): number {
    return this.valor_original;
  }

  public setValorOriginal(valor_original: number): void {
    this.valor_original = valor_original;
  }

  public getValorAtual(): number {
    return this.valor_atual;
  }

  public setValorAtual(valor_atual: number): void {
    this.valor_atual = valor_atual;
  }
}
