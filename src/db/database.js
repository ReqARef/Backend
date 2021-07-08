const { Pool } = require('pg');
const Logger = require('../utils/Logger');

let pool = null;
var config = {
    user: process.env.db_username,
    host: process.env.db_host,
    database: process.env.db_database,
    password: process.env.db_password,
    port: process.env.db_port,
    max: process.env.db_max_connections,
    ssl: { rejectUnauthorized: false }
};

const getPool = () => {
    try {
        if (pool) {
            return pool;
        }
        pool = new Pool(config);
        return pool;
    } catch (err) {
        Logger.error(`Connecting to database failed with exception ${err}`);
    }
};

module.exports = {
    getPool
};
