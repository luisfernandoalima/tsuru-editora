export default class SaidaLote {
  #lote;
  #quantidade;
  #subtotal;
  #saida;

  constructor(lote, quantidade, subtotal, saida) {
    this.#lote = lote;
    this.#quantidade = quantidade;
    this.#subtotal = subtotal;

    if (saida) {
      this.#saida = saida;
    }
  }

  getLote = () => this.#lote;

  setLote = (lote) => {
    if (!lote) {
      return false;
    }

    this.#lote = lote;
    return true;
  };

  getSaida = () => this.#saida;

  setSaida = (saida) => {
    if (!saida) {
      return false;
    }

    this.#saida = saida;
    return true;
  };

  getQuantidade = () => this.#quantidade;

  setQuantidade = (quantidade) => {
    if (quantidade <= 0) {
      return false;
    }

    this.#quantidade = quantidade;
    return true;
  };

  getSubtotal = () => this.#subtotal;

  setSubtotal = (subtotal) => {
    if (subtotal < 0) {
      return false;
    }

    this.#subtotal = subtotal;
    return true;
  };
}
