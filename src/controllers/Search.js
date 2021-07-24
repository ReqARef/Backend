const db = require('../db/database');
const Pool = db.getPool();
const { getResponseObjectTemplate } = require('../utils/helperFunctions');
const Logger = require('../utils/Logger');

const searchUsersByCompany = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    try {
        if (!req.params.company_name) {
            throw new Error('Company Name is null');
        }
        const companyName = req.params.company_name;
        const userSearchQuery = `SELECT email,first_name,last_name,job_role,avatar FROM USERS 
								WHERE company_name='${companyName.toLowerCase()}' ORDER BY first_name, last_name;`;
        const userSearchResult = await Pool.query(userSearchQuery);
        result['status'] = true;
        result['data'] = userSearchResult['rows'];
        result['message'] = 'Success';
        result['authToken'] = req.authToken;
        return res.send(result);
    } catch (err) {
        Logger.error(
            `Failed to search users by company for req ${req} and error ${err}`
        );
        result['error'] = err.message;
        return res.send(result);
    }
};

const searchUserByEmail = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    try {
        if (!req.params.email) {
            throw new Error('Email is null');
        }
        const email = req.params.email;
        const checkExistingEmailString = `SELECT first_name FROM USERS WHERE email=
			'${email}';`;
        const checkExistingEmailResult = await Pool.query(
            checkExistingEmailString
        );
        if (checkExistingEmailResult.rows.length == 0) {
            result['error'] = 'Email does not exist';
            return res.send(result);
        }
        const userSearchQuery = `SELECT email,first_name,last_name,country,experience,resume, 
            college,bio,company_name,avatar FROM USERS WHERE email='${email}';`;
        const userSearchResult = await Pool.query(userSearchQuery);
        result['status'] = true;
        result['data'] = userSearchResult['rows'][0];
        return res.send(result);
    } catch (err) {
        Logger.error(
            `Failed to search user by email for req ${req} and error ${err}`
        );
        result['error'] = err.message;
        return res.send(result);
    }
};

module.exports = {
    searchUsersByCompany,
    searchUserByEmail
};
