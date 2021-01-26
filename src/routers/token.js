const router = require('express').Router();
const {refreshTokenAuth} = require('../controllers/Token');

router.post('/refreshtoken', refreshTokenAuth);

module.exports = router;