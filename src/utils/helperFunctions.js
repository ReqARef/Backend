const db = require('../db/database'); 
const Pool = db.getPool();
const checkUserObjectForNull = (userObject) => {
	const { email, firstName, lastName, password, role, companyName, experience, college, jobRole,
		resume} = userObject;
	if(!email || !firstName || !lastName || !password || !role || !companyName || !experience || 
		!college || !jobRole || !resume){
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

const validateUserCred = (userCred) => {
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

module.exports = {
	checkUserObjectForNull,
	findUser,
	validateUserCred,
	genOTP
};