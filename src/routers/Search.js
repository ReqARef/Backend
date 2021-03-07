const router = require('express').Router();
const { usersSearch } = require('../controllers/Search');

router.get('/search/users/:company_name', usersSearch);

module.exports = router;