const express = require('express');
const app = express();
const main = require('./database');
const User = require('./models/users');
const validateUser = require('./utils/validateUser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./middleware/userAuth');
const port = 4000;

app.use(express.json());
app.use(cookieParser());

app.post('/register', async (req,res)=>{
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

app.post('/login', async (req,res)=>{
    try{
        //* validate
        const user = await User.findOne({email: req.body.email});
        if(req.body.email !== user.email )  throw new Error("Invalid credentials");

        const isAllowed = await bcrypt.compare(req.body.password, user.password);
        if(!isAllowed) throw new Error("Invalid credentials");

        //* send JWT token we use cookie to send it
        const token = jwt.sign({_id: user._id, email: user.email}, "supersecretkey", {expiresIn: 60});
        res.cookie("token",token);

        res.send("login successfully");
    }
    catch(err){
        res.status(400).send("Error: "+ err);
    }
})

app.get('/user',userAuth ,async (req,res)=>{
    try{     
       res.send(req.result);
    }
    catch(err){
         res.status(500).json("Error: " + err);
    }
})

app.delete('/user/:id',userAuth , async (req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.send("Deleted Succesfully");
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
})

app.patch('/user', userAuth,async (req, res)=>{
    try{
        const {_id, ...update} = req.body;
        await User.findByIdAndUpdate(_id, update, {"runValidators": true});
        res.send("Updated succesfully");
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
})  

main()
    .then(()=>{
            console.log("Connected to MongoDB");
            app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`);
         });

    })
    .catch((err)=>console.log(err));