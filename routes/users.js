const express=require('express');
const authorised=require('../middleware/authorised');
const jwt=require('jsonwebtoken');
const config=require('config');
const _=require('lodash');
const bcrypt=require('bcrypt');
const app=express();
const router=express.Router();
const {validatePassword,User,validateUser}=require('../models/user');
router.get('/me',authorised,async (req,res)=>{
const user=await User.findById(req.user._id).select('-password');
res.send(user);
});
router.post('/',async (req,res)=>{
 const{ error} =validateUser(req.body)  ;
 validatePassword(req.body.password,res);
 if(error) return res.status(400).send(error.details[0].message);
 let user=await  User.findOne({email:req.body.email});
 if(user) res.status(400).send('user already registered');
  user=new User(
_.pick(req.body,'name','email','password')
 );
 const salt=await bcrypt.genSalt(10);
 user.password=await bcrypt.hash(user.password,salt);
 await user.save();
 const token=user.generateAuthToken();
 res.header('x-auth-token',token).send(_.pick(user,'name','email'));
});



module.exports=router;

