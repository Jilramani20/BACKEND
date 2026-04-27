# <span style="color: #FF5733;">Server</span>

## <span style="color: orange;">What is sever?</span>

Server is hardware or software that provides services to other computer programs (and their users) in a network. 

Mashines that are dedicated to running server software are often referred to as servers.

And the programs that run on servers are also called servers.

## <span style="color: orange;">Create Server on Node.js</span>

There is a module in node.js called `http` that allows us to create a server.

To create a server, we need to use the `http` module and call the `createServer()` method.

Here is an example of how to create a simple server using Node.js:

```javascript
const http = require('http');

const server = http.createServer((req, res)=>{    
    // res.end("<h1>Hello from Server</h1>");

    if(req.url == '/') res.end("<h1>Home Page</h1>");
    else if(req.url == '/contact') res.end("<h1>Contact Page</h1>");
    else if(req.url == '/about') res.end("<h1>About Page</h1>");
    else res.end("<h1>404 Page Not Found</h1>");
});

server.listen(4000, ()=>{
    console.log('I am listening on port 4000');
})
```
In this example, we create a server that listens on port 4000. When a request is made to the server, it checks the URL of the request and responds with different content based on the URL.

To run the server, save the code in a file named `server.js` and run it using the command:

```
node server.js
```
You can then access the server by navigating to `http://localhost:4000` in your web browser. You can test different routes like `/`, `/contact`, and `/about` to see the different responses.