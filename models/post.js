const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    // including the array of ids all the comments in this post schema 
    // reason we are doing this boz of the faster access of the specific comment
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
},{
    timestamps:true
});

const Post=mongoose.model('Post',postSchema);

module.exports=Post;