const sgMail = require('@sendgrid/mail')

//sgMail.setApiKey('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')
sgMail.setApiKey('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')

// boda.010003@gmail.com
// mohamedhussein8465@gmail.com

const sendPasswordVerificationCode = (email, firstName, type, verificationCode)=>{
    console.log(email, firstName, type, verificationCode)
    sgMail.send({
        to: email,
        from: 'youssefrashad119@gmail.com',
        subject: 'Forget Password!',
        text: `Hello ${firstName}, ur verification code is  ${verificationCode}`
    })
}


module.exports = {
    sendPasswordVerificationCode
}