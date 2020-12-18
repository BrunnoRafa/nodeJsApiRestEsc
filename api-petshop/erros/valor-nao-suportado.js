class ValorNaoSuportado extends Error {
  constructor(contentType) {
    super(`O tipo de contéudo ${contentType} não é suportado.`);
    this.name = 'ValorNaoSuportado';
    this.idErro = 3
  }
}

module.exports = ValorNaoSuportado;