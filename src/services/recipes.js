const recipeModel = require('../models/recipes');
const { recipesMessages } = require('../messages');

const create = async (name, ingredients, preparation, _id) => {
  const newRecipe = await recipeModel.create(name, ingredients, preparation, _id);
  return newRecipe;
};

const getAll = async () => {
  const allRecipes = await recipeModel.getAll();
  return allRecipes;
};

const getRecipeById = async (id) => {
 const findedRecipe = await recipeModel.getRecipeById(id);
 if (!findedRecipe) {
   return { error: { status: 404, message: recipesMessages.notFound } };
 }
 return { findedRecipe };
};

module.exports = { create, getAll, getRecipeById };