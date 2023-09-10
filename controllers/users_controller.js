const User=require('../models/user');

module.exports.profile=function (req,res){
    User.findById(req.params.id)
        .then(function (user){
            // can't use key user here because it is already present in locals.
            return res.render('user_profile',{
                title: "User Profile",
                profile_user: user
            });
        });
};

module.exports.update=function (req,res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body)
            .then(function (user){
                return res.redirect('back');
            });
    } else{
        return res.status(401).send('Unauthorized');
    }
}

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

module.exports.destroySession=function (req,res){
    req.logout(function(err){
        if(err){}
    });
    return res.redirect('/');
}