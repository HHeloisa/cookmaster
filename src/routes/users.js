const router = require('express').Router();
const userController = require('../controllers/users');

router.post('/', userController.createUser);

module.exports = router;
