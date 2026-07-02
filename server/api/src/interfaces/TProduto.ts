export interface IProduto {
  id: number | null;
  titulo: String;
  autor: String;
  serie: String;
  volume: String;
  isbn13: String;
  numero_paginas: number;
  idioma: String;
  data_publicacao: Date;
  genero: String;
  classificacao_indicativa: String;
  preco: number;
  estoque: number;
  imagem_capa: string;
}
