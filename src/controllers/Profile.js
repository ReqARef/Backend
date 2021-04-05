const db = require('../db/database');
const {getResponseObjectTemplate} = require('../utils/helperFunctions');
const Pool = db.getPool();

const getProfile = async (req,res) => {
	const result = getResponseObjectTemplate(req);
	try{
		result['data'] = req.user;
		result['status'] = true;
		result['message'] = 'Success';
		res.send(result);
	}
	catch(err){
		result['error'] = err.message;
		return res.send(result);
	}
};

const updateProfile = async (req,res) => {
	const getUpdateString = (req) => {
		let {firstName: first_name, lastName: last_name, companyName: company_name, position: job_role, 
			college, experience, country, role, bio} = req.body;
		const body = {first_name, last_name, company_name, job_role, college, experience, 
			country, role, bio};
		const {email} = req.user;
		let updateString = 'UPDATE users SET ';
		if(company_name) {
			body.company_name = body.company_name.trim().toLowerCase();
		}
		const keys = Object.keys(body);
		for (let i = 0; i<keys.length; i++) {
			const key = keys[i];
			updateString = updateString + 
			`${key}=${body[key] === '' ? 'NULL' : ('\'' + body[key] + '\'')}, `;
		}
		updateString = updateString.trim(' ');
		updateString = updateString.substring(0, updateString.length-1);
		updateString = updateString + ` WHERE email='${email}'`;
		return updateString;
	};

	const result = getResponseObjectTemplate(req);
	try{
		let {companyName} = req.body;
		const {email} = req.user;
		if(companyName && companyName.trim()) {
			companyName = companyName.trim().toLowerCase();
			const checkForCompany = `SELECT company_name FROM companies where company_name=
				'${companyName}'`;
			const checkForCompanyResult = await Pool.query(checkForCompany);
			if(!checkForCompanyResult.rows.length) {
				const addCompany = `INSERT INTO companies(company_name) values ('${companyName}')`;
				await Pool.query(addCompany);
			}
		}
		const updateString = getUpdateString(req);
		await Pool.query(updateString);
		let newUserObject = await Pool.query(`SELECT * FROM users where email='${email}'`);
		newUserObject = newUserObject.rows[0];
		delete newUserObject['password'];
		delete newUserObject['refresh_token'];
		result['user'] = newUserObject;
		result['status'] = true;
		result['message'] = 'Success';
		res.send(result);
	}
	catch(err) {
		result['error'] = err.message;
		return res.send(result);
	}
};

module.exports = {
	getProfile,
	updateProfile
};