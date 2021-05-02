const db = require('../db/database');
const Pool = db.getPool();
const {getResponseObjectTemplate} = require('../utils/helperFunctions'); 

const stats = async (req,res) => {
	const result = getResponseObjectTemplate(req);
	try{
		if(!req.user.email){
			throw new Error('User Email is null');
		}
		let userEmail = req.user.email;
		const stats = {
			pendingRequests : 0,
			rejectedRequests : 0,
			acceptedRequests : 0,
			requestCount : 0
		};
		const requestSearchString = `SELECT * FROM REQUESTS WHERE request_from='${userEmail}'`;
		const requestSearchResult = await Pool.query(requestSearchString);
		let requests = requestSearchResult.rows;
		for(let i = 0 ; i < requests.length ; i++){
			switch(requests[i].referral_status){
			case 0:
				stats.pendingRequests++;
				break;
			case 1:
				stats.acceptedRequests++;
				break;
			default:
				stats.rejectedRequests++;
			}
			stats.requestCount++;
		}
		result['stats']=stats;
		result['status']=true;
		result['authToken'] = req['authToken'];
		return res.send(result);
	}
	catch(err){
		console.log(err.message);
		result['error'] = err.message;
		delete result['user'];
		return res.send(result);
	}
};

module.exports = stats;