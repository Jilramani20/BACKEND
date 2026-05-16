# <span style="color: #ff0000;">Ratelimiter using Sliding Window</span>
- In previous lecture we learn why we need to use sliding window instead of fixed window.
- How can we solve this??

## Using queue
- radis already has queue data structure so we can use that to store the timestamp of each request.
- we can use queue to store the timestamp of each request and then when user make a new request we will check if the current timestamp - first timestamp in the queue is less than 1 hour then reject the request otherwise process the request and remove the first timestamp from the queue and add the current timestamp to the end of the queue.
- But here everything is manually we have to check if the first timestamp is expired than remove than here we have to make many calls to radis.

## We can use orderd set
- In ordred set we can store the timestamp in sorted order
- But We can put anything in key like string object number how will it sort the data in sorted order??
- It will sort the data based on the score we have to provide an additional field called score which will be used to sort the data.
- also orderd set has unique values so we but we can use same timestamp for multiple request.
- for example this is the set = `{1, "het"}, {2, 5}, {3, "hello"}, {4, "world"}` here 1,2,3,4 is the score and "het",5,"hello","world" is the value and it will sort the data based on the score.
- now if we put `{5, 5}` as we learn that value should be unique so it will update the value of score 3 to 5 and new set will be `{1, "het"}, {3, "hello"}, {4, "world"},{5, 5}`.
- also key will be ip address of the user. so this whole set is for that one perticular user.
- and we can apply range query to remove the expired timestampi in one go like remove score less than 4;
- so we can use timestamp as score.
- now what to put in value?? value should be unique but we cannot use timestamp as value because multiple request can be serverd at same timestamp so it is not unique.
- we can just use current time:math.random() this will be unique but that is false because math.random() use current time stamp to generate random number.
- so we can use use `crypto` library to generate random number which will be unique.

## let's see the code implementation of this
```javascript
const redisClient = require('../config/redis');

const windowSize = 3600; //1 hour
const maxRequests = 10;

const rateLimiter = async (req, res, next) => {
    try{
        const key = `IP:${req.ip}`;
        // redisClient.del(ip); //for testing
        
        const currentTime = Date.now()/1000;
        const windowTime = currentTime-windowSize; //before this time othe values are expired
        

        //here z means orderd set
        await redisClient.zRemRangeByScore(key, 0, windowTime); // this remove all the scores from 0 to windowTime

        const numberOfRequest = await redisClient.zCard(key); //total number of requests if key is not exists then it will return 0
        console.log(numberOfRequest);

        if(numberOfRequest>=maxRequests) throw new Error("number of request exceeded");

        await redisClient.zAdd(key, [{score: currentTime, value:`${currentTime}:${Math.random()}`}]); //use crpyto library insted of math.random()
        
        //key TTL increase
        await redisClient.expire(key, windowSize);

        next();

    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}
module.exports = rateLimiter;
````
- here we are using `zRemRangeByScore` to remove all the expired timestamp in one go.
- then we are using `zCard` to get the total number of requests in the current
- then we are using `zAdd` to add the current timestamp to the orderd set and we are using `expire` to set the TTL of the key to 1 hour so that if user stop making request then after 1 hour the key will be deleted from redis.