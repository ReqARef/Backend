const express = require('express');
const signUpRouter = require('./routers/signUpRouter');

const port = process.env.port || 3000;
const app = express();

app.use(express.json());
app.use(signUpRouter);

app.listen(port, () => {
	console.log('Express up on port:'+port);
});