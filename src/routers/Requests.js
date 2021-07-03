const router = require('express').Router();
const { sendRequests, getRequests } = require('../controllers/Requests');
const { auth } = require('../middleware/auth');

router.post('/request', auth, sendRequests);
router.get('/request', auth, getRequests);

module.exports = router;
