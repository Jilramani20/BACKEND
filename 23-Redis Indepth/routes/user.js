const express = require('express');
const userRouter = express.Router();
const User = require('../models/users');
const userAuth = require('../middleware/userAuth');

userRouter.get('/',userAuth ,async (req,res)=>{
    try{     
       res.send(req.result);
    }
    catch(err){
         res.status(500).json("Error: " + err);
    }
})

userRouter.delete('/:id',userAuth , async (req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.send("Deleted Succesfully");
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
})

userRouter.patch('/', userAuth,async (req, res)=>{
    try{
        const {_id, ...update} = req.body;
        await User.findByIdAndUpdate(_id, update, {"runValidators": true});
        res.send("Updated succesfully");
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
})  
module.exports = userRouter;