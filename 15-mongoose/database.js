
require("dotenv").config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const url = process.env.MONGO_URL;

async function main(){
   await mongoose.connect(url);

    //& Define a schema
    // const userSchema = new mongoose.Schema({
    //     name: String,
    //     age: Number,
    //     city: String,
    //     profession: String
    // })

    //& Create a model / collection / class create(blueprint)
    // const User = mongoose.model("User", userSchema);

    //& Create a document
    // const user1 = new User({
    //     name: "Jeel Ramani",
    //     age:20,
    //     city: "Ahmedabad",
    //     profession: "Student"
    // })
    // await user1.save();


    //& this is also a way to create a document and save it
    // await User.create({ name: "Shanks", age: 30, city: "Elbaph", profession: "Pirate Emporror" }) 


    //& multiple documents
    // await User.insertMany([
    //     { name: "Luffy", age: 19, city: "East Blue", profession: "Pirate King" },
    //     { name: "Zoro", age: 21, profession: "Pirate Swordsman" },
    //     { name: "Sanji", age: 22, city: "East Blue", profession: "Pirate Cook" },
    //     { name: "Nami", profession: "Pirate Navigator" }

    // ])


    //& Read one  documents
    //  const data1 = await User.find({"name": "Luffy"});
    // console.log(data1);

    //& read all documents
    // const data2 = await User.find();
    // console.log(data2);
    

}


module.exports = main;
