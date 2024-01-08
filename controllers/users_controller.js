const User=require('../models/user');
const ResetPasswordToken=require('../models/resetpasswordtoken');
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const queue=require('../config/kue');
const resetLinkMailWorker=require('../workers/reset_link_mail_worker');
const signUpMailWorker=require('../workers/signup_mail_worker');

module.exports.profile=async function (req,res){
    let user=await User.findById(req.params.id);
    req.user=await req.user.populate({
        path: "friendships",
        options: { sort: { createdAt: -1 } },
        populate: {
            path: "from_user to_user",
        }
    });
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
                    if(user.avatar){
                        if(fs.statSync(__dirname, '..',user.avatar).isFile()){
                            fs.unlinkSync(path.join(__dirname, '..',user.avatar));
                        }
                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar=User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back');
            });
        } catch (error) {
            console.log(err);
            return;
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
        title: "Sign Up"
    });
};

module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    } 
    return res.render('user_sign_in',{
        title: "Sign In"
    });
};

module.exports.create=async function(req,res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error',"Passwords don't match");
        return res.redirect('back');
    }
    try {
        let user=await User.findOne({email: req.body.email});
        if(!user){
            try {
                user=await User.create(req.body);
                let job=queue.create('signup-emails',user).save(function(err){
                    if(err){
                        console.log('Error in sending to the queue', err);
                        return;
                    }
                    console.log('job enqueued', job.id);
                });
                return res.redirect('/users/sign-in');
            } catch (error) {
                console.log("Error in creating user while signing up.", error);
                return;
            }
        }
        else{
            req.flash('error','User already exists.');
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

module.exports.getResetEmail=function (req,res){
    return res.render('reset_email', {
        title: 'Codial | Enter Reset Email'
    });
};

module.exports.sendResetMail=async function (req,res){
    try {
        req.flash('success','Reset mail sent successfully!');
        let user=await User.findOne({email: req.body.reset_mail});
        if(user){
            let resetToken=await ResetPasswordToken.create({
                user: user,
                accessToken: crypto.randomBytes(10).toString('hex'),
                isValid: true
            });
            let job=queue.create('reset-link-emails', resetToken).save(function (err){
                if(err){
                    console.log('Error in sending to queue',err);
                    return;
                }
                console.log('Job enqueued',job.id);
            });
            return res.redirect('/users/sign-in');
        }
    } catch (error) {
        req.flash('error',error);
        console.log('Error in sending reset mail',error);
        return;
    }
};

module.exports.resetForm=async function (req,res){
    let resetToken=await ResetPasswordToken.findOne({accessToken: req.params.accessToken});
    return res.render('reset_form', {
        title: 'Codial | Reset password form',
        resetToken: resetToken
    });
};

module.exports.resetPassword=async function (req,res){
    let resetToken=await ResetPasswordToken.findOne({accessToken: req.params.accessToken});
    let user=await User.findById(resetToken.user.toJSON());
    if(req.body.new_password == req.body.confirm_new_password){
        user=await User.findByIdAndUpdate(user._id, {password: req.body.new_password});
        resetToken=await ResetPasswordToken.findOneAndUpdate({accessToken: req.params.accessToken},{isValid: false});
        req.flash('success', 'Password updated successfully!');
        return res.redirect('back');
    } else{
        req.flash('error', "Passwords don't match. Try again.");
        return res.redirect('back');
    }
};