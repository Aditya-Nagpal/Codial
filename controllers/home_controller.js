const Post=require('../models/post');
const User=require('../models/user');
module.exports.home = async function(req,res){
    try {
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
        }).populate('likes');

        let users=await User.find({});
        let usersFriendships;
        if (req.user) {
            usersFriendships = await User.findById(req.user._id).populate({
                path: "friendships",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "from_user to_user",
                }
            });
        }

        return res.render('home',{
            title: "Codial | Home",
            posts: posts,
            all_users:  users,
            my_user: usersFriendships
        });
    } catch (error) {
        console.log("Error in routing to home",error);
        return;
    }
};
