//const Pool = require('../db/database');
const {findUser,checkEmailAndPasswordForNUll} = require('../utils/helperFunctions');
const bcrypt = require('bcryptjs');
const result = {status : false};

const login = async( req,res) => {
	
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
		res.send(user);
	}
	catch(err){
		result['error'] = err.message;
		return res.send(result); 
	}
	
};

module.exports = {
	login
};