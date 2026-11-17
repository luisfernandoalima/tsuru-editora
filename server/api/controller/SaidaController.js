import Saida from "../class/Saida.js";

import SaidaLoteDAO from "../dal/SaidaLoteDAO.js";
import SaidaDAO from "../dal/SaidaDAO.js";

import validarTipoPagamento from "../utils/validarTipoPagamento.js";
import calcularPrecoTotal from "../utils/calcularPrecoTotal.js";

import Usuario from "../class/Usuario.js";
import UsuarioDAO from "../dal/UsuarioDAO.js";

import SaidaLote from "../class/SaidaLote.js";

import Produto from "../class/Produto.js";
import { ProdutoDAO } from "../dal/ProdutoDAO.js";

import EnderecoDAO from "../dal/EnderecoDAO.js";
import Endereco from "../class/Endereco.js";

import LoteDAO from "../dal/LoteDAO.js";
import Lote from "../class/Lote.js";

import DevolucaoDAO from "../dal/Devolucao_CreditoDAO.js";

import showLog from "../utils/showLog.js";
import gerarRelatorioXlsx from "../utils/GerarRelatorio.js";
import ProdutoController from "./ProdutoController.js";
export default class SaidaController {
  #dao = new SaidaDAO();

  Registrar = async (req, res) => {
    try {
      const { saida, produtos } = req.body;
      const creditoDAO = new DevolucaoDAO();

      const produtoDAO = new ProdutoDAO();
      const loteDAO = new LoteDAO();
      const saidaLoteDAO = new SaidaLoteDAO();
      const usuarioDAO = new UsuarioDAO();
      const enderecoDAO = new EnderecoDAO();

      const userInfo = req.user;

      const userResult = await usuarioDAO.Consultar(userInfo.id);
      const user = new Usuario(userResult);

      const enderecoBD = await enderecoDAO.Consultar(saida.endereco_id);

      const endereco = new Endereco(enderecoBD);

      const listaProdutos = [];
      const listaSaidaLote = [];

      for (const item of produtos) {
        const produtoBanco = await produtoDAO.Consultar(item.produto_id);

        if (!produtoBanco) {
          return res.status(404).json({
            message: "Produto não encontrado.",
          });
        }

        const produto = new Produto(produtoBanco);
        listaProdutos.push(produto);

        const lotesDisponiveis = await loteDAO.consultarPorProduto(produto);

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
            message: `Estoque insuficiente para o produto ${
              produto.getTitulo?.() ?? item.produto_id
            }.`,
          });
        }
      }

      const saidaInfo = {
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

      if (await this.#dao.Consultar(novaSaida.getCupomFiscal())) {
        return res.status(400).json({
          message: "Número do cupom já registrado",
        });
      }

      if (!validarTipoPagamento(novaSaida.getTipoPagamento())) {
        return res.status(400).json({
          message: "Erro ao registrar saída, erro de pagamento",
        });
      }

      const precoTotal = calcularPrecoTotal(novaSaida.getProdutos());

      if (precoTotal != novaSaida.getValorTotal()) {
        return res.status(400).json({
          message:
            "Erro ao registrar saída: Erro de cálculo de valor do produto",
          type: "error",
        });
      }

      // credito_usado = pontos; cada ponto vale R$ 0,10 de desconto
      const pontosUsados =
        Math.round(Number(saida.credito_usado ?? 0) * 100) / 100;

      if (!Number.isFinite(pontosUsados) || pontosUsados < 0) {
        return res.status(400).json({ message: "Crédito utilizado inválido." });
      }

      if (pontosUsados > 0) {
        const desconto = Math.round(pontosUsados * 10) / 100; // pontos / 10, em centavos exatos

        if (desconto > precoTotal) {
          return res.status(400).json({
            message: "O desconto não pode ser maior que o valor total.",
          });
        }

        const valorFinalEsperado =
          Math.round((precoTotal - desconto) * 100) / 100;
        if (Math.abs(valorFinalEsperado - Number(saida.valor_final)) > 0.001) {
          return res
            .status(400)
            .json({ message: "Erro de cálculo do valor final com créditos." });
        }

        const saldo = await creditoDAO.ConsultarSaldoPorEndereco(
          saida.endereco_id,
        );
        if (pontosUsados > saldo) {
          return res.status(400).json({
            message: `Saldo de créditos insuficiente (disponível: ${saldo.toFixed(2)} pontos).`,
          });
        }
      }

      const saidaID = await this.#dao.Registrar(novaSaida);

      if (pontosUsados > 0) {
        await creditoDAO.Utilizar({ saidaId: saidaID, valor: pontosUsados });
      }

      for (const item of novaSaida.getProdutos()) {
        await saidaLoteDAO.Registrar(saidaID, item);

        const loteId = item.getLote().getId();

        if (loteId === undefined) {
          break;
        }

        await loteDAO.atualizarEstoque(loteId, item.getQuantidade());
      }

      const produtoController = new ProdutoController();

      listaProdutos.forEach((item) => {
        showLog(item.getId());
        produtoController.calcularEstoqueMinimo(item.getId());
      });

      return res.json({
        message: "Saída registrada com sucesso",
        type: "success",
      });
    } catch (err) {
      console.log(err);

      if (res.headersSent) return;

      return res.status(err.status ?? 500).json({
        message: `Erro ao registrar saída: ${err.message ?? err}`,
        type: "error",
      });
    }
  };

  Listar = async (req, res) => {
    try {
      const cupom = req.params.pesquisa;

      const cupomPesquisa = cupom === undefined ? "" : String(cupom);

      const saidas = await this.#dao.Listar(cupomPesquisa);

      res.json({ saidas });
    } catch (error) {
      console.log(error);

      res.json({
        message: `Erro ao registrar saída: ${error}`,
      });
    }
  };

  Consultar = async (req, res) => {
    try {
      const cupomFiscal = String(req.params.cupom);

      console.log("Consultando saída, cupom:", cupomFiscal);

      const saida = await this.#dao.Consultar(cupomFiscal);

      console.log(saida);

      return res.status(200).json({ saida });
    } catch (error) {
      console.error("Erro ao consultar saída:", error);

      return res.status(500).json({
        message: "Erro ao buscar saída",
        type: "error",
      });
    }
  };

  listarPorCupom = async (req, res) => {
    try {
      const cupom = Number(req.params.cupom);

      const saidas = await this.#dao.listarPorCupom(cupom);

      if (!saidas) {
        return res.status(400).json({
          message: "Erro ao buscar saidas",
          type: "error",
        });
      }

      return res.status(200).json({
        saidas,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Erro ao buscar saidas",
        type: "error",
      });
    }
  };

  listarPorParceiro = async (req, res) => {
    try {
      const parceiroId = Number(req.params.parceiroId);

      if (!Number.isInteger(parceiroId)) {
        return res
          .status(400)
          .json({ message: "ID do parceiro inválido.", type: "error" });
      }

      const saidas = await this.#dao.listarPorParceiro(parceiroId);

      if (saidas === false) {
        return res
          .status(500)
          .json({ message: "Erro ao buscar saídas.", type: "error" });
      }

      console.log(saidas);

      return res.status(200).json({ saidas });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar saídas.", type: "error" });
    }
  };

  gerarRelatorio = async (req, res) => {
    try {
      showLog("Gerando relatório de movimentação");

      // ?fim=YYYY-MM  (mês final; padrão: mês atual). O relatório cobre 6 meses.
      const hoje = new Date();
      const padrao = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
      const fim = new Date()
        .toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
        .slice(0, 7);

      // Início = 5 meses antes do mês final
      const [ano, mes] = fim.split("-").map(Number);
      const ini = new Date(Date.UTC(ano, mes - 1 - 5, 1));
      const inicio = ini.toISOString().slice(0, 10); // YYYY-MM-01

      const meses = await this.#dao.gerarRelatorio(inicio);
      const arquivo = await gerarRelatorioXlsx(meses);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Relatorio_TSURU_${fim}.xlsx"`,
      );
      res.setHeader("Content-Length", arquivo.length);

      return res.status(200).send(arquivo);
    } catch (error) {
      showLog(`Não foi possível gerar o relatório: ${error}`);
      if (res.headersSent) return;
      return res.status(error.status ?? 500).json({
        message: "Erro ao gerar o relatório.",
        type: "error",
      });
    }
  };
}
