import Endereco from "../class/Endereco.js";
export interface IParceiro {
  id?: number;
  nome: string;
  cnpj: string;
  email: string;
  contato: string;
  ativo: boolean;
  data_cadastro: Date;
  enderecos: Endereco[] | undefined;
}
