const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');



let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    post:587,
    // we are not using two step identification
    secure:false,
    auth: {
        // 500 mails per day 
        user:'vedantdudhale@gmail.com',
        pass:"jqld ooum rxux ygvs"
    }
});

let renderTemplate = (data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log("Error inrendering",err);
                return;
            }
            else{
                mailHTML=template;
            }
        }
    )
    return mailHTML;
}


module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}