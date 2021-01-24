const Pool = require('../db/database');
const bcrypt = require('bcryptjs');
const {checkUserObjectForNull} = require('../utils/helperFunctions');

const signUp = async(req,res) => {
	const result = {status: false};
	try{
		const userObject = req.body;
		if(!checkUserObjectForNull(userObject)){
			throw new Error('Invalid inputs');
		}
		const checkExistingEmailString = `SELECT id FROM USERS WHERE email=
			'${userObject.email.toLowerCase()}'`;
		const checkExistingEmailResult = await Pool.query(checkExistingEmailString);
		if(checkExistingEmailResult.rows.length > 0){
			result['error'] = 'Email already exist';
			return res.send(result);
		}
		userObject.password = await bcrypt.hash(
			userObject.password, parseInt(process.env.bcrypt_rounds)
		);
		const insertRowString = `INSERT INTO USERS(email,first_name,last_name,password,role,
			company_name, experience,college,job_role,resume) VALUES('${userObject.email.toLowerCase()}', 
			'${userObject.firstName}', '${userObject.lastName}', '${userObject.password}',
			'${userObject.role}', '${userObject.companyName}', '${userObject.experience}',
			'${userObject.college}', '${userObject.jobRole}', '${userObject.resume}');`;
		await Pool.query(insertRowString);
		result['status'] = true;
		result['message'] = 'User Added Successfully';
		res.send(result);
	}
	catch(err){
		console.log(err);
		result.error = err.message;
		return res.send(result);
	}
};

module.exports = {
	signUp
};