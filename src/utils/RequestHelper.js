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

const getRequestHelper = async (userEmail) => {
    const requestSearchString = `SELECT * FROM REQUESTS WHERE request_to = '${userEmail}';`;
    const requestSearchResult = await Pool.query(requestSearchString);
    let requests = [];
    if (requestSearchResult != null) {
        requests = requestSearchResult.rows;
    }

    for (var i = 0; i < requests.length; i++) {
        const userSearchQuery = `SELECT * FROM USERS WHERE \
            email='${requests[i].request_from}';`;
        const userSearchQueryResult = await Pool.query(userSearchQuery);
        requests[i]['user'] = userSearchQueryResult.rows[0];
    }
    return requests;
};

module.exports = {
    checkRequestObjectForNull,
    generateId,
    extractRefreshTokenHeaderFromReq,
    getRequestHelper
};
