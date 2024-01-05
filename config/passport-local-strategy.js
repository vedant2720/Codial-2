const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User=require('../models/user');
const { response } = require('express');

passport.use(new LocalStrategy(
    {
        usernameField:"email",
        passReqToCallback:true
    },
    function(req,email,password,done){
        // first arr is from user table which we want to match
        // and the second one is email which is passed to match 
        //done is somting that tell success of the event. and it take two argument done(error,authentication status)
        // in done we can set err as null is there is no error 
        // done is callback function reporting to the passport .js

        try {
            User.findOne({ email: email })
                .then((user) => {
                    if (!user || user.password !== password) {
                        req.flash('error',"Invalid Username/Password");
                        console.log("Invalid username/password");
                        return done(null, false);
                    }
                    else{
                        return done(null, user);
                    }
                })
                .catch((err) => {
                    req.flash('error',err);
                    console.log("Error in finding the user");
                    return done(err);
                });
        } catch (error) {
            console.error("Synchronous error:", error);
            return done(error);
        }
    }
));

//serializing the user and deciding which key is to be set in the cookie.
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deseralizing the user from the key in the cookie.
passport.deserializeUser(function(id,done){
    User.findById(id)
    .then((user)=>{
        return done(null,user);
    })
    .catch((err)=>{
        console.log("error in finding the user--->passport")
        return done(err);
    })
});

passport.checkAuthentication=function(req,res,next){

    // if the user is signed in then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user=req.user;
    }

    next();
}

module.exports=passport;