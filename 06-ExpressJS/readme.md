## <span style="color: orange;">Https Methods?</span>
1. GET - To request data from a specified resource.
2. POST - To send data to a server to create/update a resource also known as `create method`.
3. UPDATE - To update a current resource with new data.
    1. PUT - To update/replace a current resource with new data.
    2. PATCH - To update/modify a current resource with new data.
4. DELETE - To delete a specified resource.

## <span style="color: orange;">Difference between Patch and Put</span>

Let say you have instagram application it stores your username, password, bio, profile picture etc.

- If you want to update your profile picture only then you will use `PATCH` method because you are modifying a part of the resource.
- If you want to update your username, password, bio, profile picture all at once then you will use `PUT` method because you are replacing the entire resource with new data.

## <span style="color: orange;">REST Api?</span>
REST API is nothing but a set of rules that developers follow when creating APIs.

The methods we discussed above (GET, POST, PUT, PATCH, DELETE) are the standard HTTP methods used in RESTful APIs to perform CRUD (Create, Read, Update, Delete) operations on resources.

# <span style="color: red;">Express.js?</span>

## <span style="color: orange;">Why we need Express.js?</span>
Express is a minimal and flexible web framework for Node.js used to build web servers and APIs easily.

It is built on top of the Node.js HTTP module and provides higher-level features for handling requests, routing, middleware, and more.

Problems with Using Only HTTP Module

- Manual routing (if-else for URLs)
- Manual parsing of request body
- No built-in middleware system
- Harder to manage large applications
- More boilerplate code

Benefits of Using Express.js
- Simplified routing
- Middleware support
- Easier request handling
- Better organization for larger applications
- Less boilerplate code

## <span style="color: orange;">How to create server in Express.js?</span>

1. First, install express using npm
    ```bash
    npm install express
    ```
2. Create a file named `app.js` and add the following code to create a basic server:
    ```javascript
    const express = require('express');
    const app = express();

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
    app.listen(4000, () => {
        console.log(`Server is running on port 4000`);
    });
    ```

## <span style="color: orange;">How to handle routing in express?</span>

Routing in Express.js is handled using methods corresponding to HTTP methods. Here is an example of how to set up routing for different HTTP methods:

```javascript
const express = require('express');
const app = express();

app.use("/", (req, res)=>{
    res.send("Home page")
})

app.use("/about", (req, res)=>{
    res.send({"name": "het", "age": "30" })
})

app.use("/contact", (req, res)=>{
    res.send("contact page")
})

app.use("/detail", (req, res)=>{
    res.send("detail page")
})


app.listen(4000, ()=>{
    console.log("listening at port 4000");
})
```
In this example, we have defined routes for `/about`, `/contact`, `/detail`, and the root `/` path. Each route sends a different response when accessed.

But there is a problem when we try to access `/about` route express see `/` and in code it matched with the `/` route it assume that we this `/` route has handled the `/about` request and send the response of `/` route.

To handle this problem we can just put `/` at the end of each route like this 
```javascript
app.use("/about", (req, res)=>{
    res.send({"name": "het", "age": "30" })
})

app.use("/contact", (req, res)=>{
    res.send("contact page")
})

app.use("/detail", (req, res)=>{
    res.send("detail page")
})

app.use("/", (req, res)=>{
    res.send("Home page")
})
app.listen(4000, ()=>{
    console.log("listening at port 4000");
})
```
