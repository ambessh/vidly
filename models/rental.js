const mongoose=require('mongoose');
const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const rentalSchema=new mongoose.Schema({
    customer:{
        type:new mongoose.Schema({
          name:{
              type:String,
              required:true,
              minlength:5,
              maxlength:255
          },
          isGold:{
              type: Boolean,
              required:true
          },
           phone:{
               type:String,
               required:true,
               min:5,
               max:255
           }
        }),
        required:true
    },
     movie:{
         type:new mongoose.Schema({
         

            title: {
                type: String,
                required: true,
                trim: true, 
                minlength: 5,
                maxlength: 255
              },
              
              numberInStock: { 
                type: Number, 
                required: true,
                min: 0,
                max: 255
              },
              dailyRentalRate: { 
                type: Number, 
                required: true,
                min: 0,
                max: 255
              }
         }),
         required:true
     },
     dateOut:{
         type:Date,
         default:Date.now
         
     },
     dateReturned:{
         type:Date
     },
     fees:{
        type:Number

     }
});

const Rental=mongoose.model('rentals',rentalSchema);

function validates(body){
    const schema={
        customerid:Joi.objectId().min(5).max(255).required(),
        movieid:Joi.objectId().min(5).max(255).required(),
    }
    return Joi.validate(body,schema);
    
}



exports.validates=validates;
exports.rentalSchema=rentalSchema;
exports.Rental=Rental;