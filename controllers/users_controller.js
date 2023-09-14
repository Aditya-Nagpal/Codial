const User=require('../models/user');

module.exports.profile=async function (req,res){
    let user=await User.findById(req.params.id);
    return res.render('user_profile',{
        title: "User Profile",
        profile_user: user
    });
};

module.exports.update=async function (req,res){
    try {
        if(req.user.id == req.params.id){
            await User.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect('/');
        } else{
            return res.status(401).send('Unauthorized');
        }
    } catch (error) {
        console.log(error);
    }
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

module.exports.create=async function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    try {
        let user=await User.findOne({email: req.body.email});
        if(!user){
            try {
                await User.create(req.body);
                return res.redirect('/users/sign-in');
            } catch (error) {
                console.log("Error in creating user while signing up.", error);
                return;
            }
        }
        else{
            return res.redirect('back');
        }
    } catch (error) {
        console.log("Error in finding user in signing up.",error);
        return;
    }
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