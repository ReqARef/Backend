const router = require('express').Router();
const {signUp} = require('../controllers/SignUp');

router.post('/signup' , signUp);

module.exports = router;