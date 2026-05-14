const express = require('express');
const app = express();
const main = require('./database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/user', userRouter);

main()
    .then(()=>{
            console.log("Connected to MongoDB");
            app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`);
         });

    })
    .catch((err)=>console.log(err));