const express = require('express');
const app = express();
const main = require('./database');
const User = require('./models/users');
const port = 4000;

app.use(express.json());

app.get('/info', async (req, res) => {
    const ans = await User.find({});
    res.send(ans);
});

app.post('/info', async (req,res)=>{
    // const data = new User(req.body);
    // await data.save();

    try{
        User.create(req.body);
        res.send("Data added successfully");
    }
    catch(err){
        res.status(500).send("Error while adding data",err);
    }
})

app.delete('/info/:params', async (req, res)=>{
    try{
        const param = req.params.params;
        await User.deleteOne({name: param});
        res.send("Data deleted successfully");
    }
    catch(err){
        res.status(500).send("Error while deleting data",err);
    }
})

app.put('/info/', async (req,res)=>{
    const result = await User.updateOne({name: "Shanks"}, {city: "west blue",age: 40});
    res.send("Data updated successfully");
})

main()
    .then(()=>{
            console.log("Connected to MongoDB");
            app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`);
         });

    })
    .catch((err)=>console.log(err));