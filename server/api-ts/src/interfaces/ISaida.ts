import ProdutoSaida from "../class/SaidaLote.js";
import Endereco from "../class/Endereco.js";
import Usuario from "../class/Usuario.js";

import { TipoPagamento } from "../enums/TipoPagamento.js";

export interface ISaida {
  id: number | null;
  numero_cupom_fiscal: string;
  data_saida: Date;
  valor_total: number;
  credito_usado: number;
  valor_final: number;
  tipoPagamento: TipoPagamento;
  produtos: ProdutoSaida[] | [];
  endereco: Endereco;
  colaborador: Usuario;
}
