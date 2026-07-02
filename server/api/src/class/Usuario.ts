import type { IUsuario } from "./../interfaces/Usuario.js";
export default class Usuario {
  constructor(user: IUsuario) {
    this._id = user.id;
    this._nome = user.nome;
    this._email = user.email;
    this._senha = user.senha;
    this._telefone = user.telefone;
    this._cpf = user.cpf;
    this._cargo = user.id_cargo;
  }

  private _id: number | null;
  private _nome: string;
  private _email: string;
  private _senha: string;
  private _telefone: string;
  private _cpf: string;
  private _cargo: number;

  getId = (): number | null => this._id;

  setId = (id: number) => {
    this._id = id;
  };

  getNome = (): string => this._nome;

  setNome = (nome: string) => {
    this._nome = nome;
  };

  getEmail = (): string => this._email;

  setEmail = (email: string) => {
    this._email = email;
  };

  setSenha = (senha: string) => (this._senha = senha);
  getSenha = (): string => this._senha;

  setTelefone = (telefone: string) => (this._telefone = telefone);
  getTelefone = (): string => this._telefone;

  setCPF = (cpf: string) => (this._cpf = cpf);
  getCPF = () => this._cpf;

  setCargo = (cargo: number) => (this._cargo = cargo);
  getCargo = (): number => this._cargo;
}
