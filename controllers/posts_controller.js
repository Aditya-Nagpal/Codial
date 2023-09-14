const Post=require('../models/post');
const Comment=require('../models/comment');
module.exports.create=async function (req,res){
    try {
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        return res.redirect('back');
    } catch (error) {
        console.log("Error in creating a post.",error);
        return;
    }
};

module.exports.destroy=async function (req,res){
    let post =await Post.findById(req.params.id);
    if(post.user == req.user.id){
        await Post.deleteOne({_id : post.id});
        await Comment.deleteMany({post: req.params.id});
        return res.redirect('back');
    } else{
        return res.redirect('back');
    }
};