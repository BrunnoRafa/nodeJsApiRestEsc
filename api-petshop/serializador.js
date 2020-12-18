const jsonToXml = require('jsontoxml');

const ValorNaoSuportado = require('./erros/valor-nao-suportado');

class Serializador {

  json(dados) {
    return JSON.stringify(dados);
  }

  xml(dados) {
    let tag = this.tagSingular;

    if (Array.isArray(dados)) {
      tag = this.tagPlural;

      dados = dados.map(item => {
        return {
          [this.tagSingular]: item
        }
      })
    }
    return jsonToXml({ [tag]: dados })
  }

  serializar(dados) {
    dados = this.filtrar(dados);
    if (this.contentType === 'application/json') {
      return this.json(dados);
    }

    if (this.contentType === 'application/xml') {
      return this.xml(dados);
    }

    throw new ValorNaoSuportado(this.contentType);
  }

  filtrarObjeto(dados) {
    const novoObjeto = {};

    this.camposPublicos.forEach((campo) => {
      if (dados.hasOwnProperty(campo)) {
        novoObjeto[campo] = dados[campo];
      }
    });

    return novoObjeto;
  }

  filtrar(dados) {
    if (Array.isArray(dados)) {
      dados = dados.map(item => { return this.filtrarObjeto(item) });
    } else {
      dados = this.filtrarObjeto(dados)
    }

    return dados;
  }
}

class SerializadorFornecedor extends Serializador {
  constructor(contentType, camposExtras) {
    super();
    this.contentType = contentType;
    this.tagSingular = 'fornecedor';
    this.tagPlural = 'fornecedores';
    this.camposPublicos = ['id', 'empresa', 'categoria'].concat(camposExtras || []);
  }
}

class SerializadorError extends Serializador {
  constructor(contentType, camposExtras) {
    super();
    this.contentType = contentType;
    this.tagSingular = 'erro';
    this.tagPlural = 'erros';
    this.camposPublicos = ['id', 'mensagem'].concat(camposExtras || []);
  }
}

module.exports = {
  Serializador: Serializador,
  SerializadorFornecedor: SerializadorFornecedor,
  SerializadorError: SerializadorError,
  formatosAceitos: ['application/json', 'application/xml']
}