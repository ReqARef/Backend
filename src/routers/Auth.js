const router = require('express').Router();
const {login, signUp} = require('../controllers/Auth');

router.post('/login', login);
router.post('/signup' , signUp);

module.exports = router;