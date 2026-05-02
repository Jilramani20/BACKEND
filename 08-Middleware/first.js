const express = require('express');
const app = express();

//* app.use(Router, RH, [RH, RH, RH], RH, RH)



// app.use("/user",(req,res,next)=>{
//     // res.send("Welcome to the pirate era");
//     console.log("first is called");
//     next();
// })

// app.use("/user" ,(req,res,next)=>{
//     // res.send("This area is under RED-HAIRED pirates");
//      console.log("second is called");
//      next();
// })

// app.use("/user", (req,res)=>{
//      res.send("You are not allowed to hurt anyone in this area");
//     console.log("third is called");

// })


//* maintaining log of request through middleware

//* middleware
app.use((req,res,next)=>{
    console.log(`${new Date().toLocaleDateString('en-GB')} ${req.method} ${req.url}`);
    //* Here we can do Authorization also
    next();
})

//* req handlers
app.get('/user', (req,res)=>{
    res.send("Info about user");
})
app.post('/user',(req,res)=>{
    res.send("Info saved");
})
app.delete('/user',(req,res)=>{
    res.send("Info deleted");
})

app.listen(4000, ()=>{
     console.log("Server running on port 4000");
})

