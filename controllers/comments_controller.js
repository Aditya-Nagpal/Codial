const Comment=require('../models/comment');
const Post = require('../models/post');
module.exports.create=async function (req,res){
    try {
        let post=await Post.findById(req.body.post);
        let comment=await Comment.create({
            content: req.body.content,
            user: req.user._id,
            post: req.body.post
        });
        post.comments.push(comment);
        post.save();
        return res.redirect('/');
    } catch (error) {
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
            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})
            return res.redirect('back');
        } else{
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error);
    }
};