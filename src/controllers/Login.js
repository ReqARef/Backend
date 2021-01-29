const {findUser,checkEmailAndPasswordForNUll} = require('../utils/helperFunctions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {generateNewAndSaveRefreshToken,generateAccessToken} = require('../utils/LoginHelper');

const login = async( req,res) => {
	const result = {status : false};
	const userCred =req.body;
	try{
		if(!checkEmailAndPasswordForNUll(userCred)){
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
		result['refreshToken']=newRefreshToken;
		result['authToken']= generateAccessToken(user.email);
		res.send(result);
	}
	catch(err){
		result['error'] = err.message;
		return res.send(result); 
	}
};

module.exports = {
	login
};