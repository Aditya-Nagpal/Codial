const User=require('../models/user');
const Friendship=require('../models/friendship');

module.exports.addFriend=async function(req,res){
    try {
        let from_user=await User.findById(req.query.from_user);
        let to_user=await User.findById(req.query.to_user);
        let friendship=await Friendship.create({from_user: from_user, to_user: to_user});
        // from_user=await from_user.populate('friendship');
        if(from_user && to_user){
            console.log('friendship is :',friendship);
            from_user.friendships.push(friendship);
            from_user.save();
            console.log(from_user.friendships);
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error', error);
        console.log('Unable to add friend', error);
        return;
    }
};

module.exports.removeFriend=async function(req,res){
    try {
        
    } catch (error) {
        
    }
};