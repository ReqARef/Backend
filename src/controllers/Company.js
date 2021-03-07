const db = require('../db/database');

const Pool = db.getPool();

const getCompaniesList = async (req,res) => {
	const result ={status : false};
	try{
		const getListString = 'SELECT * FROM COMPANIES';
		const getListResult = await Pool.query(getListString);
		result['status'] = true;
		result['data'] = getListResult['rows'];
		res.send(result);
	}
	catch(err){
		result['error'] = err.message;
		return res.send(result);
	}
};

module.exports = {
	getCompaniesList
};