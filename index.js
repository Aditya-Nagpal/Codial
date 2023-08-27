const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const port=9000;

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name: 'codial',
    secret: 'random',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// use express router.
app.use('/',require('./routes/index'));

app.listen(port,function (err){
    if(err){
        console.log(`Error in connecting to server ${err}`);
        return;
    }
    console.log(`Server connected successfully ${port}`);
});