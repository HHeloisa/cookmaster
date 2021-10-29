const rescue = require('express-rescue');
const recipesService = require('../services/recipes');
const { status } = require('../messages');

const create = rescue(async (req, res) => {
    const { name, ingredients, preparation } = req.body;
    const { _id } = req.user;    
    const newRecepie = await recipesService.create(name, ingredients, preparation, _id);
    return res.status(status.create).json({ recipe: newRecepie });
});

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
    console.log('entrei no controller');
    const { id } = req.params;
    const { name, ingredients, preparation } = req.body;

    const { error, allInfoRecipe } = await recipesService
      .editRecipe(id, name, ingredients, preparation);
    
    if (error) {
      const { message } = error;
      return res.status(error.status).json({ message });
    }
    console.log('allInfoRecipeController', allInfoRecipe);
    return res.status(status.sucess).json(allInfoRecipe);
});

const deleteRecipe = rescue(async (req, res) => {
    const { id } = req.params;
    const { error } = await recipesService.deleteRecipe(id);
    if (error) {
      const { message } = error;
      return res.status(error.status).json({ message });
    }
    return res.status(status.noContent).json({});
  });

const addImage = rescue(async (req, res) => {
  const { id } = req.params;
  const { path } = req.file;
  const { error, recipeWithImg } = await recipesService.addImage(id, path);
  if (error) {
    const { message } = error;
    return res.status(error.status).json({ message });
  }
  return res.status(200).json(recipeWithImg);
});

module.exports = { create, getAll, getRecipeById, editRecipe, deleteRecipe, addImage };
