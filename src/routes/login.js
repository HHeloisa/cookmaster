const router = require('express').Router();
const loginController = require('../controllers/login');
const { validRequireData } = require('../middlewares/validateLogin');

router.post('/', validRequireData, loginController.userLogin);

module.exports = router;
