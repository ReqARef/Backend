const checkUserObjectForNull = (userObject) => {
	const { email, firstName, lastName, password, role, companyName, experience, college, jobRole,
		resume} = userObject;
	if(!email || !firstName || !lastName || !password || !role || !companyName || !experience || 
		!college || !jobRole || !resume){
		return false;
	}
	return true;
};

module.exports = {
	checkUserObjectForNull
};