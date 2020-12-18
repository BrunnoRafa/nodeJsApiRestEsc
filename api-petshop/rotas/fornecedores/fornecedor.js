const TabelaFornecedor = require('./tabela-fornecedores')
const CampoInvalido = require('../../erros/campo-invalido');
const DadosNaoFornecidos = require('../../erros/dados-nao-fornecidos');

const campos = ['empresa', 'email', 'categoria'];

class Fornecedor {

  constructor({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
    this.id = id;
    this.empresa = empresa;
    this.email = email;
    this.categoria = categoria;
    this.dataCriacao = dataCriacao;
    this.dataAtualizacao = dataAtualizacao;
    this.versao = versao;
  }

  async criar() {
    this.validar();
    const resultado = await TabelaFornecedor.inserir({
      empresa: this.empresa,
      email: this.email,
      categoria: this.categoria
    });

    this.id = resultado.id;
    this.dataCriacao = resultado.dataCriacao;
    this.dataAtualizacao = resultado.dataAtualizacao;
    this.versao = resultado.versao;
  }

  async carregar() {
    const fornecedor = await TabelaFornecedor.pegarPorId(this.id);
    this.empresa = fornecedor.empresa;
    this.email = fornecedor.email;
    this.categoria = fornecedor.categoria;
    this.dataCriacao = fornecedor.dataCriacao;
    this.dataAtualizacao = fornecedor.dataAtualizacao;
    this.versao = fornecedor.versao
  }

  async atualizar() {
    await TabelaFornecedor.pegarPorId(this.id);
    const dadosParaAtualizar = {};

    campos.forEach((campo) => {
      const valor = this[campo];

      if (typeof valor === 'string' && valor.length > 0) {
        dadosParaAtualizar[campo] = valor;
      }
    });

    if (Object.keys(dadosParaAtualizar).length === 0) {
      throw new DadosNaoFornecidos();
    }

    await TabelaFornecedor.atualizar(this.id, dadosParaAtualizar);
  }

  remover() {
    return TabelaFornecedor.remover(this.id);
  }

  validar() {
    campos.forEach(campo => {
      const valor = this[campo];

      if (typeof valor !== 'string' || valor.length === 0) {
        throw new CampoInvalido(campo);
      }
    });

  }
}

module.exports = Fornecedor