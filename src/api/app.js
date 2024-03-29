const express = require('express');
const path = require('path'); 
const usersRoutes = require('../routes/users');
const loginRoutes = require('../routes/login');
const recipesRoutes = require('../routes/recipes');
const { errorMiddleware } = require('../middlewares/errorMiddleware');

const app = express();
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/login', loginRoutes);
app.use('/recipes', recipesRoutes);
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

app.use(errorMiddleware);
// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
