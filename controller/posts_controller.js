
const Post=require('../models/post');
const Comment=require('../models/comment');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        // req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}

module.exports.destroy = async function(req, res) {
   try {
        let post=await Post.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    
        if (!post) {
            return res.status(404).send("Post not found");
        }

        await Comment.deleteMany({ post: req.params.id });
        req.flash('success', 'Post and associated comments deleted!');
        return res.redirect('/');
   } catch (err){
        console.error("Error in deleting the post:", err);
        return res.status(500).send("Internal Server Error");
   }
};
