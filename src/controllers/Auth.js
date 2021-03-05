const {
	findUser,
	checkEmailAndPasswordForNull,
	checkUserObjectForNull
} = require('../utils/helperFunctions');
const {
	generateNewAndSaveRefreshToken,
	generateAccessToken,
	generateRefreshToken
} = require('../utils/AuthHelper');
const {ONE_MONTH_MS} = require('../utils/constants');
const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Pool = db.getPool();

const login = async(req,res) => {
	const result = {status : false};
	const userCred =req.body;
	try{
		if(!checkEmailAndPasswordForNull(userCred)){
			throw new Error('Invalid Inputs');
		}
		const user = await findUser(userCred);
		const isMatch = await bcrypt.compare(userCred.password,user.password);
		if(!isMatch){
			throw new Error('Password Mismatch');
		}
		var newRefreshToken = null; 
		if(user.refresh_token){
			newRefreshToken=user.refresh_token;
			try{
				jwt.verify(user.refresh_token, process.env.refresh_jwt_secret);
			}catch(err){
				newRefreshToken = await generateNewAndSaveRefreshToken(user.email);
			}
		}
		else{
			newRefreshToken = await generateNewAndSaveRefreshToken(user.email);
		}
		result['status']=true;
		result['message']='Login Successful';
		result['user'] = user;
		result['authToken']= generateAccessToken(user.email);
		res.cookie('refreshToken', newRefreshToken, { maxAge:  ONE_MONTH_MS, httpOnly: true}); 
		res.send(result);
	}
	catch(err){
		result['error'] = err.message;
		return res.send(result); 
	}
};

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
		res.cookie('refreshToken', refreshToken, { maxAge:  ONE_MONTH_MS, httpOnly: true});
		res.send(result);
	}
	catch(err){
		result.error = err.message;
		return res.send(result);
	}
};

module.exports = {
	login,
	signUp
};