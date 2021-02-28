const router = require('express').Router();
const requestController = require('../controllers/request');

router.post('/request', requestController);

module.exports = router;