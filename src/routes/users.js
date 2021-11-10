const router = require('express').Router();
const userController = require('../controllers/users');
const { validRequireData } = require('../middlewares/validateUsers');
const { verifyToken } = require('../middlewares/authorizations');
const verifyAdmin = require('../middlewares/validateAdmin');

router.post('/', validRequireData, userController.create);
router.post('/admin', verifyToken, verifyAdmin, userController.createAdmin);

module.exports = router;
