const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const config=require('config');
const Joi=require('joi');
const passwordcomplexity=require('joi-password-complexity');
const userschema=new mongoose.Schema({
name:{

    type:String,
    required:true,
    minlength:5,
    maxlength:255
    
},
email:{
    type:String,
    required:true,
    minlength:5,
    maxlength:255,
    unique:true
}
,
password:{
    type:String,
    required:true,
    minlength:5,
    maxlength:1024,
   
    
},
isAdmin:Boolean
});
userschema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
    return token;
}
function validateUser(body){
    const schema={
        name:Joi.string().required(),
        email:Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(body,schema);
}
function validatePassword(password,response){
    return Joi.validate(password,new passwordcomplexity(),(error,value)=>{
        if(error)
        {
            response.status(400).send(error.details[0].message);
        }
    })
}


const User=mongoose.model('users',userschema);
exports.validatePassword=validatePassword;
exports.validateUser=validateUser;
exports.User=User;
