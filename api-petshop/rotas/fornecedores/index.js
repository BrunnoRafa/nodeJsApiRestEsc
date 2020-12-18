const roteador = require('express').Router();

const TabelaFornecedor = require('./tabela-fornecedores');
const Fornecedor = require('./fornecedor');
const SerializadorFornecedor = require('../../serializador').SerializadorFornecedor;

roteador.get('/', async (req, res) => {
  const resultados = await TabelaFornecedor.listar();
  const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
  res.send(serializador.serializar(resultados));
});

roteador.post('/', async (req, res, proximo) => {
  try {
    const dadosRecebidos = req.body;
    const fornecedor = new Fornecedor(dadosRecebidos);
    await fornecedor.criar();
    res.status(201);
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
    res.send(serializador.serializar(fornecedor));
  } catch (error) {
    proximo(error)
  }
});

roteador.get('/:idFornecedor', async (req, res, proximo) => {
  try {
    const id = req.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });
    await fornecedor.carregar();
    const serializador = new SerializadorFornecedor(
      res.getHeader('Content-Type'),
      ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
    )
    res.send(serializador.serializar(fornecedor));
  } catch (error) {
    proximo(error);
  }
});

roteador.put('/:idFornecedor', async (req, res, proximo) => {
  try {
    const id = req.params.idFornecedor;
    const dadosRecebidos = req.body;
    const dados = Object.assign({}, dadosRecebidos, { id: id });
    const fornecedor = new Fornecedor(dados);
    await fornecedor.atualizar();
    res.status(204);
    res.end();
  } catch (error) {
    proximo(error);
  }
});

roteador.delete('/:idFornecedor', async (req, res, proximo) => {
  try {
    const id = req.params.idFornecedor;
    const fornecedor = new Fornecedor({ id: id });
    await fornecedor.carregar();
    await fornecedor.remover();
    res.status(204);
    res.end();
  } catch (error) {
    proximo(error);
  }
})

module.exports = roteador