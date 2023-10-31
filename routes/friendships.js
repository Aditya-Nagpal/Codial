const express=require('express');
const router=express.Router();
const friendshipsController=require('../controllers/friendships_controller');

router.post('/add',friendshipsController.addFriend);
router.post('/remove',friendshipsController.removeFriend);

module.exports=router;