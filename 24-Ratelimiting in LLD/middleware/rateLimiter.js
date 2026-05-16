
const redisClient = require('../config/redis');

const rateLimiter = async(req,res,next)=>{
    try{
        const ip = req.ip;
        console.log(ip);
        const count = await redisClient.incr(ip);

        if(count==1) await redisClient.expire(ip, 3600);

        if(count>10) throw new Error("User limit exceeded");

         console.log(count);

        next();
        

    }
    catch(err){
         res.status(400).send("Error: "+err);
    }
}

//lets implement limit between 2 consecutive requests and fixed window of 1 hour with count of 10 requests per hour
// const rateLimiter = async (req, res, next) => {
//     try{
//         const ip = req.ip;
        
//         const data = await redisClient.get(ip);
//         if(!data){
//             await redisClient.set(ip, `1:${Date.now()/1000}`, { EX: 3600 });
//         }
//         else{
//             const [count, lastTime] = data.split(":").map(Number);
//             console.log(count);

//             if(Date.now()/1000 - lastTime <10) throw new Error("wait a little bit before making    another request"); 
//             if(count>=10) throw new Error("user limit exceeded");

//             await redisClient.set(ip, `${count+1}:${Date.now()/1000}`, { EX: 3600 });
//         }
//         next();
//     }
//     catch(err){
//         res.status(400).send("Error: "+err);
//     }
// }

module.exports = rateLimiter;