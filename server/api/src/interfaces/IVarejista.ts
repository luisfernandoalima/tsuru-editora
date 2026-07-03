import Endereco from "../class/Endereco.js";
export interface IVarejista {
  id?: number;
  nome: string;
  cnpj: string;
  email: string;
  contato: string;
  ativo: boolean;
  dataCadastro: Date;
  enderecos: Endereco[];
}
