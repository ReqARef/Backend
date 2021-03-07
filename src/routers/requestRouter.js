const router = require('express').Router();
const requestController = require('../controllers/request');
const {auth} = require('../middleware/auth');

router.post('/request',auth, requestController);

module.exports = router;