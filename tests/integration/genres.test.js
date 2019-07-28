const mongoose=require('mongoose');
const {Genre}=require('../../models/genre');
const {User}=require('../../models/user');
const request=require('supertest');
let server;
describe('/api/genres',()=>{
    beforeEach(()=>{server=require('../../index');})
    afterEach(async()=>{ await server.close();
    await Genre.remove({});
    })
    describe('GET /',()=>{
        it('should return all the genres',async()=>{
               Genre.collection.insertMany([
                   {name:'genre1'},
                   {name:'genre2'}
               ]);
              
              const res=await request(server).get('/api/genres');
              expect(res.body.some(g=>g.name==='genre1')).toBeTruthy();
              expect(res.body.some(g=>g.name==='genre2')).toBeTruthy();
              
        });
    });
    describe('GET /:id',()=>{
      it('should return genre with a valid id',async()=>{
         const genre=new Genre({name:'genre1'});
         await genre.save();
         const res=await request(server).get('/api/genres/'+genre._id);
         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty('name',genre.name);
      });
      it('should return 404 when genre with given id is not found',async()=>{
       
        const res=await request(server).get('/api/genres/1');
        expect(res.status).toBe(404);
    
     });
     it('should return 404 when no genre is found',async()=>{
       const id=mongoose.Types.ObjectId();
        const res=await request(server).get('/api/genres/'+id);
        expect(res.status).toBe(404);
    
     });
    });

    describe('POST /',()=>{
        let token;
        let name;
      beforeEach(()=>{   token=new User().generateAuthToken();})
        const exec=async()=>{
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name});   
        }
    it('should return a 401 for unauth acess',async()=>{
           token='';
           name='genre1'
    const res=await exec();
        expect(res.status).toBe(401);
    });
    it('should return a 400 for posting invalid genre less than 5 characters',async()=>{
    
        name='1234';
        const res=await exec();
        expect(res.status).toBe(400);
    });
    it('should return a 400 for posting invalid genre more than 50 characters',async()=>{
         name=new Array(52).join('a');
     
        const res=await exec();
        expect(res.status).toBe(400);
    });
    it('should return a valid genre if present in database',async()=>{
        
        name='genre1';
        await exec();
        const genre=await Genre.find({name:'genre1'});
        expect(genre).not.toBeNull();
    });
   
    it('should return a valid genre in the body of the res',async()=>{
        
      const res=await exec();
        const genre=await Genre.find({name:'genre1'});
        expect(res.body).toHaveProperty('name','genre1');
        expect(res.body).toHaveProperty('_id');
    });
   
    });
    describe('PUT /:id', ()=>{
     it('should throw 400 if validation failed as name is less than 5 characters',async()=>{
        const genre=new Genre({name:'genre1'});
        await genre.save();
        const res=await request(server).put('/api/genres/'+genre._id).send({name:'1234'});
        expect(res.status).toBe(400);
     });
     it('should update the name if valid id is passed',async()=>{
        const genre=new Genre({name:'genre1'});
        await genre.save();
        const res=await request(server).put('/api/genres/'+genre._id).send({name:'newname'});
        const updatedname=await Genre.findById(genre._id);
        expect(updatedname.name).toBe('newname');
       
    });
    it('should return 404 if id is not not found',async()=>{
      
        const res= await request(server).put('/api/genres/1').send({name:'newname'});
      expect(res.status).toBe(404);
       
    });
    it('should return 404 if genre with given id is not found',async()=>{
        id = mongoose.Types.ObjectId();

       
        const res= await request(server).put('/api/genres/'+id).send({name:'newname'});
  
        expect(res.status).toBe(404);
    });
    });

    describe('DELETE /:id',()=>{
       it('should return 401 if unauthorized accessed',async()=>{
        const genre=new Genre({name:'genre1'}); 
        await genre.save();  
        const token='';
           const res=await request(server)
           .delete('/api/genres/'+genre._id)
           .set('x-auth-token',token)
           .send();
           
           expect(res.status).toBe(401);
       });
       
        it('should return 403 access denied if user is not admin',async()=>{
            const token=new User({isAdmin:false}).generateAuthToken();
            const genre=new Genre({name:'genre1'});   
            await genre.save();
        
               const res=await request(server)
               .delete('/api/genres/'+genre._id)
               .set('x-auth-token',token)
               .send();
               
               expect(res.status).toBe(403);
        });
        it('should return 404 if genre with that id is not valid ',async()=>{
            const token=new User({isAdmin:true}).generateAuthToken();
           
        
               const res=await request(server)
               .delete('/api/genres/1')
               .set('x-auth-token',token)
               .send();
               
               expect(res.status).toBe(404);
        });
        it('should return 404 if genre with that id is not found ',async()=>{
            const token=new User({isAdmin:true}).generateAuthToken();
             const id=mongoose.Types.ObjectId();
        
               const res=await request(server)
               .delete('/api/genres/'+id)
               .set('x-auth-token',token)
               .send();
               
               expect(res.status).toBe(404);
        });
        it('should return 200 if genre with that id found',async()=>{
            const token=new User({isAdmin:true}).generateAuthToken();
            const genre=new Genre({name:'genre1'});   
            await genre.save();
        
               const res=await request(server)
               .delete('/api/genres/'+genre._id)
               .set('x-auth-token',token)
               .send();
               
               expect(res.status).toBe(200);
        });
    })

});

//mosh's technique for writing clean and clear tests