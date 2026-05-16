const express = require('express');
const app = express();
const main = require('./database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const redisClient = require('./config/redis');
const rateLimiter = require('./middleware/rateLimiter');
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(rateLimiter);

app.use('/auth', authRouter);
app.use('/user', userRouter);

const initializeConnection = async()=>{
    try{
        // await redisClient.connect();
        // console.log("Connected to redis");

        // await main();
        // console.log("Connected to mongoDB");

        await Promise.all([redisClient.connect(), main()]);  //before listing connect to both DBs
        //* both connect parallaly
        console.log("DB connected");

        app.listen(port, ()=>{
            console.log("Server is running on port "+port);
        });
    }
    catch(err){
         console.log("Error: "+err);
    }
}

initializeConnection();