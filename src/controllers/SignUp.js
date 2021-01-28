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
		const checkExistingEmailString = `SELECT email,mobile FROM USERS WHERE email=
			'${userObject.email.toLowerCase()}' OR mobile='${userObject.mobile}';`;
		const checkExistingEmailResult = await Pool.query(checkExistingEmailString);
		if(checkExistingEmailResult.rows.length > 0){
			result['error'] = 'User already exist';
			return res.send(result);
		}
	
		const checkExistingCompanyString = `SELECT * FROM COMPANIES
			WHERE company_name='${userObject.companyName.toUpperCase()}';`;
		const checkExistingCompanyResult = await Pool.query(checkExistingCompanyString);
		if(checkExistingCompanyResult.rows.length>0){
			var total_employees = parseInt(checkExistingCompanyResult.rows[0].total_employees)+1;
			const alterCompaniesTableString = `UPDATE COMPANIES 
				SET total_employees = '${total_employees}'
				WHERE company_name = '${checkExistingCompanyResult.rows[0].company_name}'`;
			
			await Pool.query(alterCompaniesTableString);	
		}
		else{
			const insertCompanyNameString = `INSERT INTO COMPANIES(company_name) VALUES(
			'${userObject.companyName.toUpperCase()}');`;
			await Pool.query(insertCompanyNameString);
		}	
		userObject.password = await bcrypt.hash(
			userObject.password, parseInt(process.env.bcrypt_rounds)
		);
		const refreshToken = generateRefreshToken(userObject.email.toLowerCase());
		const authToken = generateAccessToken(userObject.email.toLowerCase());
		const insertRowString = `INSERT INTO USERS(email,mobile,first_name,last_name,password,role,
			company_name, experience,college,job_role,resume,refresh_token) VALUES(
			'${userObject.email.toLowerCase()}', ${userObject.mobile},'${userObject.firstName}',
			'${userObject.lastName}','${userObject.password}','${userObject.role}', 
			'${userObject.companyName.toUpperCase()}', '${userObject.experience}', 
			'${userObject.college}', '${userObject.jobRole}', '${userObject.resume}', 
			'${refreshToken}');`;
		await Pool.query(insertRowString);
		result['status'] = true;
		result['message'] = 'User Added Successfully';
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