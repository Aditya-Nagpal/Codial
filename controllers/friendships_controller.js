const User=require('../models/user');
const Friendship=require('../models/friendship');

module.exports.addFriend=async function(req,res){
    try {
        let from_user=await User.findById(req.query.from_user).populate('friendships');
        let to_user=await User.findById(req.query.to_user).populate('friendships');
        let friendship=await Friendship.create({from_user: from_user, to_user: to_user});
        from_user.friendships.push(friendship);
        await from_user.save();
        return res.redirect('back');
    } catch (error) {
        req.flash('error', error);
        console.log('Unable to add friend', error);
        return;
    }
};

module.exports.removeFriend=async function(req,res){
    try {
        let from_user=await User.findById(req.query.from_user).populate('friendships');
        let to_user=await User.findById(req.query.to_user).populate('friendships');
        let friendship=await Friendship.findOne({from_user: from_user,to_user: to_user});
        await Friendship.findByIdAndDelete(friendship._id);
        for(let index in from_user.friendships){
            if(from_user.friendships[index].to_user._id.toJSON() === friendship.to_user._id.toJSON()){
                from_user.friendships.splice(index,1);
                await from_user.save();
                break;
            }
        }
        return res.redirect('back');
    } catch (error) {
        console.log('Error in removing friend',error);
        return;
    }
};