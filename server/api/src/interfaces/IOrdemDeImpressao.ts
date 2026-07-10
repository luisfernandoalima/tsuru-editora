import Usuario from "../class/Usuario.js";
import { StatusOrdem } from "../enums/StatusOrdem.js";

export interface IOrdemDeImpressao {
  id?: number;
  nome: string;
  dataCriacao: Date;
  dataFechamento: Date | null;
  totalObras: number | null;
  totalUnidades: number | null;
  statusOrdem: StatusOrdem;
  aprovador: Usuario;
}
