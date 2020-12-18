const ModeloTabela = require('../rotas/fornecedores/modelo-tabela-fornecedores');

ModeloTabela
  .sync()
  .then(() => console.log('Tabela criada com sucesso.'))
  .catch(console.log)