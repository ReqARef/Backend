const router = require('express').Router();
const { user } = require('../controllers/User');

router.get('/user', user);

module.exports = router;