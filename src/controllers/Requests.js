const db = require('../db/database');
const Pool = db.getPool();
const {
    checkRequestObjectForNull,
    generateId,
    getRequestHelper
} = require('../utils/RequestHelper');
const emailSender = require('../utils/emailSender');
const { getResponseObjectTemplate } = require('../utils/helperFunctions');
const Logger = require('../utils/Logger');

const sendRequests = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    const requestObject = req.body;
    requestObject['requestFrom'] = req.user.email;
    try {
        if (!checkRequestObjectForNull(requestObject)) {
            throw new Error('Invalid Inputs');
        }

        const id = generateId(requestObject);

        const requestSearchString = `SELECT * FROM REQUESTS WHERE id='${id}'`;
        const requestSearchResult = await Pool.query(requestSearchString);
        if (requestSearchResult.rows.length > 0) {
            throw new Error('Request already exists');
        }
        let jobUrl = requestObject.jobUrl;
        if (jobUrl && jobUrl === 'undefined') jobUrl = null;
        if (jobUrl && !jobUrl.includes('http')) {
            jobUrl = 'http://' + jobUrl;
        }
        const insertRequestString = `INSERT INTO REQUESTS(id,request_from, request_to, job_id, 
			company_id, job_url, referee_comment ) VALUES('${id}',
			'${requestObject.requestFrom}', '${requestObject.requestTo}', '${requestObject.jobId}',
			'${requestObject.companyName}','${jobUrl}',
			'${requestObject.comments}');`;
        await Pool.query(insertRequestString);
        // const getSenderNameString = `SELECT * FROM USERS WHERE \
        // 	email='${requestObject.requestFrom}'`;
        // const senderName = await Pool.query(getSenderNameString);
        const getReceiverNameString = `SELECT * FROM USERS WHERE \
			email='${requestObject.requestTo}'`;
        const receiverName = await Pool.query(getReceiverNameString);
        const email = {
            to: receiverName.rows[0].email,
            subject: 'Received a referral request',
            type: 'incomingRequest',
            toUser: receiverName.rows[0].first_name,
            fromUser: req.user.first_name + ' ' + req.user.last_name
        };
        emailSender(email);
        result['status'] = true;
        result['authToken'] = req.authToken;
        result['message'] = 'Request added successfully';
        return res.send(result);
    } catch (err) {
        Logger.error(`Failed to send request for req ${req} and error ${err}`);
        result['error'] = err.message;
        return res.send(result);
    }
};

const getRequests = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    const userEmail = req.user.email;
    const page = req.params.page;
    if (!(page >= 0)) {
        throw new Error('Page not found');
    }
    try {
        const { requests, totalPages } = await getRequestHelper(
            userEmail,
            page
        );
        result['totalPageCount'] = totalPages;
        result['status'] = true;
        result['requests'] = requests;
        return res.send(result);
    } catch (err) {
        Logger.error(`Failed to get requests for req ${req} and error ${err}`);
        result['error'] = err.message;
        return res.send(result);
    }
};

const handleRequests = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    const requestObject = req.body;
    const userEmail = req.user.email;
    try {
        const requestSearchString = `SELECT * FROM REQUESTS WHERE id='${requestObject.requestId}';`;
        const requestSearchQueryResult = await Pool.query(requestSearchString);
        if (requestSearchQueryResult.rows.length <= 0) {
            throw new Error('No request found');
        }
        let status = 0;
        if (requestObject.action === 'accept') {
            status = 1;
        } else {
            status = -1;
        }
        const updateRequestString = `UPDATE REQUESTS SET referral_status=${status}\
			WHERE id='${requestObject.requestId}';`;
        await Pool.query(updateRequestString);
        const { requests, totalPages } = await getRequestHelper(
            userEmail,
            requestObject.page
        );
        result['authToken'] = req.authToken;
        result['message'] = 'Request updated successfully';
        result['requests'] = requests;
        result['totalPageCount'] = totalPages;
        result['status'] = true;
        res.send(result);
    } catch (err) {
        result['error'] = err.message;
        return res.send(result);
    }
};
module.exports = {
    sendRequests,
    getRequests,
    handleRequests
};
