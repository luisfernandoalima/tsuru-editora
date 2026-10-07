import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import showLog from "../utils/showLog.js";

import Usuario from "../class/Usuario.js";
import UsuarioDAO from "../dal/UsuarioDAO.js";

import { documentValidator } from "../utils/documentValidator.js";

export default class UsuarioController {
  #ACCESS_TOKEN = process.env.ACCESS_TOKEN_KEY;
  #dao = new UsuarioDAO();

  Criar = async (req, res) => {
    try {
      const { validateCPF } = documentValidator();

      const salt = await bcrypt.genSalt(10);

      const newUser = {
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

      const usuario = new Usuario(newUser);

      usuario.setSenha(await bcrypt.hash(usuario.getSenha(), salt));

      if (!validateCPF(usuario.getCPF())) {
        console.log(`O CPF ${usuario.getCPF()} é inválido`);

        return res.status(400).json({
          message: "CPF Inválido",
        });
      }

      if (!(await this.#dao.Criar(usuario))) {
        return res.status(400).json({
          message: "Erro ao cadastrar usuário",
        });
      }

      return res.status(201).json({
        message: "Usuário cadastrado!",
      });
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }
  };

  Consultar = async (req, res) => {
    const id = Number(req.params.id);

    const user = await this.#dao.Consultar(id);

    if (!user) {
      return res.status(400).json({
        message: "Erro ao buscar usuário",
        type: "error",
      });
    }

    return res.status(200).json(user);
  };

  Alterar = async (req, res) => {
    const user = {
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

    const usuario = new Usuario(user);

    if (!(await this.#dao.Alterar(usuario))) {
      return res.status(400).json({
        message: "Erro ao atualizar usuário",
        type: "error",
      });
    }

    return res.status(201).json({
      message: "Usuário atualizado!",
      type: "success",
    });
  };

  Excluir = async (req, res) => {
    const { id } = req.params;

    if (!(await this.#dao.Excluir(Number(id)))) {
      return res.status(400).json({
        message: "Erro ao excluir usuário",
        type: "error",
      });
    }

    return res.status(201).json({
      message: "Usuário excluído!",
      type: "success",
    });
  };

  Login = async (req, res) => {
    try {
      const { email, senha } = req.body;

      const user = await this.#dao.Login(email);
      showLog(`Tentativa de login no usuário: ${email}`);

      if (!user) {
        showLog(
          `Tentativa de login recusada. O usuário não foi encontrado no banco de dados.`,
        );
        return res.status(403).json({
          message: "Usuário ou senha inválidos",
        });
      }

      const usuario = new Usuario(user);

      const isMatch = await bcrypt.compare(senha, usuario.getSenha());

      if (!isMatch) {
        showLog(
          `Tentativa de login recusada. A senha não é a mesma registrada no banco de dados`,
        );
        return res.status(403).json({
          message: "Erro ao executar login",
        });
      }

      const token = jwt.sign(
        {
          id: usuario.getId(),
          email: usuario.getEmail(),
          funcao: usuario.getCargo(),
        },
        this.#ACCESS_TOKEN,
        {
          expiresIn: "5h",
        },
      );

      showLog(`Tentativa de Login aprovada.`);

      res.json({
        token,
        firstLogin: usuario.getPrimeiroLogin(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  atualizarSenha = async (req, res) => {
    try {
      const userInfo = req.user;

      const { password, repeatPassword } = req.body;

      if (!password || !repeatPassword || password != repeatPassword) {
        return res.status(400).json({
          message: "Erro ao atualizar senha.",
        });
      }

      const usuario = new Usuario(await this.#dao.Consultar(userInfo.id));

      if (!usuario) {
        return res.status(400).json({
          message: "Usuário não encontrado.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(password, salt);

      usuario.setSenha(newHash);
      usuario.setPrimeiroLogin(false);

      if (await this.#dao.Alterar(usuario)) {
        return res.status(200).json({
          message: "Senha alterada com sucesso!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }
  };

  listarUsuarios = async (req, res) => {
    const users = await this.#dao.listarUsuarios();

    if (!users) {
      return res.status(400).json({
        message: "Erro ao buscar usuário",
        type: "error",
      });
    }

    return res.status(201).json({
      users,
    });
  };

  listarUsuariosPorNome = async (req, res) => {
    try {
      const name = String(req.params.name);

      console.log(name);

      if (!name) {
        return res.status(400).json({
          message: "Erro ao buscar usuários",
          type: "error",
        });
      }

      const users = await this.#dao.listarUsuariosPorNome(name);

      console.log(users);

      if (!users) {
        return res.status(400).json({
          message: "Erro ao buscar usuário",
          type: "error",
        });
      }

      return res.status(201).json({
        users,
      });
    } catch (err) {
      return res.status(400).json({
        message: `Erro ao buscar usuário: ${err}`,
        type: "error",
      });
    }
  };
}
