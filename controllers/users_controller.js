const User=require('../models/user');

module.exports.profile=function (req,res){
    return res.render('user_profile',{
        title: "User Profile"
    });
};

module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title: "Codial | Sign Up"
    });
};

module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: "Codial | Sign In"
    });
};

module.exports.create=function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}).then(function (err,user){
        if(err){
            console.log("Error in finding user in signing up.",err);
            return;
        }
        if(!user){
            try {
                User.create(req.body);
                return res.redirect('/users/sign-in');
            } catch (error) {
                console.log("Error in creating user while signing up.");
                return;
            }
        }
        else{
            return res.redirect('back');
        }
    });
   
};

module.exports.createSession=function (req,res){
    return res.redirect('/');
};