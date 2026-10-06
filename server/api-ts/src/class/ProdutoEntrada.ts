import Registro from "./Registro.js";
import Produto from "./Produto.js";

export default class ProdutoEntrada extends Registro {
  constructor(produto: Produto, quantidade: number) {
    super(produto, quantidade, produto.getPreco() * quantidade);
  }
}
