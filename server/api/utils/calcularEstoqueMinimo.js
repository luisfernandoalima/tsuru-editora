export function calcularEstoqueMinimo({
  consumoDiario,
  leadTimeDias,
  nivelServicoZ = 1.65,
}) {
  const n = consumoDiario.length;
  if (n < 2) throw new Error("Histórico insuficiente para o cálculo");

  const media = consumoDiario.reduce((acc, v) => acc + v, 0) / n;
  const variancia =
    consumoDiario.reduce((acc, v) => acc + (v - media) ** 2, 0) / (n - 1);
  const desvioPadrao = Math.sqrt(variancia);

  const consumoNoLeadTime = Math.ceil(media * leadTimeDias);
  const estoqueSeguranca = Math.ceil(
    nivelServicoZ * desvioPadrao * Math.sqrt(leadTimeDias),
  );

  return {
    consumoMedio: Number(media.toFixed(2)),
    desvioPadrao: Number(desvioPadrao.toFixed(2)),
    estoqueSeguranca,
    estoqueMinimo: consumoNoLeadTime + estoqueSeguranca, // = ponto de pedido
  };
}
