const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        type:String,
        required: true
    },
    photo:{
        type:String,
        default: "this is the default photo"
    }
},{timestamps: true})

userSchema.methods. getJWT = function(){
    const ans =  jwt.sign({_id: this._id, email: this.email}, process.env.SECRET_KEY, {expiresIn: 500});
    return ans;
} 

userSchema.methods.verifyPassword = async function(userPassword){
    const ans = await bcrypt.compare(userPassword, this.password);
    return ans;
}
const User = mongoose.model("User", userSchema);

module.exports = User;