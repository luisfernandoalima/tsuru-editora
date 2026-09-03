import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import type { IUsuario } from "../interfaces/IUsuario.js";
import Usuario from "../class/Usuario.js";
import UsuarioDAO from "../dal/UsuarioDAO.js";

import { documentValidator } from "../utils/documentValidator.js";
export default class UserController {
  private ACCESS_TOKEN = process.env.ACCESS_TOKEN_KEY;

  private dao = new UsuarioDAO();

  Criar = async (req: Request, res: Response) => {
    try {
      const { validateCPF } = documentValidator();

      const salt = await bcrypt.genSalt(10);

      const newUser: IUsuario = {
        id: null,
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        ativo: true,
        primeiro_login: true,
        perfil: req.body.cargo,
      };

      const usuario: Usuario = new Usuario(newUser);

      usuario.setSenha(await bcrypt.hash(usuario.getSenha(), salt));

      if (!validateCPF(usuario.getCPF())) {
        console.log(`O CPF ${usuario.getCPF()} é inválido`);
        return res.status(400).json({ message: "CPF Inválido" });
      }
      if (!(await this.dao.Criar(usuario))) {
        return res.status(400).json({ message: "Erro ao cadastrar usuário" });
      }

      return res.status(201).json({ message: "Usuário cadastrado!" });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
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
      ativo: true,
      primeiro_login: true,
      perfil: req.body.cargo,
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
    try {
      const { email, senha } = req.body;

      const user = await this.dao.Login(email);

      if (!user) {
        return res.status(403).json({ message: "Erro ao executar login" });
      }

      const usuario: Usuario = new Usuario(user);

      const isMatch = await bcrypt.compare(senha, usuario.getSenha());

      if (!isMatch) {
        return res.status(403).json({ message: "Erro ao executar login" });
      }

      console.log(usuario);

      const token = jwt.sign(
        {
          id: usuario.getId(),
          email: usuario.getEmail(),
          funcao: usuario.getCargo(),
        },
        this.ACCESS_TOKEN!,
        {
          expiresIn: "5h",
        },
      );

      res.json({ token });
    } catch (error) {
      console.log(error);
    }
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
