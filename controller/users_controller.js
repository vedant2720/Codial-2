
const User=require('../models/user');

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

module.exports.update = function (req, res) {
    User.findByIdAndUpdate(
        req.params.id, // assuming req.id is the user's ID to be updated
        {
            email: req.body.email,
            name: req.body.name
        }
    )
    .then((user) => {
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.redirect('/users/profile/' + user.id);
    })
    .catch((err) => {
        console.error('Error occurred:', err);
        return res.status(500).send('Internal Server Error');
    });
};
