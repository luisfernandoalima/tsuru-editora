import { pool } from "../database/connection.js";
import Produto from "../class/Produto.js";

export class ProdutoDAO {
  Criar = async (produto: Produto) => {
    try {
      await pool.query(
        "INSERT INTO produto (isbn, titulo, autor, preco, numero_paginas, idioma,data_publicacao, serie, volume, genero, classificacao_indicativa, capa_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
        [
          produto.getIsbn13(),
          produto.getTitulo(),
          produto.getAutor(),
          produto.getPreco(),
          produto.getNumPaginas(),
          produto.getIdioma(),
          produto.getDataPublicacao(),
          produto.getSerie(),
          produto.getVolume(),
          produto.getGenero(),
          produto.getClassIndicativa(),
          produto.getImgCapa(),
        ],
      );

      return true;
    } catch (err) {
      console.error(`Erro ao cadastrar produto: ${err}`);
      return false;
    }
  };

  Alterar = async (produto: Produto) => {
    try {
      await pool.query(
        `UPDATE produto SET titulo = $1, autor = $2, serie = $3, volume = $4, isbn = $5, numero_paginas = $6, idioma = $7, data_publicacao = $8, genero = $9, classificacao_indicativa = $10, preco = $11, capa_url = $12 WHERE id = $13`,
        [
          produto.getTitulo(),
          produto.getAutor(),
          produto.getSerie(),
          produto.getVolume(),
          produto.getIsbn13(),
          produto.getNumPaginas(),
          produto.getIdioma(),
          produto.getDataPublicacao(),
          produto.getGenero(),
          produto.getClassIndicativa(),
          produto.getPreco(),
          produto.getImgCapa(),
          produto.getId(),
        ],
      );

      return true;
    } catch (err) {
      console.error(`Erro ao atualizar produto: ${err}`);
      return false;
    }
  };

  Consultar = async (id: number) => {
    try {
      const result = await pool.query("SELECT * FROM produto WHERE id = $1", [
        id,
      ]);

      return result.rows[0];
    } catch (err) {
      console.error(`Erro ao consultar produto: ${err}`);
      return false;
    }
  };

  Excluir = async (id: number | null) => {
    try {
      await pool.query("DELETE FROM produto WHERE id = $1", [id]);
      return true;
    } catch (err) {
      console.error(`Erro ao excluir produto: ${err}`);
      return false;
    }
  };

  Listar = async () => {
    try {
      const produtos = await pool.query(
        "SELECT * FROM produto ORDER BY titulo",
      );
      return produtos.rows;
    } catch (err) {
      console.log(`Erro ao buscar produtos: ${err}`);
    }
  };

  listarPorNome = async (titulo: string) => {
    try {
      const produtos = await pool.query(
        "SELECT * FROM produto WHERE titulo ILIKE $1 ORDER BY titulo",
        [`%${titulo}%`],
      );
      console.log(produtos.rows);
      console.log(titulo);
      return produtos.rows;
    } catch (err) {
      console.log(`Erro ao buscar produtos: ${err}`);
    }
  };

  salvarEstoque = async (id: number | null, novaQuantidade: number) => {
    try {
      await pool.query("UPDATE produto SET estoque = $1 WHERE id = $2", [
        novaQuantidade,
        id,
      ]);
    } catch (err) {
      console.error(err);
    }
  };
}
