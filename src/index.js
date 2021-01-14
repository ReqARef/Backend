const express = require('express');
// Import routers
// const router = require('./routers/example')
const Pool = require('./db/database');

const port = process.env.port || 3000;

const makeQuery = async () => {
	const res = await Pool.query('SELECT * from test');
	console.log('\n', res);
};

makeQuery();

const app = express();
app.use(express.json());
// Link routers
// app.use(example)


app.listen(port, () => {
	console.log('Express up on port:'+port);
});