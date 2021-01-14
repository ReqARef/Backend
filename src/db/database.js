const { Pool } = require('pg');

const pool = new Pool({
	user: 'kanav',
	host: 'localhost',
	database: 'MoneyManager',
	password: '554411',
	port: 5432,
});

module.exports = pool;