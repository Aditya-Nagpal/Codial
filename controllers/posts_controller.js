const Post=require('../models/post');
const Comment=require('../models/comment');
module.exports.create=function (req,res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    })
        .then(function(post){
            return res.redirect('back');
        })
        .catch(function(err){
            console.log("Error in creating a post.",err);
            return;
        });
};

module.exports.destroy=function (req,res){
    Post.findById(req.params.id)
        .then(function(post){
            // .id means converting object id into string.
            if(post.user == req.user.id){
                Post.deleteOne({_id : post.id}).then();
                Comment.deleteMany({post: req.params.id})
                    .then(function (){
                        return res.redirect('back');
                    });
            } else{
                return res.redirect('back');
            }
        });
};