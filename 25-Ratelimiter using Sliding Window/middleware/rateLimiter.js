
const redisClient = require('../config/redis');
const windowSize = 3600; // 1 hour
const maxRequests = 10;

const rateLimiter = async(req,res,next)=>{
    try{
        const key = `IP:${req.ip}`;
        
        const currentTime = Date.now()/1000; //* in second
        const windowTime = currentTime-windowSize; //& before this time other values are expired

         //& here z means ordered set
        await redisClient.zRemRangeByScore(key, 0, windowTime); //& this remove all the scores from 0 to windowTime

        const numberOfRequest = await redisClient.zCard(key); //& total number of requests if key is not exists then it will return 0
        console.log(numberOfRequest);

        if(numberOfRequest>=maxRequests) throw new Error("number of request exceeded");

        await redisClient.zAdd(key, [{score: currentTime, value:`${currentTime}:${Math.random()}`}]); //* use crpyto library insted of math.random()
        
        //key TTL increase
        await redisClient.expire(key, windowSize);

        next();

    }
    catch(err){
         res.status(400).send("Error: "+err);
    }
}

module.exports = rateLimiter;