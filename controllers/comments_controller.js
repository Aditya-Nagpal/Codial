const Comment=require('../models/comment');
const Post = require('../models/post');
module.exports.create=function (req,res){
    Post.findById(req.body.post)
        .then(function (post){
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            })  .then(function(comment){
                    post.comments.push(comment);
                    post.save();
                    return res.redirect('/');
                })
                .catch(function (error){
                    console.log("Error in adding comment",error);
                    return;
                });
        })
        .catch(function (err){
            console.log("Error in fetching post",err);
            return;
        });
};