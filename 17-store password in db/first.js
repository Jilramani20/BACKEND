
const bcrypt = require('bcrypt');

const password = "Jeel@2006";

async function Hashing(){
    // hashcode + salt
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password,salt);
      //  console.log(salt);
      
     const ans = await bcrypt.compare(password, hashPass);
    console.log(ans);
    
     
    // console.log(hashPass);
    
}

Hashing();

//*  same password -> we get every time different hashCode -> bcs salt is different everytime