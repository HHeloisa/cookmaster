const { status, usersMessages } = require('../messages');
const { getRecipeById } = require('../models/recipes');

const verifyAdminOrOwner = async (req, res, next) => {
  // req.user contem: _id, name, email, pass, role
  // recipe tem: _id, ingredients, preparation, userId
  const { id } = req.params;
  const { role, _id } = req.user; 
  console.log('req.user', req.user);
  const recipe = await getRecipeById(id);
  console.log('recipe', recipe);
  if (role !== 'admin' && JSON.stringify(_id) !== JSON.stringify(recipe.userId)) {
    return res.status(status.forbidden).json({ message: usersMessages.onlyAdmin });
  }
  next();
};

module.exports = verifyAdminOrOwner;

// Implementação realizada com sucesso graças ao apoio do Caio Oliveira,
// que apontou que _id é um objeto, portanto, é necessario utilziar o JSON.stringify.
