const router = require('express').Router();
const recepiesController = require('../controllers/recipes');
const { verifyToken } = require('../middlewares/authorizations');
const { validateBodyRecepies } = require('../middlewares/validateRecepies'); 
/* validateEditRecipe ,  */ 

router.post('/', 
  verifyToken, 
  validateBodyRecepies,
  recepiesController.create);

router.get('/', recepiesController.getAll);

router.get('/:id', recepiesController.getRecipeById);

router.put('/:id', 
  verifyToken,
  validateBodyRecepies,
  /* validateEditRecipe, */
  recepiesController.editRecipe);

  router.put('/:id/image/', 
  verifyToken,
  /* validateEditRecipe, */
  recepiesController.addImage);

router.delete('/:id', 
  verifyToken,
  /* validateEditRecipe, */
  recepiesController.deleteRecipe);

module.exports = router;
