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

const validateOwner = async (idReceita, _id) => {
  const recipeDB = await recipeModel.getRecipeById(idReceita);
  console.log('recipeDB', recipeDB);
  if (!recipeDB) return false;
  console.log('_id', _id);
  console.log('recipeDB.userId', recipeDB.userId);

  if (_id !== recipeDB.userId) return false;
return true;
};

async function validateAdminOrOwnerRecipe(req, res, next) {
  console.log(req.user);
  const { _id, role } = req.user;
  const { id: idReceita } = req.params;
  console.log('role', role);
  const admin = validateAdmin(role);
  const owner = await validateOwner(idReceita, _id);
  console.log('admin', admin);
  console.log('owner', owner);
  if (admin === false && owner === false) { 
    return res.status(status.unauth).json({ message: 'erro de owner admin' });
  }
  next(); 
}

module.exports = { validateBodyRecepies, validateAdminOrOwnerRecipe };
