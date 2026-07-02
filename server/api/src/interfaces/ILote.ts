import Produto from "../class/Produto.js";
import { StatusLote } from "../enums/StatusLote.js";

export interface ILote {
  id?: number;
  codigo: string;
  quantidadeInicial: number;
  quantidadeAtual: number;
  statusLote: StatusLote;
  produto: Produto;
}
