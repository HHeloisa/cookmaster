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
  const findedRecipe = await recipesService.getRecipeById(id);
  return res.status(status.sucess).json(findedRecipe);
});

const editRecipe = rescue(async (req, res) => {
    const { id } = req.params;
    const { name, ingredients, preparation } = req.body;
    const allInfoRecipe = await recipesService
      .editRecipe(id, name, ingredients, preparation);
    return res.status(status.sucess).json(allInfoRecipe);
});

const deleteRecipe = rescue(async (req, res) => {
    const { id } = req.params;
    await recipesService.deleteRecipe(id);
    return res.status(status.noContent).json({});
  });

const addImage = rescue(async (req, res) => {
  const { id } = req.params;
  const { path } = req.file;
  const recipeWithImg = await recipesService.addImage(id, path);
  return res.status(200).json(recipeWithImg);
});

module.exports = { create, getAll, getRecipeById, editRecipe, deleteRecipe, addImage };
