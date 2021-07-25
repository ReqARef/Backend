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
router.get('/', async (req, res) => {
    res.send('Hello World');
});

module.exports = router;
