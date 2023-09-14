const Comment=require('../models/comment');
const Post = require('../models/post');
module.exports.create=async function (req,res){
    // let post=await Post.findById(req.body.post)
    //     .then(function (post){
    //         let comment=await Comment.create({
    //             content: req.body.content,
    //             user: req.user._id,
    //             post: req.body.post
    //         })  .then(function(comment){
    //                 post.comments.push(comment);
    //                 post.save();
    //                 return res.redirect('/');
    //             })
    //             .catch(function (error){
    //                 console.log("Error in adding comment",error);
    //                 return;
    //             });
    //     })

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
    // Comment.findById(req.params.id)
    //     .then(function (comment){
    //         if(comment.user == req.user.id){
    //             let postId=comment.post;
    //             Comment.deleteOne({_id : comment.id}).then();
    //             Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})
    //                 .then(function (post){
    //                     return res.redirect('back');
    //                 });
    //         } else{
    //             return res.redirect('back');
    //         }
    //     });

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