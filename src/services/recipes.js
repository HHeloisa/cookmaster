const createError = require('http-errors');
const recipeModel = require('../models/recipes');
const { status, recipesMessages } = require('../messages');

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
   throw createError(status.notFound, recipesMessages.notFound);
  }
  return findedRecipe;
};

const editRecipe = async (id, name, ingredients, preparation) => {
  const allInfoRecipe = await recipeModel.editRecipe(id, name, ingredients, preparation);
  if (!allInfoRecipe) {
    throw createError(status.notFound, recipesMessages.notFound);
  }
  return allInfoRecipe;
};

const deleteRecipe = async (id) => {
  const deletedOne = await recipeModel.deleteRecipe(id);
  if (!deletedOne) {
    throw createError(status.notFound, recipesMessages.notFound);
  }
  return deletedOne;
};

const addImage = async (id, path) => {
  const recipeWithImg = await recipeModel.addImage(id, path);
  if (!recipeWithImg) {
    throw createError(status.notFound, recipesMessages.notFound);
  }
  return recipeWithImg;
};

module.exports = { create, getAll, getRecipeById, editRecipe, deleteRecipe, addImage };
