const router = require('express').Router();
const {emailOTP} = require('../controllers/OTP');

router.post('/emailOTP', emailOTP);


module.exports=router;