import Devolucao from "../class/Devolucao.js";
import { StatusCampanha } from "../enums/StatusCampanha.js";

export interface ICampanhaDoacao {
  id?: number;
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFinal: Date;
  statusCampanha: StatusCampanha;
  devolucoes: Devolucao[];
}
