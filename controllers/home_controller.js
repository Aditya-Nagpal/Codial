const Post=require('../models/post');
const User=require('../models/user');
module.exports.home =async function(req,res){
    Post.find({}).populate('user')
                    .then(function (posts){
                        return res.render('home',{
                            title: "Codial | Home",
                            posts: posts
                        });
                    });
};
