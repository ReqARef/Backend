const {
    findUser,
    checkEmailAndPasswordForNull,
    checkUserObjectForNull
} = require('../utils/helperFunctions');
const {
    generateNewAndSaveRefreshToken,
    generateAccessToken,
    generateRefreshToken
} = require('../utils/AuthHelper');
const { genOTP } = require('../utils/helperFunctions');
const emailSender = require('../utils/emailSender');
const { ONE_MONTH_MS } = require('../utils/constants');
const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Pool = db.getPool();

const login = async (req, res) => {
    const result = { status: false };
    const userCred = req.body;
    try {
        if (!checkEmailAndPasswordForNull(userCred)) {
            throw new Error('Invalid Inputs');
        }
        const user = await findUser(userCred);
        const isMatch = await bcrypt.compare(userCred.password, user.password);
        if (!isMatch) {
            throw new Error('Password Mismatch');
        }
        var newRefreshToken = null;
        if (user.refresh_token) {
            newRefreshToken = user.refresh_token;
            try {
                jwt.verify(user.refresh_token, process.env.refresh_jwt_secret);
            } catch (err) {
                newRefreshToken = await generateNewAndSaveRefreshToken(
                    user.email
                );
            }
        } else {
            newRefreshToken = await generateNewAndSaveRefreshToken(user.email);
        }
        if (user['password']) {
            delete user['password'];
        }
        result['status'] = true;
        result['message'] = 'Login Successful';
        result['user'] = user;
        result['authToken'] = generateAccessToken(user.email);
        res.cookie('refreshToken', newRefreshToken, {
            maxAge: ONE_MONTH_MS,
            httpOnly: true
        });
        res.send(result);
    } catch (err) {
        result['error'] = err.message;
        return res.send(result);
    }
};

const signUp = async (req, res) => {
    const result = { status: false };
    try {
        const userObject = req.body;
        if (!checkUserObjectForNull(userObject)) {
            throw new Error('Invalid inputs');
        }
        userObject.email = userObject.email.toLowerCase();
        const checkExistingEmailString = `SELECT email FROM USERS WHERE email=
			'${userObject.email}';`;
        const checkExistingEmailResult = await Pool.query(
            checkExistingEmailString
        );
        if (checkExistingEmailResult.rows.length > 0) {
            result['error'] = 'Email already exist';
            return res.send(result);
        }
        userObject.password = await bcrypt.hash(
            userObject.password,
            parseInt(process.env.bcrypt_rounds)
        );
        const refreshToken = generateRefreshToken(userObject.email);
        const authToken = generateAccessToken(userObject.email);
        const insertRowString = `INSERT INTO USERS(email,first_name,last_name,password,role
			,refresh_token) VALUES('${userObject.email}','${userObject.firstName}',
			'${userObject.lastName}','${userObject.password}', '${userObject.role}', '${refreshToken}');`;
        await Pool.query(insertRowString);
        result['status'] = true;
        result['message'] = 'User Added Successfully';
        delete userObject['password'];
        result['user'] = userObject;
        result['authToken'] = authToken;
        res.cookie('refreshToken', refreshToken, {
            maxAge: ONE_MONTH_MS,
            httpOnly: true
        });
        res.send(result);
    } catch (err) {
        result.error = err.message;
        return res.send(result);
    }
};

const sendForgotPasswordOTP = async (req, res) => {
    const result = { status: false };
    try {
        let { email } = req.body;
        if (!email || email === '') {
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
        const OTP = await genOTP(6, email);
        const emailObject = {
            type: 'resetPassword',
            OTP,
            toUser: checkExistingEmailResult.rows[0].first_name,
            to: email,
            subject: 'Password Reset'
        };
        emailSender(emailObject);
        result['status'] = true;
        result['message'] = 'OTP Sent Successfully';
        res.send(result);
    } catch (err) {
        result.error = err.message;
        return res.send(result);
    }
};

const updatePassword = async (req, res) => {
    const result = { status: false };
    try {
        let { email, password } = req.body;
        if (!email || email === '' || !password || password == '') {
            throw new Error('Invalid inputs');
        }
        email = email.toLowerCase();
        const checkExistingEmailString = `SELECT * FROM USERS WHERE email=
			'${email}';`;
        const checkExistingEmailResult = await Pool.query(
            checkExistingEmailString
        );
        if (checkExistingEmailResult.rows.length == 0) {
            result['error'] = 'Email does not exist';
            return res.send(result);
        }
        const userObject = checkExistingEmailResult.rows[0];
        const encryptedPassword = await bcrypt.hash(
            password,
            parseInt(process.env.bcrypt_rounds)
        );
        const updatePasswordString = `UPDATE USERS SET password='${encryptedPassword}' 
			WHERE email='${email}'`;
        await Pool.query(updatePasswordString);
        const refreshToken = generateRefreshToken(email);
        const authToken = generateAccessToken(email);
        result['status'] = true;
        result['message'] = 'Password Changed Successfully';
        delete userObject['password'];
        result['user'] = userObject;
        result['authToken'] = authToken;
        res.cookie('refreshToken', refreshToken, {
            maxAge: ONE_MONTH_MS,
            httpOnly: true
        });
        res.send(result);
    } catch (err) {
        result.error = err.message;
        return res.send(result);
    }
};

const verifyOTP = async (req, res) => {
    const result = { status: false };
    try {
        let { email, OTP } = req.body;
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
        result['status'] = true;
        result['message'] = 'OTP Verified Successfully';
        res.send(result);
    } catch (err) {
        result.error = err.message;
        return res.send(result);
    }
};

module.exports = {
    login,
    signUp,
    sendForgotPasswordOTP,
    updatePassword,
    verifyOTP
};
