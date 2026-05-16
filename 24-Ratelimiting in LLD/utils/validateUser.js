
const validator = require('validator');
function validateUser(data){
      //* api level validation
            const mandatoryField = ["firstName", "email", "age", "password"];
    
            const isAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k));
            
            if(!isAllowed) throw new Error("Field missing");
    
            if(!validator.isEmail(data.email)) throw new Error("Invalid email");
            if(!validator.isStrongPassword(data.password)) throw new Error("Week password");
            if(data.firstName.length<3 || data.firstName.length>20) throw new Error("name length shuold be between 3 to 20");
}

module.exports = validateUser;