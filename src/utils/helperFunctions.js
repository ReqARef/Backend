const checkUserObjectForNull = (userObject) => {
	if(!userObject) {
		return false;
	}
	const { email, firstName, lastName, password, role, companyName, experience, college, jobRole,
		resume} = userObject;
	if(!email || !firstName || !lastName || !password || !role || !companyName || !experience || 
		!college || !jobRole || !resume){
		return false;
	}
	return true;
};

const checkRequestInitiationObjectForNull = (requestObject) => {
	if(!requestObject) {
		return false;
	}
	const {request_from, request_to, job_id, company_id, job_url, job_name} = requestObject;
	if(!request_from, !request_to || !job_id || !company_id || !job_url || !job_name) {
		return false;
	}
	return true;
};

module.exports = {
	checkUserObjectForNull,
	checkRequestInitiationObjectForNull
};