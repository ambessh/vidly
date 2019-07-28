
const request=require('supertest');
const {Genre}=require('../../models/genre');
const{User}=require('../../models/user');
let server;
describe('authorised middleware',()=>{
    beforeEach(()=>{server=require('../../index');});
    afterEach(async()=>{
        await Genre.remove({}); 
         await server.close();
    });
        let token;
const exec=()=>{
   return request(server)
   .post('/api/genres')
   .set('x-auth-token',token)
   .send({name:'genre1'});
};
beforeEach(()=>{token=new User().generateAuthToken();});
it('should return a 401 if no token is provided',async()=>{
token='';
const res=await exec();

expect(res.status).toBe(401);
});
it('should return a 400 if bad token is provided',async()=>{
    token='a';
    const res=await exec();
    
    expect(res.status).toBe(400);
    });
    it('should return a 200 if good token is provided',async()=>{
       
        const res=await exec();
        
        expect(res.status).toBe(200);
        });
});