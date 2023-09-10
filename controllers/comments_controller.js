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

module.exports.destroy=function (req,res){
    Comment.findById(req.params.id)
        .then(function (comment){
            if(comment.user == req.user.id){
                let postId=comment.post;
                Comment.deleteOne({_id : comment.id}).then();
                Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})
                    .then(function (post){
                        return res.redirect('back');
                    });
            } else{
                return res.redirect('back');
            }
        });
};