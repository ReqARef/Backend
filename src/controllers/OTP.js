// const { genOTP } = require('../utils/helperFunctions');
// const emailSender = require('../utils/emailSender');
const {getResponseObjectTemplate} = require('../utils/helperFunctions');

// CAN WE REMOVE THIS OTP THING?

const emailOTP = async (req,res) => {
	const result = getResponseObjectTemplate(req);
	try{
		const recepient = req.body.email;
		if(!recepient) 
			throw new Error('Invalid inputs. Email required');
		// const otp = genOTP(8);
		// await emailSender(otp);
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