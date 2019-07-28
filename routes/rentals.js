const mongoose=require('mongoose');
const Fawn=require('fawn');
Fawn.init(mongoose);
const express=require('express');
const Joi=require('joi');
const authorised=require('../middleware/authorised');
const {validates,Rental}=require('../models/rental');
const {Customer}=require('../models/customer');
const {Movie}=require('../models/movie');
const router=express.Router();
router.post('/',authorised,async(req,res)=>{
const {error}=validates(req.body);
if(error) return res.status(400).send(error.details[0].message);
const customer=await Customer.findById({_id:req.body.customerid});
if(!customer) return res.status(404).send('customer not found');
const movie=await Movie.findById({_id:req.body.movieid});
if(!movie) return res.status(404).send('movie not found');
if(movie.numberInStock===0) return res.status(400).send('movies out of stock');
const rental= new Rental({
customer:{
    name:customer.name,
    isGold:customer.isGold,
    phone:customer.phone
},
movie:{
    title:movie.title,
    numberInStock:movie.numberInStock,
    dailyRentalRate:movie.dailyRentalRate
}
  
});
try{
new Fawn.Task()
.save('rentals',rental)
.update('movies',{_id:movie._id},{$inc:{
    numberInStock:-1
}})
.run();
res.send(rental);
}catch(ex){
    console.log('rollback kro');
}
});

module.exports=router;