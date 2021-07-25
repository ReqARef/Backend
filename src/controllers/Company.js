const db = require('../db/database');
const { getResponseObjectTemplate } = require('../utils/helperFunctions');
const Pool = db.getPool();
const Logger = require('../utils/Logger');

const getCompaniesList = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    try {
        const getListString =
            'SELECT DISTINCT C.company_name FROM COMPANIES C, USERS U WHERE \
			U.company_name=C.company_name ORDER BY C.company_name;';
        const getListResult = await Pool.query(getListString);
        result['status'] = true;
        result['data'] = getListResult['rows'];
        result['authToken'] = req['authToken'];
        res.send(result);
    } catch (err) {
        Logger.error(
            `Failed to get companies list for req ${req} and error ${err}`
        );
        result['error'] = err.message;
        return res.send(result);
    }
};

module.exports = {
    getCompaniesList
};
