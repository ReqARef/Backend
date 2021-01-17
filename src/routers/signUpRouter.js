const express = require('express');
const router = new express.Router();
const Pool = require('../db/database');
const bcrypt = require('bcryptjs');

router.post('/signup' , async(req,res) => {
	const userObject = req.body;
	var queryString = 'SELECT COUNT(*) FROM USERS WHERE email= \''+ userObject.email+ '\'';

	try{
		const queryResult = await Pool.query(queryString);
		if(queryResult.rowCount>0){
			throw new Error('Email is already registered');
		}
	}
	catch(err){
		return res.send({
			error : err.toString()
		});
	}

	userObject.password = await bcrypt.hash(userObject.password,8);
	queryString = 'INSERT INTO USERS(email,f_name,l_name,password,role,company_name,experience,college,job_role,resume) VALUES(\''+ userObject.email +'\',\''+ userObject.fName+'\',\''+userObject.lName+'\',\''+userObject.password+'\','+userObject.role +',\'' + userObject.companyName +'\','+userObject.experience+',\''+userObject.college+'\',\''+userObject.jobRole+'\',\''+userObject.resume+'\');';

	try{
		await Pool.query(queryString);
	}
	catch(err){
		return res.send({
			error : err.toString()
		});
	}
    
	res.send({
		success : 'User Added Successfully'
	});
});

module.exports = router;