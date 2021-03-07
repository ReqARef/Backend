const db = require('../db/database');
const Pool = db.getPool();
const { checkRequestObjectForNull, generateId } = require('../utils/RequestHelper');

const requestController = async (req,res) => {
	const result = {status : false};
	const requestObject = req.body;
	try{
		if(checkRequestObjectForNull(requestObject)){
			throw new Error('Invalid Inputs');
		}
		const id = generateId(requestObject);
		const requestSearchString = `SELECT * FROM REQUESTS WHERE id='${id}'`;
		const requestSearchResult = await Pool.query(requestSearchString);
		if(requestSearchResult.rows.length > 0){
			throw new Error('Request already exists');
		}
		const insertRequestString = `INSERT INTO REQUESTS(id,request_from, request_to, job_id, 
			company_id, job_url, job_name, referee_comment ) VALUES('${id}',
			'${requestObject.requestFrom}', '${requestObject.requestTo}', '${requestObject.jobId}',
			'${requestObject.companyId}','${requestObject.jobUrl}', '${requestObject.jobName}',
			'${requestObject.refereeComment}');`;
		await Pool.query(insertRequestString);
		result['status'] = true;
		result['message']='Request added successfully';
		return res.send(result);
	}
	catch(err){
		result['error'] = err.message;
		return res.send(result);
	}
};

module.exports = requestController;