import Parceiro from "../class/Parceiro.js";

export interface IDevolucao {
  id?: number;
  dataDevolucao: number;
  saldoAtual: number;
  parceiro: Parceiro;
}
