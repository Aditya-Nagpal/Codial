const passport=require('passport');
const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const User=require('../models/user');
const env=require('./environment');

let opts={
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
};

passport.use(new JwtStrategy(opts, function (jwtPayload, done){
    User.findById(jwtPayload._id)
        .then(function (user){
            if(user){
                return done(null, user);
            } else{
                return done(null,false);
            }
        })
        .catch(function (err){
            console.log('Error in finding user from Jwt', err);
            return;
        });
}));

module.exports=passport;
