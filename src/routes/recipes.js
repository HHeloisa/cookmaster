const router = require('express').Router();
const multer = require('multer');
const recepiesController = require('../controllers/recipes');
const { verifyToken } = require('../middlewares/authorizations');
const { validateBodyRecepies } = require('../middlewares/validateRecepies'); 
  /* validateAdminOrOwnerRecipe */ 

router.get('/', recepiesController.getAll);

router.get('/:id', recepiesController.getRecipeById);

router.post('/', 
  verifyToken,
  validateBodyRecepies,
  recepiesController.create);

router.put('/:id',
  verifyToken,
  validateBodyRecepies,
  /* validateAdminOrOwnerRecipe */
  recepiesController.editRecipe);

router.delete('/:id', 
  verifyToken,
  /* validateAdminOrOwnerRecipe, */
  recepiesController.deleteRecipe);

  /* ========================================================= */
  const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
    callback(null, './src/uploads/');
    },
    filename: (req, _file, callback) => {
      const { id } = req.params;
      callback(null, `${id}.jpeg`);
    },
  });

  const uploadImage = multer({ storage });

  router.put('/:id/image/', 
  verifyToken,
  uploadImage.single('image'),
  recepiesController.addImage); 

module.exports = router;
