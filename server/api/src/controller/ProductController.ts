import fs from "fs";
import path from "path";

import type { Request, Response } from "express";
import Produto from "../class/Produto.js";
import { ProdutoDAO } from "../dal/ProdutoDAO.js";
import type { IProduto } from "../interfaces/IProduto.js";
export default class ProdutoController {
  private dao = new ProdutoDAO();

  Criar = async (req: Request, res: Response) => {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
    try {
      const file = req.file;

      const imgCapa = file ? `/uploads/${file.filename}` : null;

      const imagem_capa = String(imgCapa);

      const data: IProduto = {
        id: req.body.id,
        titulo: req.body.titulo,
        autor: req.body.autor,
        serie: req.body.serie,
        volume: req.body.volume,
        isbn13: req.body.isbn,
        numero_paginas: req.body.numPaginas,
        idioma: req.body.idioma,
        data_publicacao: new Date(req.body.dataPublicacao),
        genero: req.body.genero,
        classificacao_indicativa: req.body.classIndicativa,
        preco: Number(req.body.preco),
        estoque: 0,
        imagem_capa: imagem_capa,
      };

      const newProduct = new Produto(data);

      if (!(await this.dao.Criar(newProduct))) {
        return res
          .status(400)
          .json({ message: "Erro na criação do produto.", type: "error" });
      }

      return res
        .status(201)
        .json({ message: "Produto criado!", type: "success" });
    } catch (err) {
      return res
        .status(400)
        .json({ message: `Erro na criação do produto: ${err}`, type: "error" });
    }
  };

  Consultar = async (req: Request, res: Response) => {
    const { id } = req.params;

    const produtoBD = await this.dao.Consultar(Number(id));

    const produto = new Produto(produtoBD);

    if (!produto) {
      return res
        .status(400)
        .json({ message: "Erro ao encontrar produto.", type: "error" });
    }

    return res.status(201).json({ produto });
  };

  Alterar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      console.log(req.body);

      const produtoExistente = new Produto(await this.dao.Consultar(id));

      if (!produtoExistente) {
        return res.status(404).json({
          message: "Produto não encontrado",
          type: "error",
        });
      }

      const data: IProduto = {
        id: id,
        titulo: req.body.titulo,
        autor: req.body.autor,
        serie: req.body.serie,
        volume: req.body.volume,
        isbn13: req.body.isbn,
        numero_paginas: Number(req.body.numPaginas),
        idioma: req.body.idioma,
        data_publicacao: new Date(req.body.dataPublicacao),
        genero: req.body.genero,
        classificacao_indicativa: req.body.classIndicativa,
        preco: Number(req.body.preco),
        estoque: 0,
        imagem_capa: produtoExistente.getImgCapa(),
      };

      const updatedData = new Produto(data);

      if (!(await this.dao.Alterar(updatedData))) {
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
      console.log(err);
      return res.status(500).json({
        message: `Erro no update: ${err}`,
        type: "error",
      });
    }
  };

  Excluir = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const produtoBD = await this.dao.Consultar(Number(id));

      if (!produtoBD) {
        return res.status(404).json({
          message: "Produto não encontrado.",
          type: "error",
        });
      }

      const produto = new Produto(produtoBD);

      if (!produto) {
        return res
          .status(400)
          .json({ message: "Produto não encontrado.", type: "error" });
      }

      let imagem = produto.getImgCapa();
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

      await this.dao.Excluir(produto.getId());

      return res
        .status(200)
        .json({ message: "Produto excluído!", type: "success" });
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: "Produto não encontrado.", type: "error" });
    }
  };

  listarProdutos = async (req: Request, res: Response) => {
    const data = await this.dao.Listar();

    if (!data) {
      return res
        .status(400)
        .json({ message: "Erro ao buscar produtos", type: "error" });
    }

    const produtos: Produto[] = [];

    data.forEach((item) => {
      produtos.push(new Produto(item));
    });

    return res.status(200).json({ produtos });
  };

  listarPorNome = async (req: Request, res: Response) => {
    const produtoTitulo = String(req.params.produto);

    try {
      const data = await this.dao.listarPorNome(produtoTitulo);

      if (!data) {
        return res
          .status(400)
          .json({ message: "Erro ao buscar produtos", type: "error" });
      }
      const produtos: Produto[] = [];

      data.forEach((item) => {
        produtos.push(new Produto(item));
      });
      return res.status(200).json({ produtos });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Erro ao buscar produtos", type: "error" });
    }
  };
}
