const db = require('../db/database');
const Pool = db.getPool();

const checkUserObjectForNull = (userObject) => {
    if (!userObject) {
        return false;
    }
    const { email, firstName, lastName, password, role } = userObject;
    if (!email || !firstName || !lastName || !password || !role) {
        return false;
    }
    return true;
};

const findUser = async (userCred) => {
    const checkForExistingEmail = `SELECT * FROM USERS WHERE email=
	'${userCred.email.toLowerCase()}'`;
    const checkForExistingEmailResult = await Pool.query(checkForExistingEmail);

    if (checkForExistingEmailResult.rows.length == 0) {
        throw new Error('User does not exists');
    }
    return checkForExistingEmailResult.rows[0];
};

const checkEmailAndPasswordForNull = (userCred) => {
    const { email, password } = userCred;
    if (!email || !password) {
        return false;
    }
    return true;
};

const genOTP = async (len, email) => {
    var result = '';
    var chars = '0123456789';
    for (var i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (email) {
        const insertOtpString = `UPDATE USERS SET otp='${result}' WHERE email='${email}';`;
        await Pool.query(insertOtpString);
    }
    return result;
};

const checkRequestInitiationObjectForNull = (requestObject) => {
    if (!requestObject) {
        return false;
    }
    const { request_from, request_to, job_id, company_id, job_url, job_name } =
        requestObject;
    if (
        (!request_from,
        !request_to || !job_id || !company_id || !job_url || !job_name)
    ) {
        return false;
    }
    return true;
};

const getResponseObjectTemplate = (req) => {
    if (req.user && req.user.password) {
        delete req.user.password;
    }
    if (req.user && req.user.refresh_token) {
        delete req.user.refresh_token;
    }
    // Use this only for functions that go through auth middleware
    const result = {
        status: false,
        user: req.user,
        authToken: req.authToken
    };
    return result;
};

module.exports = {
<<<<<<< HEAD
	checkUserObjectForNull,
	findUser,
	checkEmailAndPasswordForNull,
	genOTP,
	checkRequestInitiationObjectForNull,
	getResponseObjectTemplate
=======
    checkUserObjectForNull,
    findUser,
    checkEmailAndPasswordForNull,
    genOTP,
    checkRequestInitiationObjectForNull,
    getResponseObjectTemplate
>>>>>>> fec786a26ec806d992f79ecbf817bdd0cad2d55a
};
