const test = () => {
    return null;
}
const db = require('../db/database'); 
const Pool = db.getPool();
const checkUserObjectForNull = (userObject) => {
	if(!userObject) {
		return false;
	}
	const { email, firstName, lastName, password ,role} = userObject;
	if(!email || !firstName || !lastName || !password || !role){
		return false;
	}
	return true;
};

const findUser = async (userCred) => {
	const checkForExistingEmail = `SELECT * FROM USERS WHERE email=
	'${userCred.email.toLowerCase()}'`;
	const checkForExistingEmailResult = await Pool.query(checkForExistingEmail);

	if(checkForExistingEmailResult.rows.length == 0){
		throw new Error('User does not exists');
	}
	return checkForExistingEmailResult.rows[0];
};

const checkEmailAndPasswordForNull = (userCred) => {
	const { email,password } = userCred;
	if(!email || !password){
		return false;
	}
	return true;
};


const genOTP = (len) => {
	var result = '';
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for(var i = 0 ; i< len ; i++){
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

const checkRequestInitiationObjectForNull = (requestObject) => {
	if(!requestObject) {
		return false;
	}
	const {request_from, request_to, job_id, company_id, job_url, job_name} = requestObject;
	if(!request_from, !request_to || !job_id || !company_id || !job_url || !job_name) {
		return false;
	}
	return true;
};

module.exports = {
	checkUserObjectForNull,
	findUser,
	checkEmailAndPasswordForNull,
	genOTP,
	checkRequestInitiationObjectForNull
};
