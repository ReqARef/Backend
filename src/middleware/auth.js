const jwt = require('jsonwebtoken');
const Pool = require('../db/database').getPool();
const {extractRefreshTokenHeaderFromReq} = require('../utils/RequestHelper');
const {generateAccessToken} = require('../utils/AuthHelper');

const auth = async (req, res, next) => {
	const filterUserObject = (user) => {
		user = {...user};
		delete user['password'];
		delete user['refresh_token'];
		return user;
	};

	const verifyAuthToken = async (accessToken) => {
		const result = {status: false};
		try {
			const decoded = jwt.verify(accessToken, process.env.access_jwt_secret);
			const getUserString = `SELECT * FROM USERS WHERE email='${decoded.email.toLowerCase()}'`;
			const getUserResult = await Pool.query(getUserString);
			if(!getUserResult.rows)
				throw new Error();
			result['user'] = filterUserObject(getUserResult.rows[0]);
			result['status'] = true;
			return result;
		} catch {
			return result;
		}
	};

	const verifyRefreshToken = async () => {
		const result = {status: false};
		try{
			const refreshtoken = extractRefreshTokenHeaderFromReq(req);
			if(!refreshtoken) {
				return result;
			}
			const matchRefreshTokenString = `SELECT * FROM USERS WHERE 
			refresh_token='${refreshtoken}'`;
			const matchRefreshTokenResult = await Pool.query(matchRefreshTokenString);
			if(!matchRefreshTokenResult.rows)
				throw new Error();
			jwt.verify(refreshtoken, process.env.refresh_jwt_secret);
			result['authToken'] = generateAccessToken(matchRefreshTokenResult.rows[0].email);
			result['user'] = filterUserObject(matchRefreshTokenResult.rows[0]);
			result['status'] = true;
			return result;
		}
		catch(err){
			return result;
		}
	};

	try{
		const accessToken = req.header('Authorization').replace('Bearer ', '');
		const authTokenResult = await verifyAuthToken(accessToken);
		if(authTokenResult['status']) {
			req['user'] = authTokenResult['user'];
			req['authToken'] = accessToken;
		} else {
			const refreshTokenResult = await verifyRefreshToken();
			if(refreshTokenResult['status']) {
				req['user'] = refreshTokenResult['user'];
				req['authToken'] = refreshTokenResult['authToken'];
			} else {
				throw new Error();
			}
		}
		next();
	} catch(e) {
		res.status(401).send({err: 'Please authenticate.'});
	}
};

module.exports = {auth};