export default class Usuario {
  // #id;
  // #nome;
  // #email;
  // #senha;
  // #telefone;
  // #cpf;
  // #cargo;
  // #ativo;
  // #privateprimeiroLogin;

  constructor(user) {
    this.id = user.id;
    this.nome = user.nome;
    this.email = user.email;
    this.senha = user.senha;
    this.telefone = user.telefone;
    this.cpf = user.cpf;
    this.cargo = user.perfil;
    this.ativo = user.ativo;
    this.primeiroLogin = user.primeiro_login;
  }

  getId = () => this.id;

  setId = (id) => {
    this.id = id;
  };

  getNome = () => this.nome;

  setNome = (nome) => {
    this.nome = nome;
  };

  getEmail = () => this.email;

  setEmail = (email) => {
    this.email = email;
  };

  setSenha = (senha) => (this.senha = senha);

  getSenha = () => this.senha;

  setTelefone = (telefone) => (this.telefone = telefone);

  getTelefone = () => this.telefone;

  setCPF = (cpf) => (this.cpf = cpf);

  getCPF = () => this.cpf;

  setCargo = (cargo) => (this.cargo = cargo);

  getCargo = () => this.cargo;

  setAtivo = (ativo) => (this.ativo = ativo);

  getAtivo = () => this.ativo;

  setPrimeiroLogin = (primeiroLogin) => (this.primeiroLogin = primeiroLogin);

  getPrimeiroLogin = () => this.primeiroLogin;
}
