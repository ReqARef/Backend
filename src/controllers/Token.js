const Pool = require('../db/database');
const jwt = require('jsonwebtoken');
const {generateAccessToken} = require('../utils/LoginHelper');

const refreshTokenAuth = async(req,res) => {
	const result = {status: false};
	try{
		const {refreshtoken} = req.body;
		if(!refreshtoken) {
			result.error = 'Token not found';
			return res.status(401).send(result);
		}
		const matchRefreshTokenString = `SELECT email FROM USERS WHERE refresh_token=${refreshtoken}`;
		const matchRefreshTokenResult = await Pool.query(matchRefreshTokenString);
		if(!matchRefreshTokenResult.rows) {
			result.error = 'Invalid refresh token';
			return res.status(401).send(result);
		}
		try {
			jwt.verify(refreshtoken, process.env.refresh_jwt_secret);
			result['data'] = generateAccessToken(matchRefreshTokenResult.rows[0].email);
			result['status'] = true;
		} catch(err) {
			result['error'] = 'Refresh token expired';
			return res.send(result);
		}
	}
	catch(err){
		result.error = err.message;
		return res.status(401).send(result);
	}
};

module.exports = {
	refreshTokenAuth
};