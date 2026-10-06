export default class Credito {
  #valor_original;
  #valor_atual;

  constructor(valorAtual, valorTotal) {
    this.#valor_original = valorTotal || 0;
    this.#valor_atual = valorAtual || 0;
  }

  getValorOriginal() {
    return this.#valor_original;
  }

  setValorOriginal(valor_original) {
    this.#valor_original = valor_original;
  }

  getValorAtual() {
    return this.#valor_atual;
  }

  setValorAtual(valor_atual) {
    this.#valor_atual = valor_atual;
  }
}
