const rescue = require('express-rescue');
const recipesService = require('../services/recipes');
const { status } = require('../messages');

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
  const { error, findedRecipe } = await recipesService.getRecipeById(id);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(status.sucess).json(findedRecipe);
});

const editRecipe = rescue(async (req, res) => {
  const { id } = req.params;
  const { userDB } = req.user;
  const { name, ingredients, preparation } = req.body;
  const params = { id, name, ingredients, preparation, userDB };
  const theRecipe = await recipesService.editRecipe(params);

  return res.status(status.sucess).json(theRecipe);
});

const deleteRecipe = rescue(async (req, res) => {
      const { id } = req.params;
      await recipesService.deleteRecipe(id);
      return res.status(204).json({});
  });

module.exports = { create, getAll, getRecipeById, editRecipe, deleteRecipe };
