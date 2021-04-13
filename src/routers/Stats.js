const router = require('express').Router();
const statsController = require('../controllers/Stats');
const {auth} = require('../middleware/auth');

router.get('/stats',auth,statsController);

module.exports = router;