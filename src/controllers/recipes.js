const rescue = require('express-rescue');
const recipesService = require('../services/recipes');
const { status, recipesMessages } = require('../messages');

const create = async (req, res) => {
  try {
    const { name, ingredients, preparation } = req.body;
    const { _id } = req.user;    
    const newRecepie = await recipesService.create(name, ingredients, preparation, _id);
    return res.status(status.create).json({ recipe: newRecepie });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAll = rescue(async (req, res) => {
  const allRecipes = await recipesService.getAll();
  return res.status(status.sucess).json(allRecipes);
});

const getRecipeById = rescue(async (req, res) => {
  const { id } = req.params;
  const { error, findedRecepie } = await recipesService.getRecipeById(id);
  if (error) {
    return res.status(status.notFound).json({ message: recipesMessages.notFound });
  }
  return res.status(status.sucess).json(findedRecepie);
});

module.exports = { create, getAll, getRecipeById };