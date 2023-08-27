const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/user');

// authenication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email,password,done){
        // find a user and establish the identity
        User.findOne({email: email})
            .then(function(user){
                if(!user || !user.password){
                    console.log("Invalid Username/Password");
                    return done(null,false);
                }
                return done(null,user);
            })
            .catch(function(err){
                console.log("Error in finding user ---> Passport.");
                return done(err);
            })
    }
));

// serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id)
        .then(function(user){
            return done(null,user);
        })
        .catch(function(err){
            console.log('Error in finding user ---> Passport');
            return done(err);
        })
});

// check if user is authenticated
passport.checkAuthentication=function(req,res,next){
    // if user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    // req.User contains the currect signed in user from the session cookie and we are sending it to the locals for the views
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;

