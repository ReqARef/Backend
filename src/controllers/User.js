const db = require('../db/database');
const Pool = db.getPool();

const user = async (req, res) => {
	const result = {status : false};
	try{
		if(!req.query.company_name){
			throw new Error('Company Name is null');
		}
		const companyName = req.query.company_name;
		const userSearchQuery =`SELECT email,first_name,last_name,job_role FROM USERS 
								WHERE company_name='${companyName.toLowerCase()}';`;
		const userSearchResult = await Pool.query(userSearchQuery);
		result['status'] = true;
		result['userList'] = userSearchResult['rows'];
		result['message'] = 'Success';
		console.log(result);
		return res.send(result);
	}
	catch(e){
		result['error']=e.message;
		return res.send(result);
	}
};

module.exports ={
	user
};