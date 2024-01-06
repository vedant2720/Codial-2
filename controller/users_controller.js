
const User=require('../models/user');

// fs is for accessing folder in my pc 
const fs=require('fs');
const path=require('path');

module.exports.profile=function(req,res)
{
    User.findById(req.params.id)
    .then((user)=>{
        return res.render('user',{
            title:"user profile",
            profile_user:user
        })
    })
    .catch((err) => {
        console.error('Error occurred:', err);
        return res.status(500).send('Internal Server Error');
    });
    
}

module.exports.signUp=function(req,res)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    else{
        res.render('user_sign_up',{
            title:"sign up page"
        })
    }
}

// rendering the sign in page
module.exports.signIn=function(req,res)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_In',{
        title:"sign In page"
    })
}

// get the signup Data
module.exports.create=function(req,res)
{
    if(req.body.password!=req.body.confirm_password)
    {
        return res.redirect('back');
    }

    User.findOne({ email:req.body.email })
    .then((user) => {
    if (!user) {
      // If the user doesn't exist, create a new one
      User.create(req.body);
      return res.redirect('/users/sign-in');
    }
    // If the user already exists, redirect back
        return res.redirect('back');
    })
    .catch((err) => {
        console.error('Error occurred:', err);
        return res.status(500).send('Internal Server Error');
    });
}

// sign in and create session for the user
module.exports.createSession=function(req,res){
    req.flash("success","Logged in Successfully");
    return res.redirect('/');
}

module.exports.destroySession=function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success","Logged Out Successfully");
      res.redirect('/');
    });
  }

// for api purpouse
module.exports.deleteUser=async function(req, res){
    const userId = req.params.id;

    try {
      // Find and delete the user by ID
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports.update =async function (req, res) {
    // User.findByIdAndUpdate(
    //     req.params.id, // assuming req.id is the user's ID to be updated
    //     {
    //         email: req.body.email,
    //         name: req.body.name
    //     }
    // )
    // .then((user) => {
    //     if (!user) {
    //         return res.status(404).send('User not found');
    //     }
    //     return res.redirect('/users/profile/' + user.id);
    // })
    // .catch((err) => {
    //     console.error('Error occurred:', err);
    //     return res.status(500).send('Internal Server Error');
    // });

    try {
        // Check if the authenticated user is the same as the user being updated
        if (req.user.id == req.params.id) {
            // Use await with findById to wait for the query to execute
            let user = await User.findById(req.params.id);

            // Call the uploadedAvatar function
            User.uploadedAvatar(req, res, async function (err) {
                if (err) {
                    console.log("******Multer Error******", err);
                } else {
                    console.log(req.name);
                    console.log(req.file);
                    user.name = req.body.name;
                    user.email = req.body.email;

                    if (req.file) {

                        if( user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar)))
                        {
                            // deleting the avatar
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                            // this is saving path of the uploaded file into the avatar field
                            // in the user
                        }
                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }

                    // Use await with save to wait for the save operation to complete
                    await user.save();
                    return res.redirect('back');
                }
            });
        } else {
            // Handle case where the authenticated user is not the same as the user being updated
            return res.status(403).send("Forbidden: You are not allowed to update this user");
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).send("Internal Server Error");
    }

};

