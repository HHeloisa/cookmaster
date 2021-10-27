const router = require('express').Router();
const recepiesController = require('../controllers/recipes');
const { verifyToken } = require('../middlewares/authorizations');
const { validRecepies } = require('../middlewares/validateRecepies');

router.post('/', verifyToken, validRecepies, recepiesController.create);
router.get('/', recepiesController.getAll);
router.get('/:id', recepiesController.getRecipeById);
router.put('/:id', recepiesController.editRecipe);

module.exports = router;
