const authorised=require('../middleware/authorised');
const express=require('express');
const router=express.Router();
const {Rental}=require('../models/rental');
const {Movie}=require('../models/movie');
const moment=require('moment');
router.post('/',authorised,async(req,res)=>{
    if(!req.body.customerid) return res.status(400).send('customer id not proided');
    if(!req.body.movieid) return res.status(400).send('movieid is not provided');
    const rental =await Rental.findOne({
        'customer._id':req.body.customerid,
        'movie._id':req.body.movieid
    });
    if(!rental)return res.status(404).send('no rental is found');
     if(rental.dateReturned) return res.status(400).send('rental already processes');
     rental.dateReturned=new Date();
     rental.fees=moment().diff(rental.dateOut,'days')*rental.movie.dailyRentalRate;
await rental.save();
     await Movie.update({_id:rental.movie._id},{$inc:{
          numberInStock:1
      }});
      return res.status(200).send(rental);
    
   
});
module.exports=router;