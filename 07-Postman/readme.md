## <span style="color: red;">Postman</span>

We cannot do POST requests with just a browser, so we will use Postman for that.
because in post requests we usually send data to the server, and browsers are not designed for that.

example:
```javascript
fetch('localhost:4000/user', {
    method: 'POST',
    body: JSON.stringify({title: 'foo', body: 'bar', userId: 1,}),
})
```

postman is a popular API client that makes it easy for developers to create, share, test, and document APIs.

and in backend we do this

```javascript
app.use(express.json());
app.post('/user', (req, res) => {
    const userData = req.body;
    res.send('User data received');
});
```

Why we need to use `express.json()` middleware?

to understand that we need to know the difference between JSON and JSObject.

## <span style="color: orange;">Fist understand the difference between JSON and JSObject</span>


### JSON (JavaScript Object Notation)

- It is in string format.
- It is language independent, meaning it can be understood by other languages like Python, Java, etc.
- Key name must be in double quotes.(`string`)
- At last cannot add `,` after the last property.
- can add string, number, boolean, null, array, object as value. but not functions or undefined.
- you can only send data in 2 formats: JSON (between `{}`) or array (between `[]`).
- When You convert JS Object to JSON, functions and undefined values are removed. and all the key names are converted to double quotes. and last comma is removed and whole object is converted to string.

Example of JSON:
```json
{name: "het", age: 21,} =>
{"name": "het", "age": 21} =>
'{"name": "het", "age": 21}' // final JSON string  this is done by JSON.stringify()
const jsonString = JSON.stringify({name: "het", age: 21,});
```

every language can understand this string format.

Also string can travel easily on physical layer of OSI model. because converting string to bits and bits to string is easy. but converting complex data structures to bits and bits to complex data structures is hard.

Now this data has came to backend as string. so we need to convert it back to JS Object to use it in our code. It is called parsing. and will be done by `express.json()` middleware.

also it doesn't know that the number in the string is number. so it will be string until we convert it to number using `Number()` or `parseInt()` or `parseFloat()`.

so we get `{name: "het", age: "21"}` in req.body. and we need to convert age to number if we want to use it as number.

but in newer versions of express, it automatically converts number strings to number, boolean strings to boolean and null strings to null. but still we need to convert if we want to be sure.



### JS Object (JavaScript Object)

- It is in object format.
- Has properties and methods. which cannot be understood by other languages. 
- Key name can be in single quotes or no quotes at all.
- At last can add `,` after the last property.
- can add functions and undefined as value.