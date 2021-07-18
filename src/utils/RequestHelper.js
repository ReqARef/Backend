const db = require('../db/database');
const Pool = db.getPool();
const checkRequestObjectForNull = (requestObject) => {
    const { requestFrom, requestTo, jobId, companyName, jobUrl, comments } =
        requestObject;
    if (
        !requestFrom ||
        !requestTo ||
        !jobId ||
        !companyName ||
        !jobUrl ||
        !comments
    ) {
        return false;
    }
    return true;
};

const extractRefreshTokenHeaderFromReq = (req) => {
    const { rawHeaders } = req;
    for (let i = 0; i < rawHeaders.length; i++) {
        if (rawHeaders[i].includes('refreshToken=')) {
            return rawHeaders[i].substring(13);
        }
    }
    return null;
};

const generateId = (requestObject) => {
    const { requestFrom, requestTo, jobId, companyName } = requestObject;
    const id =
        'request_' +
        convertToBase64(requestFrom) +
        '_' +
        convertToBase64(requestTo) +
        '_' +
        convertToBase64(jobId) +
        '_' +
        convertToBase64(companyName);
    return id;
};

const convertToBase64 = (temp) => {
    return Buffer.from(temp).toString('base64');
};

const getRequestHelper = async (userEmail, page) => {
    const offset = 10 * page;
    const limit = 10;
    const requestSearchString = `SELECT R.*, to_json(U.*) as user, U.avatar as avatar \
	FROM REQUESTS R, USERS U WHERE R.request_to='${userEmail}' AND R.request_from=U.email \
    AND R.referral_status=0 ORDER BY created_on DESC LIMIT ${limit} OFFSET ${offset};`;
    const requestSearchResult = await Pool.query(requestSearchString);
    const requests = requestSearchResult.rows || [];
    for (let i = 0; i < requests.length; i++) {
        delete requests[i].user.password;
        delete requests[i].user.refresh_token;
        delete requests[i].user.email_verified;
        delete requests[i].user.created_on;
        // When a bytea is put into to_json() it gets converted and then the output is not a
        // byte object that we expect so using "U.avatar as avatar" as a hack to get bytea object
        delete requests[i].user.avatar;
        requests[i].user.avatar = requests[i].avatar;
        delete requests[i].avatar;
    }

    if (`${page}` === '0') {
        const totalPagesString = `SELECT COUNT(*) FROM REQUESTS WHERE request_to='${userEmail}' \
		AND referral_status=0`;
        const totalPagesResult = await Pool.query(totalPagesString);
        const totalRequests = totalPagesResult.rows[0].count;
        const totalPages = Math.ceil(totalRequests / 10.0);
        return { requests, totalPages };
    }

    return { requests };
};

module.exports = {
    checkRequestObjectForNull,
    generateId,
    extractRefreshTokenHeaderFromReq,
    getRequestHelper
};
