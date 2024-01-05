const express=require('express');
const router=express.Router();
const passport=require('passport');

const postController=require('../controller/posts_controller');

// second level of checking for the to post for the user 
router.post('/create',passport.checkAuthentication,postController.create);
router.get('/destroy/:id',passport.checkAuthentication,postController.destroy);

module.exports=router;