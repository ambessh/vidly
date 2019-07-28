const winston=require('winston');
const config=require('config');
module.exports=function(){
    const mongoose = require('mongoose');
    mongoose.connect(config.get('db'),{useNewUrlParser:true,useCreateIndex:true})
    .then(() => winston.info(`Connected to MongoDB... ${config.get('db')}`))
   
  
};