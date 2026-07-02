import ProdutoEntrada from "../class/ProdutoEntrada.js";
import Usuario from "../class/Usuario.js";

export interface IEntrada {
  id: number | null;
  cupomFiscal: string;
  data: Date;
  nomeFornecedor: String;
  cnpjFornecedor: String;
  precoTotal: number;
  produtos: ProdutoEntrada[];
  colaborador: Usuario;
}
