import fs from "fs";
import path from "path";

import Produto from "../class/Produto.js";
import { ProdutoDAO } from "../dal/ProdutoDAO.js";
import LoteDAO from "../dal/LoteDAO.js";
import showLog from "../utils/showLog.js";
import { calcularEstoqueMinimo } from "../utils/calcularEstoqueMinimo.js";

export default class ProdutoController {
  #dao = new ProdutoDAO();

  Criar = async (req, res) => {
    try {
      const file = req.file;

      const imgCapa = file ? `/uploads/${file.filename}` : null;
      const imagem_capa = String(imgCapa);

      const data = {
        id: req.body.id,
        titulo: req.body.titulo,
        autor: req.body.autor,
        serie: req.body.serie,
        volume: req.body.volume,
        isbn: req.body.isbn,
        numero_paginas: req.body.numPaginas,
        idioma: req.body.idioma,
        data_publicacao: new Date(req.body.dataPublicacao),
        genero: req.body.genero,
        classificacao_indicativa: req.body.classIndicativa,
        preco: Number(req.body.preco),
        estoque: 0,
        capa_url: imagem_capa,
      };

      const newProduct = new Produto(data);

      if (!(await this.#dao.Criar(newProduct))) {
        return res.status(400).json({
          message: "Erro na criação do produto.",
          type: "error",
        });
      }

      return res.status(201).json({
        message: "Produto criado!",
        type: "success",
      });
    } catch (err) {
      return res.status(400).json({
        message: `Erro na criação do produto: ${err}`,
        type: "error",
      });
    }
  };

  Consultar = async (req, res) => {
    const { id } = req.params;

    const produtoBD = await this.#dao.Consultar(Number(id));

    const produto = new Produto(produtoBD);
    let quantidadeAtual = 0;

    if (!produto) {
      return res.status(400).json({
        message: "Erro ao encontrar produto.",
        type: "error",
      });
    }

    const loteDAO = new LoteDAO();

    const lotes = await loteDAO.consultarPorProduto(produto);

    const estoque = await this.#dao.buscarEstoqueAtual(produto.getId());
    estoque.forEach((item) => {
      quantidadeAtual += item.quantidade_atual;
    });

    this.calcularEstoqueMinimo(req, res);

    return res.status(201).json({
      produto,
      lotes,
      quantidadeAtual,
    });
  };

  Alterar = async (req, res) => {
    try {
      const id = Number(req.params.id);

      const produtoExistente = new Produto(await this.#dao.Consultar(id));

      if (!produtoExistente) {
        return res.status(404).json({
          message: "Produto não encontrado",
          type: "error",
        });
      }

      const data = {
        id: id,
        titulo: req.body.titulo,
        autor: req.body.autor,
        serie: req.body.serie,
        volume: req.body.volume,
        isbn: req.body.isbn,
        numero_paginas: Number(req.body.numPaginas),
        idioma: req.body.idioma,
        data_publicacao: new Date(req.body.dataPublicacao),
        genero: req.body.genero,
        classificacao_indicativa: req.body.classIndicativa,
        preco: Number(req.body.preco),
        estoque: 0,
        capa_url: produtoExistente.getImgCapa(),
      };

      const updatedData = new Produto(data);

      if (!(await this.#dao.Alterar(updatedData))) {
        return res.status(400).json({
          message: "Erro ao atualizar produto",
          type: "error",
        });
      }

      return res.status(200).json({
        message: "Produto atualizado com sucesso",
        type: "success",
      });
    } catch (err) {
      showLog(err);

      return res.status(500).json({
        message: `Erro no update: ${err}`,
        type: "error",
      });
    }
  };

  Excluir = async (req, res) => {
    const { id } = req.params;

    try {
      const produtoBD = await this.#dao.Consultar(Number(id));

      if (!produtoBD) {
        return res.status(404).json({
          message: "Produto não encontrado.",
          type: "error",
        });
      }

      const produto = new Produto(produtoBD);

      if (!produto) {
        return res.status(400).json({
          message: "Produto não encontrado.",
          type: "error",
        });
      }

      const imagem = produto.getImgCapa();

      console.log(imagem);
      console.log(produto);

      if (imagem) {
        const imagem_nome = imagem.replace("/uploads/", "");

        const filePath = path.join(process.cwd(), "uploads", imagem_nome);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.warn("Erro ao deletar imagem:", err.message);
            return;
          }

          console.log("Imagem deletada com sucesso");
        });
      }

      await this.#dao.Excluir(produto);

      return res.status(200).json({
        message: "Produto excluído!",
        type: "success",
      });
    } catch (err) {
      console.error(err);

      return res.status(400).json({
        message: "Produto não encontrado.",
        type: "error",
      });
    }
  };

