const router = require('express').Router();
const {
    login,
    signUp,
    sendForgotPasswordOTP,
    updatePassword,
    verifyOTP
} = require('../controllers/Auth');

router.post('/login', login);
router.post('/signup', signUp);
router.post('/resetPassword', sendForgotPasswordOTP);
router.post('/updatePassword', updatePassword);
router.post('/verifyOTP', verifyOTP);

module.exports = router;
