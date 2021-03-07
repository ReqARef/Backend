const { SMTPClient } = require('emailjs');
const { genOTP } = require('../utils/helperFunctions');

const client = new SMTPClient({
	user : process.env.email_username,
	password : process.env.email_password,
	host : process.env.email_host,
	ssl : true
});

const emailOTP = async (req,res) => {
	const result ={status : false};
	try{
		const recepient = req.body.email;
		if(!recepient) 
			throw new Error('Invalid inputs. Email required');
		const otp = genOTP(8);
		await client.sendAsync({
			text: 'Your One time password is : ' + otp,
			from: process.env.email_username,
			to: recepient,
			subject: 'ReqARef'
		});
		result['status'] = true;
		result['message'] = 'OTP sent Successfully';
		res.send(result);
	}
	catch(err){
		console.log(err);
		result['error'] = err.message;
		return res.send(result);
	}
};

const phoneOTP = async (req,res) => {
	res.send(req);
};

module.exports ={
	emailOTP,
	phoneOTP
};