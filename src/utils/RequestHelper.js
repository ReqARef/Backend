const checkRequestObjectForNull = (requestObject) => {
	const { requestFrom, requestTo, jobId, companyId, jobUrl, jobName,refereeComment } 
	= requestObject;

	if(!requestFrom || !requestTo || !jobId || !companyId || !jobUrl || !jobName || !refereeComment){
		return false;
	}
	return true;
};

const generateId = (requestObject) => {
	const {requestFrom, requestTo, jobId, companyId} = requestObject;
	const id = 'request_'+convertToBase64(requestFrom)+'_'+convertToBase64(requestTo)
	+'_'+convertToBase64(jobId)+'_'+convertToBase64(companyId);
	return id;
};

const convertToBase64 = (temp) => {
	return Buffer.from(temp).toString('base64');
};

module.exports = {
	checkRequestObjectForNull,
	generateId
};