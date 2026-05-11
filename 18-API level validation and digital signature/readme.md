## <span style= "color: orange">API level validation</span>
- We validate data at database level, they why need at api level?
- Because insted too much database calls, we can validate data at api level and then make one call to database to save data.
- also we can have batter user experience by validating data at api level becuase it is faster and we can have better error messages.
- if we are validation data at api level then why need to validate data at database level?
- sometimes developer can forget to validate data at api level or they can make mistake in validation or they directly insert data to database with mongo compass or with some script so database validation is final safety layer to protect data integrity.

- Now how do we validate data at api level?
- We can write our own logic or we can just use `validator` package which is very popular package for validating data in nodejs.
example:
```javascript
const validator = require('validator');

function validateUser(data){
    //api level validation
    const mandatoryField = ["firstName", "email", "age", "password"];

    const isAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k));
    
    if(!isAllowed) throw new Error("Filed missing");
    if(!validator.isEmail(data.email)) throw new Error("Invalid Email");
    if(!validator.isStrongPassword(data.password)) throw new Error("Week password");
    if(data.firstName.length<3 || data.firstName.length>10) throw new Error("name length shuold be between 3 to 10");
}

module.exports = validateUser;
```
- We can use this function in our api route to validate data before saving it to database.
```javascript
const express = require('express');
const validateUser = require('./validateUser');
app.post('/registor', async (req, res)=>{
    try{
        //validate user
        validateUser(req.body);

        await User.create(req.body);
        res.status(200).json("User created successfully");
    }
    catch(err){
        res.status(400).json("Error: " + err);
    }
})
```
- This way we can validate data at api level and then save it to database if data is valid.

## <span style= "color: orange">How to authenticate user?</span>
- Now login is complete now user can access there account and chat with other but now when they send request to the server we have to authenticate them how do we do that ?
1. User will send there password and username everytime. 
    - problem is that we have to do database call everytime user send the request so this is not feasible solution.
2. We can use session id
    - Whenver client login server will give them a session id and the server will store this session id in database and when client send request to server they will send this session id and server will check if this session id is valid or not by checking it in database.
    - now the same question we have to database and we can not directly store session id in server because there are many servers and we have to share session id between them so this is not feasible solution.
3. We can use Digital Signature

## <span style= "color: orange">Digital Signature</span>
- Let's take a analog We go to college they see over icard and they know that we are from this college why they don't have to verify our icard because icard will have college signature. In digital world we do the same thing we use digital signature to verify the authenticity of the data.
- But same thing what if the signature is forged then how do we verify the authenticity of the data we have to think of a way so the data can not be tempered and maintain its integrity.
- along with the data we can send the hash of the data and at the reciever side we can calculate the hash of the data and compare it with the hash sent by the sender if both are same then we can say that data is not tempered and maintain its integrity.
- But hashcode can also be changed. 
- here comes the concept of `digital signature`: we can use RSA algorithm 
- we can encrypt the hash of the data with our private key and send it along with the data and at the reciever side they can decrypt the hash with our public key and compare it with the hash of the data if both are same then we can say that data is not tempered and maintain its integrity.

- Now We have maintain the inegrity of data and verified that data is coming form who they claim to be.

- so `digital signature = inegrity + authenticity`