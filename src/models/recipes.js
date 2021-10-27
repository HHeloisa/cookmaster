const connection = require('./connection');

const create = async (name, ingredients, preparation, _id) => {
  const db = await connection();
  const recipe = await db.collection('recipes')
  .insertOne({ name, ingredients, preparation, userId: _id });
  return { name, ingredients, preparation, userId: _id, _id: recipe.insertedId };
};

module.exports = { create };
