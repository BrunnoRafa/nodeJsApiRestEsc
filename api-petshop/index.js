const express = require('express');
const bodyParser = require('body-parser');

const config = require('config');
const roteador = require('./rotas/fornecedores');
const NaoEncontrado = require('./erros/nao-encontrado');
const CampoInvalido = require('./erros/campo-invalido');
const DadosNaoFornecidos = require('./erros/dados-nao-fornecidos');
const ValorNaoSuportado = require('./erros/valor-nao-suportado');
const SerializadorError = require('./serializador').SerializadorError;
const formatosAceitos = require('./serializador').formatosAceitos;

const app = express();
app.use(bodyParser.json());

app.use((req, res, proximo) => {
  let formatoRequisicao = req.header('Accept');

  if (formatoRequisicao === '*/*') {
    formatoRequisicao = 'application/json';
  }

  if (formatosAceitos.indexOf(formatoRequisicao) === -1) {
    res.status(406);
    res.end()
    return;
  }

  res.setHeader('Content-Type', formatoRequisicao);
  proximo();
});

app.use('/api-petshop/fornecedores', roteador);

app.use((error, req, res, proximo) => {
  let status = 500;

  if (error instanceof NaoEncontrado) {
    status = 404;
  }

  if (error instanceof CampoInvalido || error instanceof DadosNaoFornecidos) {
    status = 400;
  }

  if (error instanceof ValorNaoSuportado) {
    status = 406;
  }
  const serializador = new SerializadorError(res.getHeader('Content-Type'));

  res.status(status);
  res.send(
    serializador.serializar({
      id: error.idErro,
      mensagem: error.message
    })
  );
});

app.listen(config.get("api.porta"), () => console.log('servidor rodando, porta localhost:3000'))