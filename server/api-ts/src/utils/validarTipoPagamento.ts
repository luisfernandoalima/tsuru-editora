import { TipoPagamento } from "../enums/TipoPagamento.js";

const validarTipoPagamento = (tipoPagamento: any) => {
  return Object.values(TipoPagamento).includes(tipoPagamento);
};

export default validarTipoPagamento;
