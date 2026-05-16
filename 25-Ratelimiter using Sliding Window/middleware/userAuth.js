const jwt = require('jsonwebtoken');
const User = require('../models/users');
const redisClient = require('../config/redis');

const userAuth = async(req, res, next)=>{
    try{
        
        //authenticate the user 
        const {token} = req.cookies;
        if(!token) throw new Error("Token doesn't exists");

        const payload = jwt.verify(token, process.env.SECRET_KEY);
        
        const {_id} = payload;
        if(!_id) throw new Error("Id is missing");

        const isBlocked = await redisClient.exists(`token:${token}`) ; //check if token is in blocked list
        if(isBlocked){
           throw new Error("Invalid, Token blocked!");
        }

        const result = await User.findById(_id);
        if(!result) throw new Error("user doesn't exists");

        req.result = result;
        next();
    }
    catch(err) {
        res.send("Error: "+err);
    }
}

module.exports = userAuth;