import SaidaLote from "../class/SaidaLote.js";

const calcularPrecoTotal = (registro: SaidaLote[]) => {
  let valor = 0;

  registro.forEach((produto) => {
    valor += produto.getSubtotal();
  });

  return valor;
};

export default calcularPrecoTotal;
