const router = require('express').Router();
const {auth} = require('../middleware/auth');
const { searchUsersByCompany, searchUserByEmail } = require('../controllers/Search');

router.get('/search/users/company/:company_name', auth, searchUsersByCompany);
router.get('/search/user/email/:email', auth, searchUserByEmail);

module.exports = router;