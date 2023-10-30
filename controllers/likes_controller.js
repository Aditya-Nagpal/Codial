const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.toggleLikes=async function (req,res){
    try {
        let likeable;
        let deleted=false;
        if(req.query.type == "Post"){
            likeable=await Post.findById(req.query.id).populate('likes');
        } else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }

        // check if a like already exists
        let existingLike=await Like.findOne({user: req.user._id, likeable: req.query.id, onModel: req.query.type});

        // if a like already exists then delete it else make a new like
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            await Like.deleteOne({likeable: req.query.id});
            deleted=true;
        } else{
            let newLike=await Like.create({user: req.user._id, likeable: req.query.id, onModel: req.query.type});
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.json(200, {
            message: 'request successful',
            data: {
                deleted: deleted
            }
        });
    } catch (error) {
        console.log(error);
        return res.json(500, {
            message: 'Internal server error'
        });
    }
};