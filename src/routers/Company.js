const router = require('express').Router();
const {auth} = require('../middleware/auth');
const {getCompaniesList} = require('../controllers/Company');

router.post('/companies/list', auth, getCompaniesList);

module.exports=router;