const express = require('express');
const cors = require('cors');

const AuthRouter = require('./routers/Auth');
const otpRouter = require('./routers/otpRouter');
const requestRouter = require('./routers/Requests');
const companyRouter = require('./routers/Company');
const searchRouter = require('./routers/Search');
const profileRouter = require('./routers/Profile');
const statsRouter = require('./routers/Stats');

const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
console.log('cors enabled for ' + process.env.website_host);
app.use(cors({ credentials: true, origin: process.env.website_host }));
app.use(cookieParser());
app.use(AuthRouter);
app.use(otpRouter);
app.use(requestRouter);
app.use(companyRouter);
app.use(searchRouter);
app.use(profileRouter);
app.use(statsRouter);

app.listen(port, () => {
    console.log('Express up on port:' + port);
});
