const express = require('express');

const app = express();


app.use("/about", (req,res)=>{

    res.send({
        "name":"Jeel",
        "age":20,
        "Profession":"IT engineer",
        "sem": "6th"
    })
})
app.use("/contact", (req,res)=>{
    res.send("<h1>This is Contact page</h1>");  
})
app.use("/detail", (req,res)=>{
    res.send("<h1>This is Detail page</h1>");  
})
app.use("/", (req,res)=>{
     res.send("<h1>Hello, welcome to Homepage</h1>"); 
})

//* route url = "/abou?t" => u is optional in url (char become optional)

//* route url = "/abou+t" => can write many u in url along with u (character can be repeated multiple times)

//* route url = "/abou*t" =>  can write anything after u, but should be end with t.(any character can come after u)

//* url = "/about/:id/:name" => id,name is dynamic (id,name = parameters) 
 


app.listen(4000, ()=>{
    console.log("Listening on port 4000");
})