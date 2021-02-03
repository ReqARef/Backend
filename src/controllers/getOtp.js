const { SMTPClient } = require('emailjs');
const { genOTP } = require('../utils/helperFunctions');

const client = new SMTPClient({
	user : process.env.email_username,
	password : process.env.email_password,
	host : process.env.email_host,
	ssl : true
});
const result ={status : false};
const getOtp = async (req,res) => {
	const recepient = req.body.email;
	try{
		await client.sendAsync({
			text: 'Your One time password is : ' + genOTP(8),
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
		return res.send(err);
	}
};

module.exports ={
	getOtp
};