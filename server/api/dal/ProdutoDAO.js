import { pool } from "../database/connection.js";
import showLog from "../utils/showLog.js";

export class ProdutoDAO {
  Criar = async (produto) => {
    try {
      await pool.query(
        "INSERT INTO produto (isbn, titulo, autor, preco, numero_paginas, idioma, data_publicacao, serie, volume, genero, classificacao_indicativa, capa_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
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
      showLog(`Erro ao cadastrar produto: ${err}`);
      return false;
    }
  };

  Alterar = async (produto) => {
    try {
      await pool.query(
        `UPDATE produto
         SET titulo = $1,
             autor = $2,
             serie = $3,
             volume = $4,
             isbn = $5,
             numero_paginas = $6,
             idioma = $7,
             data_publicacao = $8,
             genero = $9,
             classificacao_indicativa = $10,
             preco = $11,
             capa_url = $12
         WHERE id = $13`,
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
      showLog(`Erro ao atualizar produto: ${err}`);
      return false;
    }
  };

  Consultar = async (id) => {
    try {
      const result = await pool.query("SELECT * FROM produto WHERE id = $1", [
        id,
      ]);

      return result.rows[0];
    } catch (err) {
      showLog(`Erro ao consultar produto: ${err}`);
      return false;
    }
  };

  Excluir = async (produto) => {
    try {
      await pool.query("DELETE FROM produto WHERE id = $1", [produto.getId()]);

      return true;
    } catch (err) {
      showLog(`Erro ao excluir produto: ${err}`);
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
      showLog(`Erro ao buscar produtos: ${err}`);
    }
  };

  pesquisarProduto = async (pesquisa) => {
    try {
      const produtos = await pool.query(
        "SELECT * FROM produto WHERE titulo ILIKE $1 OR isbn ILIKE $1 ORDER BY titulo",
        [`%${pesquisa}%`],
      );

      showLog(`Pesquisando por: '${pesquisa}'`);
      showLog(`Número de produtos encontrados: ${produtos.rowCount}`);

      return produtos.rows;
    } catch (err) {
      showLog(`Erro ao buscar produtos: ${err}`);
    }
  };

  consumoDiario = async (produtoId, janelaDias) => {
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(x.quantidade), 0)::int AS qtd
        FROM generate_series(
          CURRENT_DATE - $2::int,
          CURRENT_DATE - 1,
          '1 day'
        ) AS d
        LEFT JOIN (
          SELECT s.data_saida, sl.quantidade
            FROM saida_lote sl
            JOIN saida s ON s.id = sl.fk_saida_id
            JOIN lote  l ON l.id = sl.fk_lote_id
           WHERE l.fk_produto_id = $1
        ) x ON x.data_saida = d::date
        GROUP BY d
        ORDER BY d`,
      [produtoId, janelaDias],
    );
    return rows.map((r) => r.qtd);
  };

  atualizarEstoqueMinimo = async (id, quantidade) => {
    try {
      await pool.query(`UPDATE produto SET estoque_minimo=$2 WHERE id=$1`, [
        id,
        quantidade,
      ]);

      return true;
    } catch (error) {
      showLog(`Erro ao atualizar estoque minimo: ${error}`);
      throw error;
    }
  };

  calcularLeadTime = async (produtoId, padrao = 7) => {
    try {
      const { rows } = await pool.query(
        `SELECT
       (SELECT ROUND(AVG(o.data_fechamento - o.data_aprovacao))
          FROM ordem_impressao o
         WHERE o.data_aprovacao  IS NOT NULL
           AND o.data_fechamento IS NOT NULL
           AND EXISTS (SELECT 1
                         FROM lote l
                        WHERE l.fk_ordem_impressao_id = o.id
                          AND l.fk_produto_id = $1)
       )::int AS do_produto,
       (SELECT ROUND(AVG(data_fechamento - data_aprovacao))
          FROM ordem_impressao
         WHERE data_aprovacao  IS NOT NULL
           AND data_fechamento IS NOT NULL
       )::int AS geral`,
        [produtoId],
      );

      const { do_produto, geral } = rows[0];
      return Math.max(1, do_produto ?? geral ?? padrao);
    } catch (error) {
      showLog(`Erro ao calcular lead time: ${error}`);
      throw error;
    }
  };

  buscarEstoqueAtual = async (produtoId) => {
    try {
      const { rows } = await pool.query(
        `Select quantidade_atual FROM lote WHERE fk_produto_id=$1`,
        [produtoId],
      );

      return rows;
    } catch (error) {
      showLog(`Erro ao buscar estoque atual: ${error}`);
      throw error;
    }
  };
}
