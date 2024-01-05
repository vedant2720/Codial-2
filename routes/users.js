const express=require('express');

const router=express.Router();

const userController=require('../controller/users_controller');

const passport=require('passport');

router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.get('/sign-in',userController.signIn);
router.get('/sign-up',userController.signUp);
router.post('/create',userController.create);

// use passport as middleware to authenticate 
router.post('/create-session', passport.authenticate(
    'local', 
    {failureRedirect: '/users/sign-in'},
), userController.createSession);


router.get('/sign-out',userController.destroySession);
router.post('/update/:id',userController.update);

module.exports=router;