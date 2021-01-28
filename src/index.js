const express = require('express');
const signUpRouter = require('./routers/signUpRouter');
const loginRouter = require('./routers/loginRouter');
const otpRouter = require('./routers/otpRouter');
const port = process.env.port || 3000;
const app = express();

app.use(express.json());
app.use(signUpRouter);
app.use(loginRouter);
app.use(otpRouter);

app.listen(port, () => {
	console.log('Express up on port:'+port);
});