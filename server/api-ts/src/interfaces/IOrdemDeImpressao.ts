import Usuario from "../class/Usuario.js";
import { StatusOrdem } from "../enums/StatusOrdem.js";

export interface IOrdemDeImpressao {
  id?: number;
  nome: string;
  data_criacao: Date;
  data_aprovacao: Date | null;
  total_obras: number | null;
  total_unidades: number | null;
  status: StatusOrdem;
  fk_usuario_criador_id: Usuario;
  fk_usuario_aprovador_id: Usuario | null;
}
