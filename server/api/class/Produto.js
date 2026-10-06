export default class Produto {
  constructor(produto) {
    this.id = produto.id;
    this.titulo = produto.titulo;
    this.autor = produto.autor;
    this.serie = produto.serie;
    this.volume = produto.volume;
    this.isbn13 = produto.isbn;
    this.numPaginas = produto.numero_paginas;
    this.idioma = produto.idioma;
    this.dataPublicacao = produto.data_publicacao;
    this.genero = produto.genero;
    this.classIndicativa = produto.classificacao_indicativa;
    this.preco = produto.preco;
    this.estoque = produto.estoque;
    this.imgCapa = produto.capa_url;
  }

  getId() {
    return this.id;
  }

  setId(value) {
    this.id = value;
  }

  getTitulo() {
    return this.titulo;
  }

  setTitulo(value) {
    this.titulo = value;
  }

  getAutor() {
    return this.autor;
  }

  setAutor(value) {
    this.autor = value;
  }

  getSerie() {
    return this.serie;
  }

  setSerie(value) {
    this.serie = value;
  }

  getVolume() {
    return this.volume;
  }

  setVolume(value) {
    this.volume = value;
  }

  getIsbn13() {
    return this.isbn13;
  }

  setIsbn13(value) {
    this.isbn13 = value;
  }

  getNumPaginas() {
    return this.numPaginas;
  }

  setNumPaginas(value) {
    this.numPaginas = value;
  }

  getIdioma() {
    return this.idioma;
  }

  setIdioma(value) {
    this.idioma = value;
  }

  getDataPublicacao() {
    return this.dataPublicacao;
  }

  setDataPublicacao(value) {
    this.dataPublicacao = value;
  }

  getGenero() {
    return this.genero;
  }

  setGenero(value) {
    this.genero = value;
  }

  getClassIndicativa() {
    return this.classIndicativa;
  }

  setClassIndicativa(value) {
    this.classIndicativa = value;
  }

  getPreco() {
    return this.preco;
  }

  setPreco(value) {
    this.preco = value;
  }

  getEstoque() {
    return this.estoque;
  }

  setEstoque(value) {
    this.estoque = value;
  }

  getImgCapa() {
    return this.imgCapa;
  }

  setImgCapa(value) {
    this.imgCapa = value;
  }
}
