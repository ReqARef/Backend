const router = require('express').Router();
const {login, signUp, sendForgotPasswordOTP, 
	verifyOTP, updatePassword} = require('../controllers/Auth');

router.post('/login', login);
router.post('/signup' , signUp);
router.post('/resetPassword', sendForgotPasswordOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/updatePassword', updatePassword);

module.exports = router;