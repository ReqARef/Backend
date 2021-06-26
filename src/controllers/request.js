const db = require('../db/database');
const Pool = db.getPool();
const { checkRequestObjectForNull, generateId } = require('../utils/RequestHelper');
const emailSender = require('../utils/emailSender');

const postRequestController = async (req,res) => {
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
		const getSenderNameString = `SELECT * FROM USERS WHERE email='${requestObject.requestFrom}'`;
		const senderName = await Pool.query(getSenderNameString);
		const getReceiverNameString = `SELECT * FROM USERS WHERE email='${requestObject.requestTo}'`;
		const receiverName = await Pool.query(getReceiverNameString);
		console.log(receiverName.rows[0]);
		console.log(senderName.rows[0]);
		const email = {
			to : receiverName.rows[0].email,
			subject : 'Received a referral request',
			type : 'incomingRequest',
			toUser : receiverName.rows[0].first_name,
			fromUser : senderName.rows[0].first_name+' '+ senderName.rows[0].last_name
		};
		emailSender(email);
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

const getRequestController = async (req,res) => {
	const result = {status : false};
	const userEmail = req.user.email;
	const requestSearchString = `SELECT * FROM REQUESTS WHERE request_to = '${userEmail}';`;
	try{
		const requestSearchResult = await Pool.query(requestSearchString);
		let requests = [];
		if(requestSearchResult != null){
			requests = requestSearchResult.rows;
		}

		for( var i = 0; i < requests.length ; i++){
			const userSearchQuery = `SELECT * FROM USERS WHERE email = '${requests[i].request_from}';`;
			const userSearchQueryResult = await Pool.query(userSearchQuery);
			requests[i]['user'] = userSearchQueryResult.rows[0];
		}
		result['status']=true;
		result['requests']=requests;
		return res.send(result);
	}
	catch(err){
		console.log(err);
		result['error'] = err.message;
		return res.send(result);
	}
};
module.exports = {
	postRequestController,
	getRequestController
};
