const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJwt=require('./config/passport-jwt-strategy');
const MongoStore=require('connect-mongo')(session);
const flash=require('connect-flash');
const customMware=require('./config/middleware');
const port=9000;

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));
// make the uploads path available to the browser.
app.use('/uploads',express.static(__dirname + '/uploads'));
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
    },
    store: new MongoStore({
            mongooseConnection: db,
            autoRemove: 'disabled'
    },function (err){
        console.log(err || 'connect-mongodb setup ok.');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router.
app.use('/',require('./routes/index'));

app.listen(port,function (err){
    if(err){
        console.log(`Error in connecting to server ${err}`);
        return;
    }
    console.log(`Server connected successfully ${port}`);
});