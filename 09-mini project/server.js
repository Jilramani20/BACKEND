const express = require('express');
const app = express();
const {auth}  = require('./middleware/authentication');
app.use(express.json());

//* Database : array

const FoodMenu = [
    {id: 1, food: "chowmein", category: "veg", price: 200},
    {id: 2, food: "pizza", category: "veg", price: 300},
    {id: 3, food: "paneer lawabdar", category: "veg", price: 500},
    {id: 4, food: "cheez naan", category: "veg", price: 100},
    {id: 5, food: "button naan", category: "veg", price: 100},
    {id: 6, food: "roti", category: "veg", price: 50},
    {id: 7, food: "chicken", category: "non-veg", price: 600},
    {id: 8, food: "egg curry", category: "non-veg", price: 200},
    {id: 9, food: "paneer momos", category: "veg", price: 80},
    {id: 10, food: "daal fry", category: "veg", price: 100},
    {id: 11, food: "rice", category: "veg", price: 100},
    {id: 12, food: "salad", category: "veg", price: 70},
    {id: 13, food: "idli", category: "veg", price: 80},
    {id: 14, food: "dosa", category: "veg", price: 150},
    {id: 15, food: "shoup", category: "veg", price: 50},
];

//* add to cart (user cart)
const Cart = [];

app.get('/food', (req,res)=>{
    res.status(200);
    res.send(FoodMenu);
})

//* autheticate admin before going to the admin route
app.use('/admin', auth);

app.post('/admin', (req, res)=>{
    FoodMenu.push(req.body);
    res.status(201);
    res.send("Item added successfully");
})

app.delete('/admin/:id', (req,res)=>{
    const id = parseInt(req.params.id);
    const idx = FoodMenu.findIndex(info => info.id === id);
    if(idx == -1){
        res.status(400).send("Item not found")
    }
    else{
        FoodMenu.splice(idx,1);
        res.status(200).send("deleted successfully")
    }
})

app.patch('/admin', (req,res)=>{
    const id = req.body.id;
    const ele = FoodMenu.find(info => info.id === id);
    if(!ele){
        res.status(400).send("Item not found");
    }
    else{
        if(req.body.food) ele.food = req.body.food;
        if(req.body.category) ele.category = req.body.category;
        if(req.body.price) ele.price = req.body.price;
    }
     res.status(200).send("successfully updated");
    
})

app.listen(4000, ()=>{
    console.log("Listening on port 4000");
})