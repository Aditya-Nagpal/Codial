const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const Secrets=require('../secrets');

// tell passport to use a new strategy for google login.
passport.use(new googleStrategy({
        clientID: Secrets.clientID,
        clientSecret: Secrets.clientSecret,
        callbackURL: Secrets.callbackURL
    }, function(accessToken, refresToken, profile,done){
        // find a user.
        User.findOne({email: profile.emails[0].value}).exec()
            .then(function(user){
                if(user){
                    // if found set this user as req.user
                    return done(null,user);
                }
                else{
                    // if not found, create user and set it as req.user
                    User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex')
                    })
                        .then(function(user){
                            return done(null,user);
                        })
                        .catch(function (err){
                            console.log('Error in creating user google Strategy-passport',err);
                            return;
                        });
                    
                }
            })
            .catch(function(err){
                console.log('Error in google Strategy-passport',err);
                return;
            });
    }
));


