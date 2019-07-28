const winston=require('winston');
//require('winston-mongodb');
module.exports=function()
{  
    process.on('uncaughtException',(ex)=>{
        winston.error(ex.message,ex);
       });
   
  process.on('unhandledRejection',(ex)=>{
      throw ex;
  });
  winston.add(winston.transports.File,{filename:'logfile.log'})
//   winston.add(winston.transports.MongoDB,{
//       db:'mongodb://localhost/vds',
//       level:'info'
//    })

}