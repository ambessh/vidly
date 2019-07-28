const express=require('express');
const Joi=require('joi');
const config=require('config');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const app=express();
const {User}=require('../models/user');
const router=express.Router();
router.post('/',async(req,res)=>{
const {error}=validate(req.body);
if(error) return res.status(400).send(error.details[0].message);
const user=await User.findOne({email:req.body.email});
if(!user) return res.status(400).send('email id is wrong');
const validatingPassword=await bcrypt.compare(req.body.password,user.password);
if(!validatingPassword) return res.status(400).send('password is wrong');
const token=user.generateAuthToken();
res.send(token);
});


function validate(body){
    const schema={
        email:Joi.string().min(5).max(255).required(),
        password:Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(body,schema);
}

module.exports=router;