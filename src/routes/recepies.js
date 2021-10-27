const router = require('express').Router();
const recepiesController = require('../controllers/recepies');

router.post('/', recepiesController.create);

module.exports = router;
