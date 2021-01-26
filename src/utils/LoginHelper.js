const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pool = require('../db/database');

const findByCredentials = async (email, password) => {
	const checkForEmailString = `SELECT * FROM USERS WHERE email=${email.toLowerCase()}`;
	const checkForEmailResult = await Pool.query(checkForEmailString);
	if(!checkForEmailResult.rows)
		throw new Error('Email does not exist');
	const user = checkForEmailResult.rows[0];
	const isMatch = await bcrypt.compare(password, user.password);
	return isMatch;
};

const generateAccessToken = (email) => {
	if(!email) {
		throw new Error('User\'s email not found');
	}
	const accessToken = jwt.sign({email}, 
		process.env.access_jwt_secret, { expiresIn: process.env.access_jwt_expiry});
	return accessToken;
};

const generateRefreshToken = async (email) => {
	if(!email) {
		throw new Error('User\'s email not found');
	}
	const refreshToken = jwt.sign({email}, 
		process.env.refresh_jwt_secret, { expiresIn: process.env.refresh_jwt_expiry});
	const insertToDbString = `INSERT INTO USERS(refresh_token) VALUES(${refreshToken}) 
		WHERE email=${email}`;
	await Pool.query(insertToDbString);
	return refreshToken;
};


module.exports = {
	findByCredentials,
	generateAccessToken,
	generateRefreshToken
};