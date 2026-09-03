export interface IUsuario {
  id: number | null;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  ativo: boolean;
  primeiro_login: boolean;
  id_cargo: number;
}
