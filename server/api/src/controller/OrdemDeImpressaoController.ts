import OrdemDeImpressao from "../class/OrdemDeImpressao.js";
import OrdemDeImpressaoDAO from "../dal/OrdemDeImpressaoDAO.js";

import type { Request, Response } from "express";
import type { IOrdemDeImpressao } from "../interfaces/IOrdemDeImpressao.js";
import LoteController from "./LoteController.js";
import type Produto from "../class/Produto.js";

import type { IUsuario } from "../interfaces/IUsuario.js";
import UsuarioDAO from "../dal/UsuarioDAO.js";
import Usuario from "../class/Usuario.js";

export default class OrdemDeImpressaoController {
  private dao = new OrdemDeImpressaoDAO();

  Criar = async (req: Request, res: Response) => {
    try {
      const reqInfo: IOrdemDeImpressao = {
        nome: req.body.nome,
        dataCriacao: req.body.dataCriacao,
        dataFechamento: null,
        totalObras: null,
        totalUnidades: null,
        statusOrdem: req.body.statusOrdem,
        aprovador: req.body.aprovador,
      };

      const novaOrdem = new OrdemDeImpressao(reqInfo);

      if (await this.dao.Criar(novaOrdem)) {
        res.status(201).json({ message: `Ordem criada com sucesso!` });
      }
    } catch (err) {
      console.log(`Erro ao criar nova Ordem de Impressão: ${err}`);
      res.status(400).json({ message: `Erro ao criar Ordem: ${err}` });
    }
  };
  Alterar = async (req: Request, res: Response) => {
    try {
      return true;
    } catch (err) {
      console.log(`Erro ao atualizar Ordem de Impressão: ${err}`);
      return false;
    }
  };
  Consultar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const ordem = new OrdemDeImpressao(await this.dao.Consultar(id));

      res.status(200).json({ ordem });
    } catch (err) {
      console.log(`Erro ao consultar Ordem: ${err}`);
      res.status(400).json({ message: `Erro ao consultar Ordem: ${err}` });
    }
  };
  Rejeitar = async (req: Request, res: Response) => {
    try {
      const usuarioDAO = new UsuarioDAO();

      const { id } = req.body.id;
      const userInfo = (req as any).user;

      const user = new Usuario(await usuarioDAO.Consultar(userInfo.id));

      const userId = user.getId();

      if (userId === null) {
        console.log(`Erro ao buscar ID de colaborador: ${userId}`);
        return res
          .status(400)
          .json({ message: `Erro ao buscar ID de colaborador...` });
      }

      if (user.getCargo() === 2) {
        if (await this.dao.Rejeitar(id, userId)) {
          res.status(200).json({ message: `Ordem rejeitada com sucesso!` });
        }

        return true;
      }
    } catch (err) {
      console.log(`Erro ao rejeitar Ordem de Impressão: ${err}`);
      res
        .status(400)
        .json({ message: `Erro ao mudar status da Ordem: ${err}` });
    }
  };
  Aprovar = async (req: Request, res: Response) => {
    try {
      const usuarioDAO = new UsuarioDAO();

      const { id } = req.body.id;
      const userInfo = (req as any).user;

      const user = new Usuario(await usuarioDAO.Consultar(userInfo.id));

      const userId = user.getId();

      if (userId === null) {
        return res
          .status(400)
          .json({ message: `Erro ao buscar ID de colaborador...` });
      }

      if (user.getCargo() == 1) {
        if (await this.dao.Aprovar(id, userId)) {
          res.status(200).json({ message: `Ordem aprovada com sucesso!` });
        }

        return true;
      }
    } catch (err) {
      console.log(`Erro ao aprovar Ordem de Impressão: ${err}`);
      res
        .status(400)
        .json({ message: `Erro ao mudar status da Ordem: ${err}` });
    }
  };

  Listar = async (req: Request, res: Response) => {
    try {
      const ordersDB = await this.dao.Listar();

      const orders: OrdemDeImpressao[] = [];

      res.status(200).json({ orders });
    } catch (err) {
      console.log(`Erro ao buscar Ordem de Impressão: ${err}`);
      res.status(400).json({
        message: `Erro ao buscar Ordem de Impressão: ${err}`,
      });
    }
  };
  Buscar = async (req: Request, res: Response) => {};
  salvarProdutos = async (req: Request, res: Response) => {
    try {
      const reqItems = req.body.items;

      const loteController = new LoteController();

      const reqInfo: Produto[] = [];

      reqInfo.forEach((item) => {
        loteController.Criar(item);
      });

      res.status(201).json({ message: `Produtos salvos com sucesso!` });
    } catch (err) {
      console.log(`Erro ao salvar produtos na Ordem de Impressão: ${err}`);
      res.status(400).json({
        message: `Erro ao salvar produtos na Ordem de Impressão: ${err}`,
      });
    }
  };
}
