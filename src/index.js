import express, { json } from 'express';
// Import routers
// const router = require('./routers/example')
import { query } from './db/database';

const makeQuery = async () => {
	const res = await query('SELECT * from test');
	console.log('\n', res);
};

makeQuery();

const app = express();
app.use(json());
// Link routers
// app.use(example)


app.listen(3000, () => {
	console.log('Express up on port:'+3000);
});