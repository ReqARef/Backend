const db = require('../db/database');
const Pool = db.getPool();
const { checkRequestObjectForNull, generateId } = require('../utils/RequestHelper');

const requestController = async (req,res) => {
	const result = {status : false};
	const requestObject = req.body;
	requestObject['requestFrom']=req.user.email;
	try{
		if(!checkRequestObjectForNull(requestObject)){
			throw new Error('Invalid Inputs');
		}
		const id = generateId(requestObject);
		const requestSearchString = `SELECT * FROM REQUESTS WHERE id='${id}'`;
		const requestSearchResult = await Pool.query(requestSearchString);
		if(requestSearchResult.rows.length > 0){
			throw new Error('Request already exists');
		}
		const insertRequestString = `INSERT INTO REQUESTS(id,request_from, request_to, job_id, 
			company_id, job_url, referee_comment ) VALUES('${id}',
			'${requestObject.requestFrom}', '${requestObject.requestTo}', '${requestObject.jobId}',
			'${requestObject.companyName}','${requestObject.jobUrl}',
			'${requestObject.refereeComment}');`;
		await Pool.query(insertRequestString);
		result['status']=true;
		result['authToken']=req.authToken;
		result['message']='Request added successfully';
		return res.send(result);
	}
	catch(err){
		console.log(err);
		result['error'] = err.message;
		return res.send(result);
	}
};

module.exports = requestController;