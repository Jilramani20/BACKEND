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
    if(req.query.author){
        const book = bookStore.filter(info => info.author === req.query.author)
        res.send(book);
    }
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

app.patch("/book" , (req,res)=>{
    console.log(req.body);
    const book = bookStore.find(info => info.id === req.body.id);
    if(req.body.author) book.author = req.body.author;     
    if(req.body.name) book.name = req.body.name;   
    res.send("Patch updated successfully");
})

app.put("/book", (req,res)=>{
    console.log(req.body);
    const book = bookStore.find(info => info.id === req.body.id);
    book.author = req.body.author;     
    book.name = req.body.name;  
    res.send("changes updated successfully");
})

app.delete("/book/:id", (req,res)=>{
    const id = parseInt(req.params.id);
    const idx = bookStore.findIndex(info => info.id === id);
    bookStore.splice(idx,1); // delete 1 ele. from index
    res.send("Deleted successfully");
})

app.listen(4000,()=>{
    console.log("Server running on port 4000");
    
})










