const { status, usersMessages } = require('../messages');
const recipeModel = require('../models/recipes');

const validateBodyRecepies = (req, res, next) => {
  const { name, ingredients, preparation } = req.body;
  
  if (!name || !ingredients || !preparation) {
    return res.status(status.badRequest).json({ message: usersMessages.userInvalid });
  }
  next();
};

const validateAdmin = (role) => {
  if (role !== 'admin') return false;
  return true;
};

const validateOwner = async (id, _id) => {
  const recipeDB = await recipeModel.getRecipeById(id);
  if (!recipeDB) return false;
  const { userId } = recipeDB;
  if (_id !== userId) return false;
return true;
};

async function validateEditRecipe(req, res, next) {
  try {
    console.log('entrei na validateEditRecipe ');
    const { _id, role } = req.user;
    const { id } = req.body;
    const admin = validateAdmin(role);
    const owner = await validateOwner(id, _id);
    if (admin || owner) { 
      next(); 
    } 
  } catch (error) {
    return res.status(status.unauth).json({ message: usersMessages.userInvalid });
  }
}

module.exports = { validateBodyRecepies, validateEditRecipe };
