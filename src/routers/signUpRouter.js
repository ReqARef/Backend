const express = require('express');
const router = new express.Router();
const Pool = require('../db/database');
const bcrypt = require('bcryptjs');

router.post('/signup' , async(req,res) => {
	
	try{
		const userObject = req.body;
		if(!validateObject(userObject)){
			throw new Error('User Obeject is not correct!!');
		}
		var queryString = 'SELECT COUNT(*) FROM USERS WHERE email= \''+ userObject.email+ '\'';
		const queryResult = await Pool.query(queryString);
		if(queryResult.rows[0].count>0){
			throw new Error('Email is already registered');
		}
		userObject.password = await bcrypt.hash(userObject.password,parseInt(process.env.bcrypt_rounds));
		queryString = 'INSERT INTO USERS(email,first_name,last_name,password,role,company_name,experience,college,job_role,resume) VALUES(\''+ userObject.email +'\',\''+ userObject.fName+'\',\''+userObject.lName+'\',\''+userObject.password+'\','+userObject.role +',\'' + userObject.companyName +'\','+userObject.experience+',\''+userObject.college+'\',\''+userObject.jobRole+'\',\''+userObject.resume+'\');';
		await Pool.query(queryString);
	}
	catch(err){
		console.log(err);
		return res.send({
			error : err.message
		});
	}
    
	res.send({
		success : 'User Added Successfully'
	});
});

const validateObject = (userObject) => {
	const { email, fName, lName, password, role, companyName, experience, college, jobRole, resume} = userObject;
	if(!email || !fName || !lName || !password || !role || !companyName || !experience || !college || !jobRole || !resume){
		return false;
	}
	return true;
};

module.exports = router;