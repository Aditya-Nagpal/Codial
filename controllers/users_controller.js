const User=require('../models/user');

module.exports.profile=async function (req,res){
    let user=await User.findById(req.params.id);
    return res.render('user_profile',{
        title: "User Profile",
        profile_user: user
    });
};

module.exports.update=async function (req,res){
    if(req.user.id == req.params.id){
        try {
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("******Multer Error: ",err);
                }
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar=User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back');
            })
        } catch (error) {
            
        }
    } else{
        req.flash('error','Unauthorized!');
        return res.status(401).send('Unauthorized');
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
        console.log("Reached here.");
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
    req.flash('success','Logged in successfully.');
    return res.redirect('/');
};

module.exports.destroySession=function (req,res){
    req.flash('success','You have logged out.');
    req.logout(function(err){});
    return res.redirect('/');
};