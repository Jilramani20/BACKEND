const express = require('express');
const app = express();

const bookStore = [
    {id:1, name:"Sapiens",author:"Yuval Noah Harari"},
    {id:2, name:"Ikigai", author:"Hector Garcia"},
    {id:3, name:"The Diary Of A Young Girl", author:"ANNE FRANK"},
    {id:4, name:"1984", author:"George Orwell"},
    {id:5, name:"Freedom From The Known", author: "J. KRISHNAMURTI"},
]

//* parser
app.use(express.json());

app.get("/book", (req, res)=>{
    res.send(bookStore);
})

app.get("/book/:id", (req, res)=>{
    const id = parseInt(req.params.id);
    const book = bookStore.find((info=>info.id===id));
    res.send(book);
})

app.post("/book", (req, res)=>{
    bookStore.push(req.body);
    res.send("data saved sucessfully");
})

app.listen(4000,()=>{
    console.log("Server running on port 4000");
    
})


//^ route match : app.use (in url => match initial string(prefix) if match then go inside)

//^ app.get, app.post , app.patch, app.put, app.delete => ( if match whole string then only go inside (ex : http://localhost:4000/books/3))

//^ both above works differently


// app.get("/user", (req, res)=>{
//     // console.log(req.params);
//     res.send({"name": "Jeel", "age": "20" })
// })

// //* parsing
// app.use(express.json());
// //* middleware : json format data => JS object

// app.post("/user", (req, res)=>{
//     // console.log("data saved successfully");
//     console.log(req.body);
//     res.send("data saved successfully");
// })

// app.use("/contact", (req, res)=>{
//     res.send("contact page")
// })

// app.use("/detail", (req, res)=>{
//     res.send("detail page")
// })

// app.use("/", (req, res)=>{
//     res.send("Home page")
// })





