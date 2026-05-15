
const redis = require('redis');

const redisClient = redis.createClient({
    username: 'default',
    password: 'tT1nN2fo8Ll3hVAvHGtaHAVABvSxMzpe',
    socket: {
        host: 'redis-10507.crce281.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 10507
    }
});



module.exports = redisClient;