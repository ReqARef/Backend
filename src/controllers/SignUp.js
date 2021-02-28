const db = require('../db/database');
const Pool = db.getPool();
const bcrypt = require('bcryptjs');
const {checkUserObjectForNull} = require('../utils/helperFunctions');
const {generateAccessToken, generateRefreshToken} = require('../utils/LoginHelper');

const signUp = async(req,res) => {
	const result = {status: false};
	try{
		const userObject = req.body;
		if(!checkUserObjectForNull(userObject)){
			throw new Error('Invalid inputs');
		}
		userObject.email = userObject.email.toLowerCase();
		const checkExistingEmailString = `SELECT email FROM USERS WHERE email=
			'${userObject.email}';`;
		const checkExistingEmailResult = await Pool.query(checkExistingEmailString);
		if(checkExistingEmailResult.rows.length > 0){
			result['error'] = 'Email already exist';
			return res.send(result);
		}
		userObject.password = await bcrypt.hash(
			userObject.password, parseInt(process.env.bcrypt_rounds)
		);
		const refreshToken = generateRefreshToken(userObject.email);
		const authToken = generateAccessToken(userObject.email);
		const insertRowString = `INSERT INTO USERS(email,first_name,last_name,password, role) VALUES(
			'${userObject.email}','${userObject.firstName}',
			'${userObject.lastName}','${userObject.password}', '${userObject.role}');`;
		await Pool.query(insertRowString);
		result['status'] = true;
		result['message'] = 'User Added Successfully';
		delete userObject['password'];
		result['user'] = userObject;
		result['authToken'] = authToken;
		result['refreshToken'] = refreshToken;
		res.send(result);
	}
	catch(err){
		result.error = err.message;
		return res.send(result);
	}
};

module.exports = {
	signUp
};