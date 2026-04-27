
const http = require('http');

const server = http.createServer((req,res)=>{

    // res.end("Welcome to server");

    if(req.url==="/"){
        res.end("<h1>Welcome to Home page</h1>");
    }
    else if(req.url==="/contact"){
        res.end("<h1>This is our contact page</h1>");
    }
    else if(req.url==="/about"){
        res.end("<h1>This is about page</h1>");
    }
    else{
        res.end("<h1>404 page not found</h1>");
    }

});

server.listen(4000, ()=>{
    console.log("I am listening on port 4000");
});