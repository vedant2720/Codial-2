const Comment=require('../models/comment');
const Post=require('../models/post');
const commentsMailer=require("../mailers/comments_mailer");
const queue=require('../config/kue');
const commentEmailWorker=require('../workers/comment_email_worker');



module.exports.create=async function(req,res){
    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comment.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email avatar');

            // Similar for comments to fetch the user's id!
            // comment = await comment.populate('user', 'name email').execPopulate();  

            commentsMailer.newComment(comment); 
            // -----> this line inside comment_email_Worker.js work when job = queue.done().create()

            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('Error in sending to the queue', err);
                    return;
                }
                console.log('job enqueued', job.id);
            });
            
            // commentsMailer.newComment(comment);


            // if (request.xhr){
            //     return respond.status(200).json({
            //         data: {
            //             comment: comment
            //         },
            //         message: "Comment created!"
            //     });
            // }

            req.flash('success', 'Comment published!');
            return res.redirect('/');
        }
    }
    catch (err) {
        console.log(err);
        return console.log("error while creating the comment");
    }
}



module.exports.destroy=async function(req,res){
    try {
        let comment=await Comment.findOneAndDelete({ _id: req.params.id});

        if(!comment){
            return res.status(404).send("Post not found");
        }
        const postId=comment.post;
        let post=await Post.findByIdAndUpdate(postId,{$pull:{comment:req.params.id}});
        req.flash('success', 'Comment deleted');
        return res.redirect('back');
    } catch (error) {
        console.log(err);
        return console.log("error while destrying the comment");
    }
}




