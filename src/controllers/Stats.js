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
			acceptedRequests : 0
		};
		const requestSearchString = `SELECT * FROM REQUESTS WHERE request_from='${userEmail}'`;
		const requestSearchResult = await Pool.query(requestSearchString);
		
		if(requestSearchResult.rows.length() <= 0){
			throw new Error('No request found for user:'+userEmail);
		}
		let requests = requestSearchResult.rows;
		for(let i = 0 ; i < requests.length() ; i++){
			if(requests[i].referral_status === 0){
				stats.pendingRequests++;
			}
			else if(requests[i].referral_status === 1){
				stats.acceptedRequests++;
			}
			else{
				stats.rejectedRequests++;
			}
		}
		result['status']=true;
		result['stats']=stats;
		result['authToken'] = req['authToken'];
		res.send(result);
	}
	catch(err){
		result['error'] = err.message;
		res.send(res);
	}
};

module.exports = stats;