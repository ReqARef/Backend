const express = require('express');
const cors = require('cors');
const AuthRouter = require('./routers/Auth');
<<<<<<< HEAD
const otpRouter = require('./routers/otpRouter');
const requestRouter = require('./routers/requestRouter');
=======
const otpRouter = require('./routers/OTPRouter');
const requestRouter = require('./routers/RequestRouter');
const companyRouter = require('./routers/Company');
>>>>>>> 0f14f58ee7ee99e5667efd7c916232a92e343c55
const port = process.env.port || 3000;
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cors({credentials: true, origin: process.env.website_host}));
app.use(cookieParser());

app.use(AuthRouter);
app.use(otpRouter);
app.use(requestRouter);
app.use(companyRouter);

app.listen(port, () => {
	console.log('Express up on port:'+port);
});