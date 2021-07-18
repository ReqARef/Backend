const router = require('express').Router();
const {
    sendRequests,
    getRequests,
    handleRequests
} = require('../controllers/Requests');
const { auth } = require('../middleware/auth');

router.post('/request', auth, sendRequests);
router.get('/request/:page', auth, getRequests);
router.post('/handlerequest', auth, handleRequests);

module.exports = router;
