const db = require('../db/database');
const Pool = db.getPool();
const { getResponseObjectTemplate } = require('../utils/helperFunctions');
const Logger = require('../utils/Logger');

const stats = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    try {
        if (!req.user.email) {
            throw new Error('User Email is null');
        }
        let userEmail = req.user.email;
        const userRole = req.user.role;
        const stats = {
            pendingRequests: 0,
            rejectedRequests: 0,
            acceptedRequests: 0,
            requestCount: 0
        };
        const requestSearchString = `SELECT x.referral_status, COUNT(*) from \
		(SELECT * FROM REQUESTS WHERE request_${
            userRole == 0 ? 'from' : 'to'
        }='${userEmail}') \
		As x GROUP BY x.referral_status;`;
        const requestSearchResult = await Pool.query(requestSearchString);

        for (let i = 0; i < requestSearchResult.rows.length; i++) {
            const object = requestSearchResult.rows[i];
            if (object.referral_status === 0) {
                stats.pendingRequests = parseInt(object.count);
            } else if (object.referral_status === 1) {
                stats.acceptedRequests = parseInt(object.count);
            } else if (object.referral_status === -1) {
                stats.rejectedRequests = parseInt(object.count);
            }
        }
        stats.requestCount =
            stats.acceptedRequests +
            stats.pendingRequests +
            stats.rejectedRequests;

        result['stats'] = stats;
        result['status'] = true;
        result['authToken'] = req['authToken'];
        return res.send(result);
    } catch (err) {
        Logger.error(`Failed to get stats for req ${req} and error ${err}`);
        result['error'] = err.message;
        if (result && result['user']) delete result['user'];
        return res.send(result);
    }
};

module.exports = stats;
