const router = require('express').Router();
const {login} = require('../controllers/Login');

router.post('/login', login);

module.exports = router;