const express = require('express');
const cors = require('cors');
const AuthRouter = require('./routers/Auth');
const otpRouter = require('./routers/otpRouter');
const requestRouter = require('./routers/requestRouter');
const companyRouter = require('./routers/Company');
const searchRouter = require('./routers/Search');
const profileRouter = require('./routers/Profile');
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
app.use(searchRouter);
app.use(profileRouter);

app.listen(port, () => {
	console.log('Express up on port:'+port);
});