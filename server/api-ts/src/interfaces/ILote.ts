import Produto from "../class/Produto.js";
import { StatusLote } from "../enums/StatusLote.js";

export interface ILote {
  id?: number;
  codigo: string;
  quantidade_inicial: number;
  quantidade_atual: number;
  data_criacao: Date;
  status: StatusLote;
  fk_ordem_impressao_id: number;
  fk_produto_id: number;
}
