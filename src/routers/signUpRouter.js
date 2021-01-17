const express = require('express');
const router = new express.Router();
const Pool = require('../db/database');
const bcrypt = require('bcryptjs');

const validateUserObject = (userObject) => {
	const { email, fName, lName, password, role, companyName, experience, college, jobRole,
		resume} = userObject;
	if(!email || !fName || !lName || !password || !role || !companyName || !experience || 
		!college || !jobRole || !resume){
		return false;
	}
	return true;
};

router.post('/signup' , async(req,res) => {
	try{
		const userObject = req.body;
		if(!validateUserObject(userObject)){
			throw new Error('Invalid inputs');
		}
		var queryString = 'SELECT COUNT(*) FROM USERS WHERE email= \''+ userObject.email+ '\'';
		const queryResult = await Pool.query(queryString);
		if(queryResult.rows[0].count>0){
			throw new Error('Email is already registered');
		}
		userObject.password = await bcrypt.hash(
			userObject.password, parseInt(process.env.bcrypt_rounds)
		);
		queryString = `INSERT INTO USERS(email,first_name,last_name,password,role,company_name,
			experience,college,job_role,resume) VALUES('${userObject.email}', 
			'${userObject.firstName}', '${userObject.lastName}', '${userObject.password}',
			'${userObject.role}', '${userObject.companyName}', '${userObject.experience}',
			'${userObject.college}', '${userObject.jobRole}', '${userObject.resume}');`;
		await Pool.query(queryString);
		res.send({
			status: true,
			message : 'User Added Successfully'
		});
	}
	catch(err){
		return res.send({
			status: false,
			error : err.message
		});
	}
});

module.exports = router;