const express = require('express');
const authRouter = express.Router();
const User = require('../models/users');
const validateUser = require('../utils/validateUser');
const bcrypt = require('bcrypt');
const userAuth = require('../middleware/userAuth');
const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');


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

authRouter.post('/logout', userAuth,async(req, res)=>{
    try{
         //before anything check token validation don't put all token in redis some might send random token to fill database 
        //so we have used userAuth middleware

        const {token} = req.cookies;
         const payload = jwt.decode(token);

        await redisClient.set(`token:${token}` , 'Blocked');
        // await redisClient.expire(`token:${token}`, 3000); //* 3000 second from current time
        await redisClient.expireAt(`token:${token}`, payload.exp); //* expire at exp time from 1st jan 1970 standard

        res.cookie('token', null, {expires: new Date(Date.now())});
        res.send("Logged Out Successfully");
    }
    catch(err){
        res.status(404).send("Error: "+err);
    }
})

module.exports = authRouter;