const moment=require('moment');
const{Rental}=require('../../models/rental');
const {Movie}=require('../../models/movie');
const mongoose=require('mongoose');
const request=require('supertest');
const{User}=require('../../models/user');
describe('/api/returns',()=>{
    let server;
beforeEach(async()=>{
    server=require('../../index');
    const token= new User().generateAuthToken();
    customerid=mongoose.Types.ObjectId();
        movieid=mongoose.Types.ObjectId();
        const rental=new Rental({
            customer:{
            _id:customerid,
            name:'12345',
            isGold:true,
            phone:'pinchanvee'
            },
            movie:{
            _id:movieid,
            title:'12345',
            dailyRentalRate:5,
            numberInStock:5
            }
            });
            await rental.save();
    
});
afterEach(async()=>{
    await server.close();
    await Rental.remove({}); 
    await Movie.remove({});
});
it('should return 401 when unauthorised',async()=>{
  token='';
const res=await request(server).post('/api/returns/').send({customerid,movieid});
expect(res.status).toBe(401);

});
it('should return 400 if customerId is not provided',async()=>{
   
    token= new User().generateAuthToken();
           
    customerid='';
    const res=await request(server)
    .post('/api/returns/')
    .set('x-auth-token',token)
    .send({customerid,movieid});
    expect(res.status).toBe(400);
    });

    it('should return 400 if movieid is not provided',async()=>{
   
   
         token= new User().generateAuthToken();
movieid='';
const res=await request(server)
.post('/api/returns/')
.set('x-auth-token',token)
.send({customerid,movieid});
expect(res.status).toBe(400);
});


it('should return 404 if no rental found for customer and movie',async()=>{
   
   
    token= new User().generateAuthToken();
    await Rental.remove({});
const res=await request(server)
.post('/api/returns/')
.set('x-auth-token',token)
.send({customerid,movieid});


expect(res.status).toBe(404);
});

it('should return 400 if the rental is already processed',async()=>{
   
    customerid=mongoose.Types.ObjectId();
    movieid=mongoose.Types.ObjectId();
    const rental=new Rental({
        customer:{
        _id:customerid,
        name:'12345',
        isGold:true,
        phone:'pinchanvee'
        },
        movie:{
        _id:movieid,
        title:'12345',
        dailyRentalRate:5,
        numberInStock:5
        }
        });
        await rental.save();
    
 
  token= new User().generateAuthToken();
  rental.dateReturned=new Date();
await rental.save();
const res=await request(server)
.post('/api/returns/')
.set('x-auth-token',token)
.send({customerid,movieid});


expect(res.status).toBe(400);
});

it('should return 200 if have a valid request ',async()=>{
    
    customerid=mongoose.Types.ObjectId();
    movieid=mongoose.Types.ObjectId();
    let rental=new Rental({
        customer:{
        _id:customerid,
        name:'12345',
        isGold:true,
        phone:'pinchanvee'
        },
        movie:{
        _id:movieid,
        title:'12345',
        dailyRentalRate:5,
        numberInStock:5
        }
        });
        await rental.save();
    token= new User().generateAuthToken();
const res=await request(server)
.post('/api/returns/')
.set('x-auth-token',token)
.send({customerid,movieid});
 rental=await Rental.findById(rental._id);
expect(rental).not.toBeNull();
expect(res.status).toBe(200);
});

it('should set rturndate ',async()=>{
    
    customerid=mongoose.Types.ObjectId();
    movieid=mongoose.Types.ObjectId();
    let rental=new Rental({
        customer:{
        _id:customerid,
        name:'12345',
        isGold:true,
        phone:'pinchanvee'
        },
        movie:{
        _id:movieid,
        title:'12345',
        dailyRentalRate:5,
        numberInStock:5
        }
        });
        await rental.save();
    token= new User().generateAuthToken();
const res=await request(server)
.post('/api/returns/')
.set('x-auth-token',token)
.send({customerid,movieid});

 rental=await Rental.findById(rental._id);
 const diff= await new Date()-rental.dateReturned;
expect(diff).toBeLessThan(10*1000);

});

it('should set rentalfee if rental is valid ',async()=>{
    
    customerid=mongoose.Types.ObjectId();
    movieid=mongoose.Types.ObjectId();
    let rental=new Rental({
        customer:{
        _id:customerid,
        name:'12345',
        isGold:true,
        phone:'pinchanvee'
        },
        movie:{
        _id:movieid,
        title:'12345',
        dailyRentalRate:5,
        numberInStock:5
        }
        });
        await rental.save();
    token= new User().generateAuthToken();
rental.dateOut=moment().add(-7,'days').toDate();
await rental.save();

const res=await request(server)
.post('/api/returns/')
.set('x-auth-token',token)
.send({customerid,movieid});

 const rentalInDb=await Rental.findById(rental._id);
 expect(rentalInDb.fees).toBe(35);


});


it('should increment stock ',async()=>{
    
    const customerid=mongoose.Types.ObjectId();
    const movieid=mongoose.Types.ObjectId();
    let rental=new Rental({
        customer:{
        _id:customerid,
        name:'12345',
        isGold:true,
        phone:'pinchanvee'
        },
        movie:{
        _id:movieid,
        title:'12345',
        dailyRentalRate:5,
        numberInStock:10
        }
        });
        await rental.save();

        const movie=new Movie({
        _id:movieid,
            title:'12345',
        genre:{
            name:'12345'
        },
        dailyRentalRate:5,
        numberInStock:10,
        
        });
        await movie.save();

    token= new User().generateAuthToken();

const res=await request(server)
.post('/api/returns/')
.set('x-auth-token',token)
.send({customerid,movieid});

 const movieInDb=await Movie.findById(movieid);
 expect(movieInDb.numberInStock).toBe(movie.numberInStock+1);


});


it('should return rental if input is valid',async()=>{
    const customerid=mongoose.Types.ObjectId();
    const movieid=mongoose.Types.ObjectId();
    let rental=new Rental({
        customer:{
        _id:customerid,
        name:'12345',
        isGold:true,
        phone:'pinchanvee'
        },
        movie:{
        _id:movieid,
        title:'12345',
        dailyRentalRate:5,
        numberInStock:10
        }
        });
        await rental.save();
   
    token= new User().generateAuthToken();
    
const res=await request(server)
.post('/api/returns/')
.set('x-auth-token',token)
.send({customerid,movieid});

const rentalInDb=await Rental.findById(rental._id);
expect(res.body).toHaveProperty('dateOut');
});
});