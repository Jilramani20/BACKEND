
console.log("Hello, This is second");

function sum(a,b){
    console.log(a+b);    
}

function sub(a,b){
    console.log(a-b);
}
// console.log(module.exports); //* empty object {}

// module.exports = {sum:sum,sub:sub};
//& when key & value name is same then we can write like this
module.exports = {sum,sub};

//* other methods :
// module.exports.sum = sum;
// module.exports.sub = sub;
