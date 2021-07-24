const db = require('../db/database');
const { getResponseObjectTemplate } = require('../utils/helperFunctions');
const Pool = db.getPool();
const Logger = require('../utils/Logger');

const getProfile = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    try {
        result['data'] = req.user;
        result['status'] = true;
        result['message'] = 'Success';
        res.send(result);
    } catch (err) {
        Logger.error(`Failed to get profile for req ${req} and error ${err}`);
        result['error'] = err.message;
        return res.send(result);
    }
};

const updateProfile = async (req, res) => {
    const getUpdateString = (req) => {
        let {
            firstName: first_name,
            lastName: last_name,
            companyName: company_name,
            position: job_role,
            college,
            experience,
            country,
            role,
            bio,
            resume
        } = req.body;
        const body = {
            first_name,
            last_name,
            company_name,
            job_role,
            college,
            experience,
            country,
            role,
            bio
        };
        const { email } = req.user;
        let updateString = 'UPDATE users SET ';
        if (company_name) {
            body.company_name = body.company_name.trim().toLowerCase();
        }
        if (resume && resume.length > 0) {
            if (!resume.includes('http')) {
                resume = 'http://' + resume;
            }
            body.resume = resume;
        }
        const keys = Object.keys(body);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            updateString =
                updateString +
                `${key}=${body[key] === '' ? 'NULL' : `'${body[key]}'`}, `;
        }
        updateString = updateString.trim(' ');
        updateString = updateString.substring(0, updateString.length - 1);
        updateString = updateString + ` WHERE email='${email}'`;
        return updateString;
    };

    const result = getResponseObjectTemplate(req);
    try {
        let { companyName } = req.body;
        const { email } = req.user;
        if (companyName && companyName.trim()) {
            companyName = companyName.trim().toLowerCase();
            const checkForCompany = `SELECT company_name FROM companies where company_name=
				'${companyName}'`;
            const checkForCompanyResult = await Pool.query(checkForCompany);
            if (!checkForCompanyResult.rows.length) {
                const addCompany = `INSERT INTO companies(company_name) values ('${companyName}')`;
                await Pool.query(addCompany);
            }
        }
        const updateString = getUpdateString(req);
        await Pool.query(updateString);
        let newUserObject = await Pool.query(
            `SELECT * FROM users where email='${email}'`
        );
        newUserObject = newUserObject.rows[0];
        delete newUserObject['password'];
        delete newUserObject['refresh_token'];
        result['user'] = newUserObject;
        result['status'] = true;
        result['message'] = 'Success';
        res.send(result);
    } catch (err) {
        Logger.error(
            `Failed to update profile for req ${req} and error ${err}`
        );
        result['error'] = err.message;
        return res.send(result);
    }
};

const setAvatar = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    try {
        const image = req.file.buffer;
        // eslint-disable-next-line quotes
        const string = `UPDATE USERS SET avatar=$1 WHERE email='${req.user.email}';`;
        await Pool.query(string, [image]);
        const getUserString = `SELECT * FROM USERS WHERE email='${req.user.email}';`;
        const userResult = await Pool.query(getUserString);
        result['user'] = userResult.rows[0];
        if (result['user']['password']) {
            delete result['user']['password'];
        }
        if (result['user']['refresh_token']) {
            delete result['user']['refresh_token'];
        }
        result['status'] = true;
        result['message'] = 'Success';
        res.send(result);
    } catch (err) {
        Logger.error(
            `Failed to update profile for req ${req} and error ${err}`
        );
        result['error'] = err.message;
        return res.send(result);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    setAvatar
};
