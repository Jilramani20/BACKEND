
require("dotenv").config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const url = process.env.MONGO_URL;

async function main(){
   await mongoose.connect(url);
}
module.exports = main;
