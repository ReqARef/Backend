const express = require('express');
const cors = require('cors');
const signUpRouter = require('./routers/signUpRouter');
const loginRouter = require('./routers/loginRouter');
const otpRouter = require('./routers/otpRouter');
const requestRouter = require('./routers/requestRouter');
const port = process.env.port || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(signUpRouter);
app.use(loginRouter);
app.use(otpRouter);
app.use(requestRouter);

app.listen(port, () => {
	console.log('Express up on port:'+port);
});