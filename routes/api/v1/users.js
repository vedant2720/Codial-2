const express=require('express');
const userAPI=require('../../../controller/api/v1/users_api');

const router=express.Router();

router.post('/create-session',userAPI.createSession);

module.exports=router;