// module.exports.home=function(req,res){
//     console.log(req.cookies);

//     //we change the value of cookie in the response.
//     res.cookie('user',30);
//     return res.render('home',{
//         title:"Home"
//     })
// }

const Post=require('../models/post');
const User=require('../models/user');

module.exports.home=async function(req,res)
{
   try {
        console.log(req.cookies);
        // populate the user of the each post 
        let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comment',
            populate: {
            path: 'user'
            }
        })
    
        let users= await User.find({})
    
        return res.render('home', {
            title: "Codial | Home",
            posts: posts,
            all_users:users
        });
   }catch (err) {
        console.log(err);
        return;
   }
}