import type Lote from "./Lote.js";
import type Saida from "./Saida.js";

export default class SaidaLote {
  private lote: Lote;
  private saida?: Saida;
  private subtotal: number;
  private quantidade: number;

  constructor(lote: Lote, quantidade: number, subtotal: number, saida?: Saida) {
    this.lote = lote;
    this.quantidade = quantidade;
    this.subtotal = subtotal;
    if (saida) this.saida = saida;
  }

  getLote = (): Lote => this.lote;

  setLote = (lote: Lote): boolean => {
    if (!lote) {
      return false;
    }

    this.lote = lote;
    return true;
  };

  getSaida = () => this.saida;

  setSaida = (saida: Saida): boolean => {
    if (!saida) {
      return false;
    }

    this.saida = saida;
    return true;
  };

  getQuantidade = (): number => this.quantidade;

  setQuantidade = (quantidade: number): boolean => {
    if (quantidade <= 0) {
      return false;
    }

    this.quantidade = quantidade;
    return true;
  };

  getSubtotal = (): number => this.subtotal;

  setSubtotal = (subtotal: number): boolean => {
    if (subtotal < 0) {
      return false;
    }

    this.subtotal = subtotal;
    return true;
  };
}
