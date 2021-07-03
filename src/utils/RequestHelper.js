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
    console.log(requestObject);
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

module.exports = {
    checkRequestObjectForNull,
    generateId,
    extractRefreshTokenHeaderFromReq
};
