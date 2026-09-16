import OrdemDeImpressao from "../class/OrdemDeImpressao.js";
import OrdemDeImpressaoDAO from "../dal/OrdemDeImpressaoDAO.js";

import type { Request, Response } from "express";
import type { IOrdemDeImpressao } from "../interfaces/IOrdemDeImpressao.js";
import LoteController from "./LoteController.js";
import Produto from "../class/Produto.js";

import type { IUsuario } from "../interfaces/IUsuario.js";
import UsuarioDAO from "../dal/UsuarioDAO.js";
import Usuario from "../class/Usuario.js";
import { ProdutoDAO } from "../dal/ProdutoDAO.js";
import LoteDAO from "../dal/LoteDAO.js";
import { loteNomeador } from "../utils/loteNomeador.js";
type TLoteProduto = {
  produto: Produto;
  quantidade: number;
};
export default class OrdemDeImpressaoController {
  private dao = new OrdemDeImpressaoDAO();

  Criar = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const usuarioDAO = new UsuarioDAO();

      const usuario = new Usuario(await usuarioDAO.Consultar(user.id));

      if (!usuario) {
        return res.status(400).json({ message: "Erro ao encontrar usuário" });
      }

      const reqInfo: IOrdemDeImpressao = {
        nome: req.body.nome,
        data_criacao: new Date(),
        data_aprovacao: null,
        total_obras: null,
        total_unidades: null,
        status: req.body.status,
        fk_usuario_criador_id: usuario,
        fk_usuario_aprovador_id: null,
      };

      const novaOrdem = new OrdemDeImpressao(reqInfo);

      console.log(novaOrdem);

      if (await this.dao.Criar(novaOrdem)) {
        res.status(201).json({ message: `Ordem criada com sucesso!` });
      }
    } catch (err) {
      console.log(`Erro ao criar nova Ordem de Impressão: ${err}`);
      res.status(400).json({ message: `Erro ao criar Ordem: ${err}` });
    }
  };

  Consultar = async (req: Request, res: Response) => {
    try {
      const usuarioDAO = new UsuarioDAO();
      const id = Number(req.params.id);
      const ordemDB = await this.dao.Consultar(id);

      const usuario = new Usuario(
        await usuarioDAO.Consultar(ordemDB.fk_usuario_criador_id),
      );

      const ordem = new OrdemDeImpressao(ordemDB);

      ordem.setCriador(usuario);

      // console.log(ordem);

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

      const { id } = req.body;
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
    console.log("OI");
    try {
      const orders: OrdemDeImpressao[] = [];

      const ordersDB = await this.dao.Listar();

      if (!ordersDB) {
        return res.status(400).json({
          message: `Erro ao buscar Ordem de Impressão.`,
        });
      }

      ordersDB.forEach((item) => {
        orders.push(new OrdemDeImpressao(item));
      });

      res.status(200).json({ orders });
    } catch (err) {
      console.log(`Erro ao buscar Ordem de Impressão: ${err}`);
      res.status(400).json({
        message: `Erro ao buscar Ordem de Impressão: ${err}`,
      });
    }
  };
  salvarProdutos = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;

      const ordem = new OrdemDeImpressao(await this.dao.Consultar(orderId));

      const loteController = new LoteController();
      const loteDAO = new LoteDAO();
      const produtoDAO = new ProdutoDAO();

      // Lotes que já existem no banco
      const lotesBanco = await loteDAO.Consultar(orderId);

      const produtos: TLoteProduto[] = [];
      const lotesRecebidos: string[] = [];

      let quantidadeObra = 0;
      let quantidadeUnidade = 0;

      // ==========================================
      // 1. Processar produtos enviados pelo front
      // ==========================================

      for (const item of req.body.items) {
        const produtoBD = await produtoDAO.Consultar(item.produto._id);

        if (!produtoBD) {
          return res.status(404).json({
            message: "Produto não encontrado",
          });
        }

        const produto = new Produto(produtoBD);
        const quantidade = Number(item.quantidade);

        quantidadeObra++;
        quantidadeUnidade += item.quantidade;

        // Nome único do lote
        const nomeLote = loteNomeador(ordem, produto);

        lotesRecebidos.push(nomeLote);

        produtos.push({
          produto,
          quantidade,
        });
      }

      if (
        ordem.getTotalObras() != quantidadeObra ||
        ordem.getTotalUnidades() != quantidadeUnidade
      ) {
        ordem.setTotalObras(quantidadeObra);
        ordem.setTotalUnidades(quantidadeUnidade);

        if (await this.dao.Alterar(ordem)) {
          console.log(`A ordem ${ordem.getNome()} foi alterada com sucesso!`);
        }
      }

      // ==========================================
      // 2. Criar ou atualizar os lotes
      // ==========================================

      for (const item of produtos) {
        const nomeLote = loteNomeador(ordem, item.produto);

        const loteExistente = lotesBanco.find(
          (lote) => lote.codigo === nomeLote,
        );

        if (loteExistente) {
          // Já existe → atualizar
          if (!loteExistente.id) {
            return;
          }
          await loteDAO.Atualizar(loteExistente.id, item.quantidade);
        } else {
          // Não existe → criar
          await loteController.Criar(item.produto, ordem, item.quantidade);
        }
      }

      // ==========================================
      // 3. Deletar lotes removidos no frontend
      // ==========================================

      for (const lote of lotesBanco) {
        if (!lotesRecebidos.includes(lote.codigo)) {
          if (!lote.id) return;
          await loteDAO.Deletar(lote.id);
        }
      }

      return res.status(200).json({
        message: "Produtos sincronizados com sucesso!",
      });
    } catch (err) {
      console.log(`Erro ao salvar produtos na Ordem de Impressão: ${err}`);

      return res.status(400).json({
        message: `Erro ao salvar produtos na Ordem de Impressão: ${err}`,
      });
    }
  };

  listarProdutos = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.dao.listarProdutos(Number(id));

      const produtos: TLoteProduto[] = [];

      result.forEach((item) => {
        let quantidade = item.quantidade_inicial;
        delete item.quantidade_inicial;
        let produto = new Produto(item);

        produtos.push({ produto, quantidade });
      });

      return res.status(200).json({
        produtos,
      });
    } catch (error) {
      console.log(`Erro ao salvar produtos na Ordem de Impressão: ${error}`);
      res.status(400).json({
        message: `Erro ao salvar produtos na Ordem de Impressão: ${error}`,
      });
    }
  };
}
