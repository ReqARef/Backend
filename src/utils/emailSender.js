const { SMTPClient } = require('emailjs');

const client = new SMTPClient({
    user: process.env.email_username,
    password: process.env.email_password,
    host: process.env.email_host,
    ssl: true
});

const checkForNull = (emailContent) => {
    const { to, subject, type } = emailContent;
    if (!to || !subject || !type) {
        return false;
    }
    return true;
};

const sendEmail = async (email) => {
    if (!checkForNull(email)) {
        throw new Error('Email Content object is NULL');
    }
    let content = '';
    switch (email.type) {
        case 'incomingRequest':
            content = `<html> Hi ${email.toUser}, <br> You have received a referral request 
						from ${email.fromUser}. Please respond as soon as possible. <br>
						Thanks and Regards,<br> Team ReqARef</html>`;
            break;
        case 'resetPassword':
            content = `<html> Hi ${email.toUser}, <br> Your OTP is ${email.OTP} <br>
						Thanks and Regards,<br> Team ReqARef</html>`;
            break;
        case 'emailVerification':
            content = `<html> Hi ${email.toUser}, <br> Your email verification OTP is 
				${email.OTP} <br> Thanks and Regards,<br> Team ReqARef</html>`;
            break;
    }
    await client.sendAsync({
        text: content,
        from: process.env.email_username,
        to: email.to,
        subject: email.subject,
        attachment: [{ data: content, alternative: true }]
    });
};

module.exports = sendEmail;
