import ProdutoSaida from "../class/ProdutoSaida.js";
import Usuario from "../class/Usuario.js";

import { TipoPagamento } from "../enums/TipoPagamento.js";

export interface ISaida {
  id: number | null;
  cupomFiscal: string;
  precoTotal: number;
  data: Date;
  cliente: String;
  cpfCliente: String;
  tipoPagamento: TipoPagamento;
  produtos: ProdutoSaida[] | [];
  colaborador: Usuario;
}
