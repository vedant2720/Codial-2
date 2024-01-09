const nodemailer = require('../config/nodemailer');
// const modeMailer=require('../config/nodemailer');

exports.newComment=(comment)=>{
    
    let htmlString=nodemailer.renderTemplate({comment:comment},'./comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from:'codial@gmail.com',
        to:comment.user.email,
        subject:"New Comment Published",
        html:htmlString
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
