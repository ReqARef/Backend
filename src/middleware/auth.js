const jwt = require('jsonwebtoken');
const Pool = require('../db/database').getPool();

const auth = async (req, res, next) => {
	try{
		const accessToken = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(accessToken, process.env.access_jwt_secret);
		const getUserString = `SELECT * FROM USERS WHERE email='${decoded.email}'`;
		const getUserResult = await Pool.query(getUserString);
		if(!getUserResult.rows)
			throw new Error();
		req.user = getUserResult.rows[0];
		next();
	} catch(e) {
		res.status(401).send({err: 'Please authenticate.'});
	}
};

module.exports = {auth};