const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true   
    }
},
{
    //creadted at and updated at this info is obtained by this and mongoose manages this for us.
    timestamps:true
});

const User=mongoose.model('User',userSchema);

module.exports=User;