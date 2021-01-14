const { Pool } = require('pg');

const pool = new Pool({
	user: process.env.db_username,
	host: process.env.db_host,
	database: process.env.db_database,
	password: process.env.db_password,
	port: process.env.db_port,
	max: process.env.db_max_connections
});

module.exports = pool;