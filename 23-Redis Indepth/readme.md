## <span style="color: #ff0000;">Redis</span>
- To configure redis we have to install redis in our system and then we have to install redis client in our application.
- We can install redis client using npm i redis.
- After installing redis client we have to connect to redis server from our application.
  ```javascript
  const redis = require('redis');

  const redisClient = redis.createClient({
      username: 'default',
      password: 'password',
      socket: {
          host: 'your-redis-server-host',
          port: port-number
      }
  });

  module.exports = redisClient;
  ```

- if you want to run redis locally then you can use `redisClient = redis.createClient()` and it will connect to redis server running on localhost with default port 6379.
- before that you have to start redis server in your system using `sudo service redis-server start` command in terminal.

- Now we can use redisClient to do all the work.
- and we can connect to redis server using `redisClient.connect()`
- we can store data in redis in key value pair format.
- Why key value pair formate? because it can use hash table and finding data in hash table is very fast.
- Now we can store directly `token` as a key but for batter understanding we will store it as `token:<token>` and value will be any value like true or 1 because we just want to check if this token is in blocklist or not. 
- we can store data in redis using `redisClient.set(key, value)`
- to set expire time for the key we can use `redisClient.expire(key, timeInSeconds)` or `redisClient.expireAt(key, timestampInSeconds)`
- we can also set expire time while setting the key using `redisClient.set(key, value, 'EX', timeInSeconds)`
- we can check if the key is in redis or not using `redisClient.exists(key)` it will return 1 if key is in redis and 0 if key is not in redis.
- we can also delete the key from redis using `redisClient.del(key)`

example of using redis for token blocklist:
```javascript
authRouter.post('/logout', userAuth, async (req, res)=>{
    try{
        //before anything check token validation don't put all token in redis some might send random token to fill database 
        //so we have used userAuth middleware

        const {token} = req.cookies;

        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, "bloked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie('token', null, {expires: new Date(Date.now())});
        res.send("Logged Out Successfully");
    }
    catch(err){
        res.status(404).send("Error: "+err);
    }
})

//user auth middleware
const userAuth = async(req, res, next)=>{
    try{
        
        //authenticate the user 
        const {token} = req.cookies;
        if(!token) throw new Error("Token doesn't exists");

        const payload = jwt.verify(token, process.env.SECRET_KEY);
        
        const {_id} = payload;
        if(!_id) throw new Error("Id is missing");

        const isBlocked = await redisClient.exists(`token:${token}`); //check if token is in blocked list
        if(isBlocked) throw new Error("invalid token");

        const result = await User.findById(_id);
        if(!result) throw new Error("user doesn't exists");


        req.result = result;
        next();
    }
    catch(err) {
        res.send("Error: "+err);
    }
}
```

