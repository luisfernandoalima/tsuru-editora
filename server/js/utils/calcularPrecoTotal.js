const calcularPrecoTotal = (registro) => {
  let valor = 0;

  registro.forEach((produto) => {
    valor += produto.getSubtotal();
  });

  return valor;
};

export default calcularPrecoTotal;
