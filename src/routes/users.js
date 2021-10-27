const router = require('express').Router();
const userController = require('../controllers/users');
const { validRequireData } = require('../middlewares/validateUsers');

router.post('/', validRequireData, userController.createUser);

module.exports = router;
