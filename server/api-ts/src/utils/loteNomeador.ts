import type OrdemDeImpressao from "../class/OrdemDeImpressao.js";
import type Produto from "../class/Produto.js";

export const loteNomeador = (order: OrdemDeImpressao, item: Produto) => {
  let nomeLote;

  let nomeOrdem = order.getNome();

  nomeLote = nomeOrdem.replace("OP-", "") + " " + item.getIsbn13();

  console.log(nomeLote);

  return nomeLote;
};
