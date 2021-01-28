const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const Pool = db.getPool();

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
	return refreshToken;
};

const generateNewAndSaveRefreshToken = async (email) => {
	if(!email){
		throw new Error('User\'s email not found');
	}
	var newRefreshToken=null;
	newRefreshToken = generateRefreshToken(email);
	const updateRefreshTokenString = `UPDATE USERS
	SET refresh_token = ${newRefreshToken}
	WHERE email = ${email}`;
	await Pool.query(updateRefreshTokenString);
	return newRefreshToken;
};


module.exports = {
	findByCredentials,
	generateAccessToken,
	generateRefreshToken,
	generateNewAndSaveRefreshToken
};