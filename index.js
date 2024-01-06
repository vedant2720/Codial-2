const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();

const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

// used for session cookie 
const session=require('express-session');
const passport=require('passport');
const passportJWT=require('./config/passport-jwt-strategy');
const passportLocal=require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}));

// setting up the middleware to use cookie 
app.use(express.urlencoded());

// setting to use the cookie
app.use(cookieParser());

const port=8000;

app.use(expressLayouts);
app.set('layout extractStyles',true);
app.set('layout extractScript',true);
app.use(express.static('./assets'));


// setting the views engine
app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookiee in the db
app.use(session({
    name:'codial',
    //TODO change the secret key before deployment.
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        // this age define for how long the cookie is valid  in miliseconds.
        maxAge:(1000*60*1000)
    },
    store: new MongoStore({ 
        // mongooseConnection:db,
        // autoRemove:'disabled'
        mongoUrl:'mongodb://127.0.0.1/codial_development',
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// make the upload path available to the browswer
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(flash());
app.use(customMware.setFlash);

app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err)
    {
        console.log(`Error: ${err}`);
    }

    //adding comment.
    console.log(`Server Running on ${port}`);
});