const express = require('express');
const app = express();
const main = require('./database');
const User = require('./models/users');
const port = 4000;

app.use(express.json());

app.post('/register', async (req,res)=>{
    try{

         //* api level validation
        const mandatoryField = ["firstName", "email", "age"];

        const isAllowed = mandatoryField.every((k)=> Object.keys(req.body).includes(k));
        
        if(!isAllowed) throw new Error("Field missing");

        await User.create(req.body);
        res.status(200).json("User created successfully");
    }
    catch(err){
        res.status(400).json("Error: " + err);
    }
})

app.get('/info', async (req,res)=>{
    try{
        const result = await User.find({});
        res.send(result);
    }
    catch(err){
         res.status(400).json("Error: " + err);
    }
})

app.get('/info/:id', async (req,res)=>{
    try{
        const result = await User.findById(req.params.id);
        res.send(result);
    }
    catch(err){
         res.status(500).json("Error: " + err);
    }
})

app.delete('/user/:id', async (req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.send("Deleted Succesfully");
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
})

app.patch('/user', async (req, res)=>{
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