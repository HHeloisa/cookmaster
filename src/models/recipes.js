const { ObjectId } = require('mongodb');
const connection = require('./connection');

const create = async (name, ingredients, preparation, _id) => {
  const db = await connection();
  const recipe = await db.collection('recipes')
  .insertOne({ name, ingredients, preparation, userId: _id });
  return { name, ingredients, preparation, userId: _id, _id: recipe.insertedId };
};

const getAll = async () => {
  const db = await connection();
  const allRecipes = await db.collection('recipes').find().toArray();
  return allRecipes;
};

const getRecipeById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const db = await connection();
  const findedRecipe = await db.collection('recipes').findOne({ _id: ObjectId(id) });
  return findedRecipe;
};

const editRecipe = async (id, name, ingredients, preparation) => {
  if (!ObjectId.isValid(id)) return null;
  
  const db = await connection();
  await db.collection('recipes')
    .updateOne({ _id: ObjectId(id) }, { $set: { name, ingredients, preparation } });
  
  const allInfoRecipe = await getRecipeById(ObjectId(id));
   return allInfoRecipe;
};

const deleteRecipe = async (id) => {
    if (!ObjectId.isValid(id)) return null;

    const db = await connection();
    await db.collection('recipes').deleteOne({ _id: ObjectId(id) });
};

module.exports = { create, getAll, getRecipeById, editRecipe, deleteRecipe };
