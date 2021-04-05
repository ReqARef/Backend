const router = require('express').Router();
const { postRequestController, getRequestController } = require('../controllers/request');
const {auth} = require('../middleware/auth');

router.post('/request',auth, postRequestController);
router.get('/request',auth, getRequestController);

module.exports = router;