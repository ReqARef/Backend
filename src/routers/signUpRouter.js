const express = require('express');
const router = new express.Router();
const Pool = require('../db/database');
const bcrypt = require('bcryptjs');

router.post('/signup' , async(req,res) => {
	
	try{

		const userObject = req.body;

		if(userObject === null){
			throw new Error('User is NULL!!');
		}
		var queryString = 'SELECT COUNT(*) FROM USERS WHERE email= \''+ userObject.email+ '\'';
		const queryResult = await Pool.query(queryString);
		
		if(queryResult.rows[0].count>0){
			throw new Error('Email is already registered');
		}

		userObject.password = await bcrypt.hash(userObject.password,8);
		queryString = 'INSERT INTO USERS(email,first_name,last_name,password,role,company_name,experience,college,job_role,resume) VALUES(\''+ userObject.email +'\',\''+ userObject.fName+'\',\''+userObject.lName+'\',\''+userObject.password+'\','+userObject.role +',\'' + userObject.companyName +'\','+userObject.experience+',\''+userObject.college+'\',\''+userObject.jobRole+'\',\''+userObject.resume+'\');';
		
		await Pool.query(queryString);
	}
	catch(err){
		return res.send({
			error : err.message
		});
	}
    
	res.send({
		success : 'User Added Successfully'
	});
});

module.exports = router;