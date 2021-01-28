const router = require('express').Router();
const {getOtp} = require('../controllers/getOtp');

router.post('/getotp',getOtp);


module.exports=router;