const { SMTPClient } = require('emailjs');
const { genOTP } = require('../utils/helperFunctions');

const client = new SMTPClient({
	user : process.env.email_username,
	password : process.env.email_password,
	host : process.env.email_host,
	ssl : process.env.email_ssl
});

const getOtp = async (req,res) => {
	const recepient = req.body.email;
	try{
		await client.sendAsync({
			text: 'Your One time password is : ' + genOTP(8),
			from: process.env.email_username,
			to: recepient,
			subject: 'Money Manager'
		});
		res.send('OTP send successfully');
	}
	catch(err){
		return res.send(err);
	}
};

module.exports ={
	getOtp
};