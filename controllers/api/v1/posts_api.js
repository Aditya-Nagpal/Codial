const Post=require('../../../models/post');
const Comment=require('../../../models/comment');

module.exports.index=async function(req,res){
    let posts=await Post.find({}).populate('user')
        .sort('-createdAt')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes')

    return res.json(200, {
        message: 'List of posts',
        posts: posts
    });
};

module.exports.destroy=async function (req,res){
    try {
        let post =await Post.findById(req.params.id);
        if(post.user == req.user.id){
            await Post.deleteOne({_id : post.id});
            await Comment.deleteMany({post: req.params.id});

            return res.json(200, {
                message: 'Post and associated comments deleted successfully.'
            })
        } else{
            return res.json(401, {
                message: 'You cannot delete this post.'
            });
        }
    } catch (error) {
        console.log('*******',error);
        return res.json(500, {
            message: 'Internal Server Error.'
        });
    }
};