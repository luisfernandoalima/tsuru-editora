export const loteNomeador = (order, item) => {
  let nomeLote;

  const nomeOrdem = order.getNome();

  nomeLote = nomeOrdem.replace("OP-", "") + " " + item.getIsbn13();

  console.log(nomeLote);

  return nomeLote;
};
