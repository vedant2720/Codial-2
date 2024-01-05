const express=require('express');
const router=express.Router();
const passport=require('passport');

const commentController=require('../controller/comments_controller');

// second level of checking for the to post for the user 
router.post('/create',passport.checkAuthentication,commentController.create);
router.get('/destroy/:id',passport.checkAuthentication,commentController.destroy);
module.exports=router;