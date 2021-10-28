const router = require('express').Router();
const userController = require('../controllers/users');
const { validRequireData } = require('../middlewares/validateUsers');
const { verifyToken } = require('../middlewares/authorizations');
const { validAdmin } = require('../middlewares/validateUsers');

router.post('/', validRequireData, userController.create);
router.post('/admin', verifyToken, validAdmin, userController.createAdmin);

module.exports = router;
