const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: '503612819547-207rrrpqc0j05gm1ik31ajrrfr39netc.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/users/auth/google/callback',
},

function(accessToken, refreshToken, profile, done){
    // find a user
    User.findOne({ email: profile.emails[0].value }).exec()
        .then((user) => {
            if (user) {
                // if found, set this user as req.user
                return done(null, user);
            } else {
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                .then((user)=>{
                    return done(null, user);
                })
                .catch((user)=>{
                    console.log('error in creating user google strategy-passport', err); 
                    return;
                })
            }
        })
        .catch((err) => {
            console.log('error in google strategy-passport', err);
            return done(err);
        });
}));

module.exports = passport;
