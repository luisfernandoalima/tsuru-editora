import Usuario from "../class/Usuario.js";
import { StatusOrdem } from "../enums/StatusOrdem.js";

export interface IOrdemDeImpressao {
  id?: number;
  nome: string;
  dataCriacao: Date;
  dataAprovacao: Date;
  totalObras: number;
  totalUnidades: number;
  statusOrdem: StatusOrdem;
  aprovador: Usuario;
}
