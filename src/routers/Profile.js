const router = require('express').Router();
const {getProfile, updateProfile} = require('../controllers/Profile');
const {auth} = require('../middleware/auth');


router.get('/user/profile', auth, getProfile);
router.put('/user/profile', auth, updateProfile);

module.exports = router;