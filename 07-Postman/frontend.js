const express = require('express');

const app = express();

// app.use("/user", (req,res)=>{

//     res.send({
//         "name":"Jeel",
//         "age":20
//     })
// })

//* default get method
// const res1 = await fetch("https://api.example.com/data");

app.get("/user", (req,res)=>{
    res.send("<h1>Welcome to the GET method</h1>")
})


//* post method
// const res2 = await fetch("https://api.example.com/data", {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ name: 'Jeel', age:20})
// });
//& we can't directly use link in post (we need frontend) so we will use Postman for api testing
app.post("/user" , (req,res)=>{
    // console.log("Data saved successfully");
    res.send("Data saved successfully");
})

//* patch method
// const res3 = await fetch("https://api.example.com/data", {
//     method: 'PATCH',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({age:20})
// });

//* PUT method => similer as patch


app.listen(4000, ()=>{
    console.log("Listening on port 4000");
})