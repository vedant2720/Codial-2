
// creating a worker for emails 
const queue=require('../config/kue');

const commentsMailer=require('../mailers/comments_mailer');

queue.process('emails',function(job,done){
    console.log("email worker is working",job.data);

    commentsMailer.newComment(job.data);

    done();
})

module.exports=queue;
