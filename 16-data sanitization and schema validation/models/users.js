const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
         minLength: 3,
        maxLength: 20
    },
    lastName:{
        type:String,
         minLength: 3,
        maxLength: 20
    },
    age: {
        type:Number,
        min: 14,
        max: 70,
        required: true
    },
    gender:{
        type:String,
        // enum: ["male", "female", "other"],
        validate(value){
            if(!["male", "female", "other"].includes(value))
                throw new Error("Invalid Gender");
        }  
    },
    email:{
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true
    },
    password:{
        type:String
    },
    photo:{
        type:String,
        default: "this is the default photo"
    }
},{timestamps: true})

const User = mongoose.model("User", userSchema);

module.exports = User;