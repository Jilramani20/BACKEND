const express = require('express');
const authRouter = express.Router();
const User = require('../models/users');
const validateUser = require('../utils/validateUser');
const bcrypt = require('bcrypt');


authRouter.post('/register', async (req,res)=>{
    try{
        //validate user
        validateUser(req.body);
        
        // convert password to hash
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await User.create(req.body);
        res.status(200).json("User created successfully");
    }
    catch(err){
        res.status(400).json("Error: " + err);
    }
})

authRouter.post('/login', async (req,res)=>{
    try{
        //* validate
        const user = await User.findOne({email: req.body.email});
        if(req.body.email !== user.email )  throw new Error("Invalid credentials");

        const isAllowed = user.verifyPassword(req.body.password);
        if(!isAllowed) throw new Error("Invalid credentials");

        //* send JWT token we use cookie to send it
        const token = user.getJWT();
        res.cookie("token",token);

        res.send("login successfully");
    }
    catch(err){
        res.status(400).send("Error: "+ err);
    }
})



module.exports = authRouter;