const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { verifyEmailOTP, sendEmailOTP } = require('../controllers/OTP');

router.post('/email/otp', auth, sendEmailOTP);
router.post('/verify/email', auth, verifyEmailOTP);

module.exports = router;
