const { Pool } = require('pg');
let pool = null;

try {
	pool = new Pool({
		user: process.env.db_username,
		host: process.env.db_host,
		database: process.env.db_database,
		password: process.env.db_password,
		port: process.env.db_port,
		max: process.env.db_max_connections,
		ssl: { rejectUnauthorized: false }
	});
} catch(err){
	console.log('Connection to the db failed \n', err.message);
}

module.exports = pool;