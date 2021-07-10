const router = require('express').Router();
const {
    getProfile,
    updateProfile,
    setAvatar
} = require('../controllers/Profile');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/user/profile', auth, getProfile);
router.put('/user/profile', auth, updateProfile);
router.post('/user/avatar', auth, upload.single('avatar'), setAvatar);

module.exports = router;
