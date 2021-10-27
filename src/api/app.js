const bodyParser = require('body-parser');
const express = require('express');
const usersRoutes = require('../routes/users');

const app = express();
app.use(bodyParser.json());

app.use('/users', usersRoutes);

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
