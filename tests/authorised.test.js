const {User}=require('../models/user');
const authorised=require('../middleware/authorised');
const mongoose=require('mongoose');
describe('unit authorised ',()=>{
    it('should populated req.user with the payload for given JWT',()=>{
        const user={_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true};
     const token=new User(user).generateAuthToken();
     const req={
         header:jest.fn().mockReturnValue(token)
     };
     const res={};
     const next=jest.fn();
     authorised(req,res,next);
     expect(req.user).toBeDefined();
    });
});