  listarProdutos = async (req, res) => {
    try {
      const data = await this.#dao.Listar();

      if (!data) {
        return res.status(400).json({
          message: "Erro ao buscar produtos",
          type: "error",
        });
      }

      const produtos = [];

      for (let item of data) {
        let quantidadeAtual = 0;
        let produto = new Produto(item);
        const estoque = await this.#dao.buscarEstoqueAtual(produto.getId());

        for (let item of estoque) {
          quantidadeAtual += item.quantidade_atual;
        }

        produto.setEstoque(quantidadeAtual);
        produtos.push(produto);
      }

      return res.status(200).json({ produtos });
    } catch (error) {
      showLog(`Erro ao listar produtos: ${error}`);
      return res.status(400).json({ message: "Erro ao listar produtos" });
    }
  };

  listarPorNome = async (req, res) => {
    const produtoTitulo = String(req.params.produto);

    try {
      const data = await this.#dao.listarPorNome(produtoTitulo);

      if (!data) {
        return res.status(400).json({
          message: "Erro ao buscar produtos",
          type: "error",
        });
      }

      const produtos = [];

      data.forEach((item) => {
        produtos.push(new Produto(item));
      });

      return res.status(200).json({
        produtos,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Erro ao buscar produtos",
        type: "error",
      });
    }
  };

  pesquisarProduto = async (req, res) => {
    const { pesquisa } = req.query;

    const produtos = [];

    showLog(`Buscando produtos pela pesquisa: ${pesquisa || "''"}`);

    try {
      if (!pesquisa || pesquisa === undefined || pesquisa == "undefined") {
        return this.listarProdutos(req, res);
      }

      if (typeof pesquisa !== "string") {
        return res.status(400).json({
          mensagem: "Pesquisa inválida",
        });
      }

      const results = await this.#dao.pesquisarProduto(pesquisa);

      if (!results) {
        return res.status(400).json({
          message: "Erro ao buscar produtos",
          type: "error",
        });
      }

      results.forEach((item) => {
        produtos.push(new Produto(item));
      });

      return res.status(200).json({
        produtos,
      });
    } catch (error) {
      showLog(`Erro ao pesquisar produtos: ${error}`);
      return res.status(400).json({ message: "Erro ao listar produtos" });
    }
  };

  calcularEstoqueMinimo = async (req, res) => {
    try {
      const produtoId = Number(req.params.id);
      // Quantos dias leva para entregar o pedido depois da solicitação
      const leadTimeDias = await this.#dao.calcularLeadTime();
      // Quantos dias de histórico de saídas
      const janelaDias = Number(90);
      // Quão seguro o cálculo deve ser
      const nivelServicoZ = Number(1.65);

      if (!produtoId || leadTimeDias <= 0 || janelaDias < 30) {
        return res
          .status(400)
          .json({ erro: "Parâmetros inválidos (janela mínima: 30 dias)" });
      }

      const consumoDiario = await this.#dao.consumoDiario(
        produtoId,
        janelaDias,
      );
      const resultado = calcularEstoqueMinimo({
        consumoDiario,
        leadTimeDias,
        nivelServicoZ,
      });
      const estoqueAtual = await this.#dao.buscarEstoqueAtual(produtoId);

      console.log(resultado.estoqueMinimo);

      await this.#dao.atualizarEstoqueMinimo(resultado.estoqueMinimo);

      if (estoqueAtual <= resultado.estoqueMinimo) {
      }

      // res.json({
      //   ...resultado,
      //   estoqueAtual,
      //   precisaRepor:
      //     estoqueAtual !== null && estoqueAtual <= resultado.estoqueMinimo,
      // });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  };
}
