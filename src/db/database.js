const { Pool } = require('pg');
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
	try{
		if(pool){
			return pool;
		}
		pool = new Pool(config);
		return pool;
	}
	catch(err){
		console.log(err);
	}
};

module.exports = {
	getPool
};