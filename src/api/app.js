const bodyParser = require('body-parser');
const express = require('express');
const usersRoutes = require('../routes/users');
const loginRoutes = require('../routes/login');
const recipesRoutes = require('../routes/recipes');

const app = express();
app.use(bodyParser.json());

app.use('/users', usersRoutes);
app.use('/login', loginRoutes);
app.use('/recipes', recipesRoutes);

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
