const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=async function(req,res){
    try {
        
        let post=await Post.findById(req.body.post)
        
        let comment= await Comment.create({
            content:req.body.content,
            post:req.body.post,
            user:req.user._id
        })
        
        post.comment = post.comment || [];
            
        // Now you can safely push the comment and save
        post.comment.push(comment);
        post.save();

        req.flash('success', 'Comment Added!');
        return res.redirect('/');
    } catch (err) {
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




