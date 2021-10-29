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

const editRecipe = async (id, name, ingredients, preparation) => {
  console.log('entrei no sercie');
  const allInfoRecipe = await recipeModel.editRecipe(id, name, ingredients, preparation);
  if (!allInfoRecipe) {
    return { error: { status: 404, message: recipesMessages.notFound } };
  }
  console.log('allInfoRecipeServiceRetorno', allInfoRecipe);
  return { allInfoRecipe };
};

const deleteRecipe = async (id) => {
  const deletedOne = await recipeModel.deleteRecipe(id);
  if (!deletedOne) {
    return { error: { status: 404, message: recipesMessages.notFound } };
  }
  return { deletedOne };
};

const addImage = async (id, path) => {
  const recipeWithImg = await recipeModel.addImage(id, path);
  if (!recipeWithImg) {
    return { error: { status: 404, message: recipesMessages.notFound } };
  }
  return { recipeWithImg };
};

module.exports = { create, getAll, getRecipeById, editRecipe, deleteRecipe, addImage };
