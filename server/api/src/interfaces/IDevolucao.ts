import Varejista from "../class/Varejista.js";

export interface IDevolucao {
  id?: number;
  dataDevolucao: number;
  saldoAtual: number;
  varejista: Varejista;
}
