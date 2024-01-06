
const Post=require("../../../models/post");
const Comment=require("../../../models/comment");

module.exports.profile =async function (req, res) {

    let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comment',
            populate: {
            path: 'user'
            }
        });

    return res.json(200, {
        message: "List of Posts",
        post:posts
    });
};

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);

        if(post.user==req.user.id){
            // console.log(post.user);
            await post.deleteOne(); // or post.deleteMany() if needed

            await Comment.deleteMany({ post: req.params.id });

            return res.json(200, {
                message: "Post deleted successfully"
            });
        }
        else{
            if (!post) {
                return res.status(404).json({
                    message: "Post not found"
                });
            }
            else{
                return res.status(401).json({
                    message: "You cannot delete this post"
                });
            }
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
