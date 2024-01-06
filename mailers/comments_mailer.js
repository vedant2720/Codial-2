const nodemailer = require('../config/nodemailer');
const modeMailer=require('../config/nodemailer');

exports.newComment=(comment)=>{
    console.log('inside newComment mailer');

    nodemailer.transporter.sendMail({
        from:'vedantdudhale@gmail.com',
        to:comment.user.email,
        subject:"New Comment Published",
        html:'<h1>Yup , your comment is now published</h1>'
    })
    .then((info)=>{
        console.log("message sent",info);
        return;
    })
    .catch((err)=>{
        console.log('Error in sending mail',err);
        return;
    })
}
