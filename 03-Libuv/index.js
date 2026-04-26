
const fs = require('fs');

fs.readFile("./data.json", "utf-8" ,(err,data)=>{
    console.log(data);
})


let a = 10;
let b = 'Hello ji';

console.log(b);

function sum(a,b){
    return a+b;
}

setTimeout(()=>{
    console.log("Hello Timeout");    
},3000)

console.log(a);
console.log(sum(3,8));

