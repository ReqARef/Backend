const db = require('../db/database');
const Pool = db.getPool();
const {getResponseObjectTemplate} = require('../utils/helperFunctions');

const usersSearch = async (req, res) => {
	const result = getResponseObjectTemplate(req);
	try{
		if(!req.params.company_name){
			throw new Error('Company Name is null');
		}
		const companyName = req.params.company_name;
		const userSearchQuery =`SELECT email,first_name,last_name,job_role FROM USERS 
								WHERE company_name='${companyName.toLowerCase()}';`;
		const userSearchResult = await Pool.query(userSearchQuery);
		result['status'] = true;
		result['data'] = userSearchResult['rows'];
		result['message'] = 'Success';
		result['authToken'] = req.authToken;
		return res.send(result);
	}
	catch(e){
		result['error']=e.message;
		return res.send(result);
	}
};

module.exports ={
	usersSearch
};