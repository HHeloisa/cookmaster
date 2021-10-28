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

const editRecipe = async (params) => {
  /* const { id, name, ingredients, preparation , userDB } = params;
  const { _id } = userDB;
  // fazer validação se é admin, ou se é a pessoa que cadastrou a receita
  const theRecipeDB = await recipeModel.getRecipeById(id);
  if (theRecipeDB.userId !== _id && _id !== 'admin') {
    return res.status
  }  */
  const editedRecipe = await recipeModel.editRecipe(params);
  if (!editedRecipe) {
    return { error: { status: 404, message: recipesMessages.notFound } };
  }
  return editedRecipe;
};

const deleteRecipe = async (id) => {
  console.log('estou no service');
  const deletedOne = await recipeModel.deleteProduct(id);
  if (!deletedOne) {
    return { error: { status: 404, message: recipesMessages.notFound } };
  }
  console.log(deletedOne);
  return deletedOne;
};

module.exports = { create, getAll, getRecipeById, editRecipe, deleteRecipe };