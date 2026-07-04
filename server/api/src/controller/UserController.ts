import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { IUsuario } from "../interfaces/IUsuario.js";
import Usuario from "../class/Usuario.js";
import UsuarioDAO from "../dal/UsuarioDAO.js";
export default class UserController {
  private ACCESS_TOKEN = process.env.ACCESS_TOKEN_KEY;

  private dao = new UsuarioDAO();

  Criar = async (req: Request, res: Response) => {
    const newUser: IUsuario = {
      id: null,
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      telefone: req.body.telefone,
      cpf: req.body.cpf,
      id_cargo: req.body.cargo,
    };

    const usuario: Usuario = new Usuario(newUser);

    if (!(await this.dao.Criar(usuario))) {
      return res
        .status(400)
        .json({ message: "Erro ao cadastrar usuário", type: "error" });
    }

    return res
      .status(201)
      .json({ message: "Usuário cadastrado!", type: "success" });
  };

  Consultar = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const user = await this.dao.Consultar(id);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Erro ao buscar usuário", type: "error" });
    }

    return res.status(200).json(user);
  };

  Alterar = async (req: Request, res: Response) => {
    const user: IUsuario = {
      id: req.body.id,
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      telefone: req.body.telefone,
      cpf: req.body.cpf,
      id_cargo: req.body.cargo,
    };

    const usuario: Usuario = new Usuario(user);

    if (!(await this.dao.Alterar(usuario))) {
      return res
        .status(400)
        .json({ message: "Erro ao atualizar usuário", type: "error" });
    }

    return res
      .status(201)
      .json({ message: "Usuário atualizado!", type: "success" });
  };

  Excluir = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!(await this.dao.Excluir(Number(id)))) {
      return res
        .status(400)
        .json({ message: "Erro ao excluir usuário", type: "error" });
    }

    return res
      .status(201)
      .json({ message: "Usuário excluído!", type: "success" });
  };

  Login = async (req: Request, res: Response) => {
    console.log("Password type:", typeof process.env.DB_PASSWORD);
    console.log("Password value:", process.env.DB_PASSWORD);
    const { email, senha } = req.body;

    const user = await this.dao.Login(email, senha);

    if (!user) {
      return res
        .status(403)
        .json({ message: "Erro ao executar login", type: "error" });
    }

    const usuario: Usuario = new Usuario(user);

    const token = jwt.sign(
      {
        id: usuario.getId(),
        email: usuario.getEmail(),
        funcao: usuario.getCargo(),
      },
      this.ACCESS_TOKEN!,
      {
        expiresIn: "1h",
      },
    );

    console.log("Password type:", typeof process.env.ACCESS_TOKEN_KEY);
    console.log("Password value:", process.env.ACCESS_TOKEN_KEY);

    res.json({ token });
  };

  listarUsuarios = async (req: Request, res: Response) => {
    const users = await this.dao.listarUsuarios();

    if (!users) {
      return res
        .status(400)
        .json({ message: "Erro ao buscar usuário", type: "error" });
    }

    return res.status(201).json({ users });
  };

  listarUsuariosPorNome = async (req: Request, res: Response) => {
    try {
      const name = String(req.params.name);
      console.log(name);

      if (!name) {
        return res
          .status(400)
          .json({ message: "Erro ao buscar usuários", type: "error" });
      }

      const users = await this.dao.listarUsuariosPorNome(name);

      console.log(users);

      if (!users) {
        return res
          .status(400)
          .json({ message: "Erro ao buscar usuário", type: "error" });
      }

      return res.status(201).json({ users });
    } catch (err) {
      return res
        .status(400)
        .json({ message: `Erro ao buscar usuário: ${err}`, type: "error" });
    }
  };
}
