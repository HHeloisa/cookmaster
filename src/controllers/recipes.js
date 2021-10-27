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

module.exports = { create, getAll };