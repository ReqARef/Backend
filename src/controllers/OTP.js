const { genOTP } = require('../utils/helperFunctions');
const emailSender = require('../utils/emailSender');
const { getResponseObjectTemplate } = require('../utils/helperFunctions');
const db = require('../db/database');

const Pool = db.getPool();

const sendEmailOTP = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    try {
        const { user } = req;
        if (!user || !user.email || !user.first_name)
            throw new Error('Invalid user');
        const OTP = await genOTP(6, user.email);
        const emailObject = {
            type: 'emailVerification',
            OTP,
            toUser: user.first_name,
            to: user.email,
            subject: 'Email verification'
        };
        emailSender(emailObject);
        result['status'] = true;
        result['message'] = 'OTP Sent Successfully';
        res.send(result);
    } catch (err) {
        console.log(err.message);
        result['error'] = err.message;
        return res.send(result);
    }
};

const verifyEmailOTP = async (req, res) => {
    const result = getResponseObjectTemplate(req);
    try {
        const { OTP } = req.body;
        let {
            user: { email }
        } = req;
        if (!email || email === '' || !OTP || OTP == '') {
            throw new Error('Invalid inputs');
        }
        email = email.toLowerCase();
        const checkExistingEmailString = `SELECT first_name FROM USERS WHERE email=
			'${email}';`;
        const checkExistingEmailResult = await Pool.query(
            checkExistingEmailString
        );
        if (checkExistingEmailResult.rows.length == 0) {
            result['error'] = 'Email does not exist';
            return res.send(result);
        }
        const verifyOTPString = `SELECT otp from USERS WHERE email='${email}'`;
        const verifyOTPResult = await Pool.query(verifyOTPString);
        if (verifyOTPResult.rows[0].otp !== OTP) {
            result['error'] = 'Invalid OTP';
            return res.status(400).send(result);
        }
        const updateUserString = `UPDATE USERS SET email_verified=true where email='${email}'`;
        await Pool.query(updateUserString);
        result['status'] = true;
        result['message'] = 'OTP Verified Successfully';
        res.send(result);
    } catch (err) {
        console.log(err.message);
        result.error = err.message;
        return res.send(result);
    }
};

module.exports = {
    sendEmailOTP,
    verifyEmailOTP
};
