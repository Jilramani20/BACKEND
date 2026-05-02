# <Span style="color: red;">Middleware</Span>

## <span style="color: orange;">What is Middleware?</Span>

Middle where means "in the middle". In Express, middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application's request-response cycle. They can execute any code, make changes to the request and response objects, end the request-response cycle, or call the next middleware function.

example:

```javascript  
app.use('/user', (req, res, next)=>{
    // res.send("Hello sir");
    console.log("first is called");
    next();
})

app.use('/user', (req, res, next)=>{
    console.log("second is called");
    // res.send("hello second");
    next();
})


app.use('/user', (req, res)=>{
    console.log("third is called");
    res.send("hello third");
})
```

Here we have two middleware functions and one route handler. When a request is made to the `/user` endpoint, the first middleware function is executed, which logs "first is called" and then calls `next()`. This passes control to the second middleware function, which logs "second is called" and also calls `next()`. Finally, the third function is executed, which logs "third is called" and sends a response "hello third".

In short who send the response is the request handler (route handler) and the middlewares do not send the response. They are used to perform some operations and pass control to the next middleware or route handler.

## <span style="color: orange;">Work of Middleware</Span>

Sometimes we need to maintain logs of requests made to our sever.

we need logs because it helps us to debug our application and also helps us to monitor the traffic on our server.

also for authentication and authorization we need to use middleware.

so we need to write logging in every single request handler which is not a good practice. So we can use middleware to maintain logs of requests.

```javascript
app.use((req, res, next)=>{
    console.log(`${Date.now()} ${req.method} ${req.url}`);
    next();
})

app.get('/user', (req, res)=>{
    res.send("info about user");
})

app.post('/user', (req, res)=>{
    res.send("info saved");
})

app.delete('/user', (req, res)=>{
    res.send("info deleted");           
})

```