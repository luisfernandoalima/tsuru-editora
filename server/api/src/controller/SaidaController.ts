import type { Request, Response } from "express";
import Saida from "../class/Saida.js";
import SaidaLoteDAO from "../dal/SaidaLoteDAO.js";
import SaidaDAO from "../dal/SaidaDAO.js";
import type { ISaida } from "../interfaces/ISaida.js";

import validarTipoPagamento from "../utils/validarTipoPagamento.js";
import calcularPrecoTotal from "../utils/calcularPrecoTotal.js";

import Usuario from "../class/Usuario.js";
import UsuarioDAO from "../dal/UsuarioDAO.js";
import type { IUsuario } from "../interfaces/IUsuario.js";
import SaidaLote from "../class/SaidaLote.js";
import Produto from "../class/Produto.js";
import { ProdutoDAO } from "../dal/ProdutoDAO.js";
import EnderecoDAO from "../dal/EnderecoDAO.js";
import Endereco from "../class/Endereco.js";
import type { IEndereco } from "../interfaces/IEndereco.js";
import LoteDAO from "../dal/LoteDAO.js";
import type { ILote } from "../interfaces/ILote.js";
import Lote from "../class/Lote.js";

export default class SaidaController {
  private dao = new SaidaDAO();

  Registrar = async (req: Request, res: Response) => {
    try {
      const { saida, produtos } = req.body;

      const produtoDAO = new ProdutoDAO();
      const loteDAO = new LoteDAO();
      const saidaLoteDAO = new SaidaLoteDAO();
      const usuarioDAO = new UsuarioDAO();
      const enderecoDAO = new EnderecoDAO();

      const userInfo = (req as any).user;
      const userResult: IUsuario = await usuarioDAO.Consultar(userInfo.id);
      const user = new Usuario(userResult);

      const enderecoBD = await enderecoDAO.Consultar(saida.endereco_id);
      const endereco = new Endereco(enderecoBD);

      const listaSaidaLote: SaidaLote[] = [];

      for (const item of produtos) {
        const produtoBanco = await produtoDAO.Consultar(item.produto_id);

        if (!produtoBanco) {
          return res.status(404).json({
            message: "Produto não encontrado.",
          });
        }

        const produto = new Produto(produtoBanco);

        const lotesDisponiveis: ILote[] =
          await loteDAO.consultarPorProduto(produto);

        let quantidadeRestante = item.quantidade;

        for (const loteBanco of lotesDisponiveis) {
          if (quantidadeRestante <= 0) break;

          const lote = new Lote(loteBanco);
          const quantidadeAbatida = Math.min(
            lote.getQuantidadeAtual(),
            quantidadeRestante,
          );

          if (quantidadeAbatida <= 0) continue;

          const saidaLote = new SaidaLote(
            lote,
            item.quantidade,
            item.quantidade * produto.getPreco(),
          );

          listaSaidaLote.push(saidaLote);

          quantidadeRestante -= quantidadeAbatida;
        }
        if (quantidadeRestante > 0) {
          return res.status(400).json({
            message: `Estoque insuficiente para o produto ${produto.getTitulo?.() ?? item.produto_id}.`,
          });
        }
      }

      const saidaInfo: ISaida = {
        id: null,
        numero_cupom_fiscal: saida.numero_cupom_fiscal,
        data_saida: new Date(),
        tipoPagamento: saida.metodo_pagamento,
        valor_total: saida.valor_total,
        credito_usado: saida.credito_usado,
        valor_final: saida.valor_final,
        produtos: listaSaidaLote,
        endereco: endereco,
        colaborador: user,
      };

      const novaSaida = new Saida(saidaInfo);

      if (!validarTipoPagamento(novaSaida.getTipoPagamento()))
        return res.status(400).json({
          message: "Erro ao registrar saída, erro de pagamento",
          type: "error",
        });

      const precoTotal = calcularPrecoTotal(novaSaida.getProdutos());

      if (precoTotal != novaSaida.getValorTotal()) {
        return res.json({
          message: `Erro ao registrar saída: Erro de cálculo de valor do produto`,
          type: "error",
        });
      }

      const saidaID = await this.dao.Registrar(novaSaida);

      for (const item of novaSaida.getProdutos()) {
        await saidaLoteDAO.Registrar(saidaID, item);

        const loteId = item.getLote().getId();

        if (loteId === undefined) {
          break;
        }

        await loteDAO.atualizarEstoque(loteId, item.getQuantidade());
      }

      return res.json({
        message: "Saída registrada com sucesso",
        type: "success",
      });
    } catch (err) {
      console.log(err);
      res.json({
        message: `Erro ao registrar saída: ${err}`,
        type: "error",
      });
    }
  };
  Listar = async (req: Request, res: Response) => {
    const saidas = await this.dao.Listar();

    res.json({ saidas });
  };

  Consultar = async (req: Request, res: Response) => {
    const cupomFiscal = String(req.params.cupom);

    const result = await this.dao.Consultar(cupomFiscal);

    if (!result) {
      return res.status(400).json({
        message: "Erro ao buscar saídas",
        type: "error",
      });
    }

    res.json(result);
  };

  listarPorCupom = async (req: Request, res: Response) => {
    try {
      const cupom = Number(req.params.cupom);
      const saidas = await this.dao.listarPorCupom(cupom);

      if (!saidas) {
        return res
          .status(400)
          .json({ message: "Erro ao buscar saidas", type: "error" });
      }

      return res.status(200).json({ saidas });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Erro ao buscar saidas", type: "error" });
    }
  };
}
