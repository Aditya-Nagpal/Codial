const Comment=require('../models/comment');
const Post = require('../models/post');
module.exports.create=async function (req,res){
    try {
        let post=await Post.findById(req.body.post);
        if(post){
            let comment=await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });
            post.comments.push(comment);
            post.save();
            if(req.xhr){
                comment=await comment.populate('user','name');
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Created"
                });
            }
            req.flash('success','Comment published!');
            return res.redirect('/');
        }
    } catch (error) {
        req.flash('error',error);
        console.log("Error in fetching post",error);
        return;
    }
};

module.exports.destroy=async function (req,res){
    try {
        let comment=await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId=comment.post;
            await Comment.deleteOne({_id : comment.id});
            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment Deleted"
                })
            }
            req.flash('success','Comment deleted!');
            return res.redirect('back');
        } else{
            req.flash('error','Unauthorized.')
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error',error);
        console.log(error);
        return;
    }
};