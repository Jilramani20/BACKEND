# ## <span style="color: #ff0000;">Method in Mongoose</span>

- Mongoose allows us to create custom methods inside schema.
- These methods help us write reusable and cleaner code.
- Instead of writing the same logic again and again, we can create methods once and use them anywhere.
- Methods are very useful for:
  - Authentication
  - Password verification
  - JWT generation
  - Data formatting
  - Utility functions

---

# Why Use Methods in Mongoose?

Without methods:

- Same code gets repeated multiple times.
- Code becomes difficult to maintain.
- Authentication logic gets scattered everywhere.

With methods:

- Code becomes reusable.
- Logic stays organized.
- Project structure becomes cleaner.
- Easy to debug and maintain.

---

# Types of Methods in Mongoose

There are mainly 2 types of methods:

| Type | Used On | Created Using |
|---|---|---|
| Instance Method | Particular document | `schema.methods` |
| Static Method | Entire model | `schema.statics` |

---

# Instance Methods in Mongoose

- Instance methods work on a single document.
- They are called on model instances.

Example:

```javascript
const user = await User.findOne({email});
```

Now `user` is a document instance.

We can call methods like:

```javascript
user.getJWT();
user.verifyPassword();
```

---

# Creating Instance Methods

We create instance methods using:

```javascript
schema.methods
```

Example:

```javascript
userSchema.methods.getJWT = function(){
    const ans = jwt.sign(
        {_id: this._id, email: this.email},
        "supersecretkey",
        {expiresIn: 600}
    );

    return ans;
}

userSchema.methods.verifyPassword = async function(userPassword){
    const ans = await bcrypt.compare(userPassword, this.password);
    return ans;
}
```

---

# Understanding `this` Keyword

Inside instance methods:

```javascript
this
```

refers to the current document.

Example:

```javascript
this.email
this.password
this._id
```

These values belong to the current user document.

---

# Why Arrow Functions Should Not Be Used?

❌ Wrong:

```javascript
userSchema.methods.getJWT = () => {}
```

Arrow functions do not have their own `this`.

So:

```javascript
this.email
```

will not work properly.

---

## Correct Way

✅ Use normal function:

```javascript
userSchema.methods.getJWT = function(){}
```

because normal functions get access to document context.

---

# Example Login API Using Instance Methods

```javascript
app.post('/login', async(req, res)=>{
    try{
        // validate first
        const user = await User.findOne({email: req.body.email});

        const isAllowed = await user.verifyPassword(req.body.password);

        if(!isAllowed)
            throw new Error("Invalid credentials");

        // create JWT token
        const token = user.getJWT();

        // send cookie
        res.cookie("token", token);

        res.send("login successfully");
    }
    catch(err){
        res.status(400).send("Error: " + err);
    }
})
```

---

# Flow of Above Login API

```text
Client Sends Email + Password
            ↓
Find User From Database
            ↓
Verify Password
            ↓
Generate JWT Token
            ↓
Send Token In Cookie
            ↓
User Logged In
```

---

# Benefits of Instance Methods

- Reusable code
- Cleaner authentication logic
- Better project structure
- Easy maintenance
- Reduces duplicate code
- Keeps related logic together

---

# Static Methods in Mongoose

- Static methods are attached to the model itself.
- They are not called on documents.
- They are mainly used for:
  - Searching users
  - Authentication
  - Aggregation logic
  - Utility database operations

---

# Creating Static Methods

We create static methods using:

```javascript
schema.statics
```

Example:

```javascript
userSchema.statics.loginUser = async function(email, password){

    const user = await this.findOne({ email });

    if(!user)
        throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
        throw new Error("Invalid credentials");

    return user;
}
```

---

# Understanding `this` in Static Methods

In static methods:

```javascript
this
```

refers to the model itself.

Example:

```javascript
this.findOne()
```

means:

```javascript
User.findOne()
```

---

# Using Static Methods

Example:

```javascript
app.post('/login', async(req, res)=>{
    try{

        const user = await User.loginUser(
            req.body.email,
            req.body.password
        );

        const token = user.getJWT();

        res.cookie("token", token);

        res.send("login successfully");
    }
    catch(err){
        res.status(400).send("Error: " + err);
    }
})
```

---

# Instance Methods vs Static Methods

| Feature | Instance Method | Static Method |
|---|---|---|
| Called On | Document | Model |
| Uses | Single document logic | Collection-level logic |
| Created Using | `schema.methods` | `schema.statics` |
| Example | `user.getJWT()` | `User.loginUser()` |

---

# Best Practices for Mongoose Methods

## Keep Methods Small

Each method should do only one task.

Good Example:

```javascript
verifyPassword()
generateToken()
```

---

## Do Not Put Very Heavy Logic

Avoid:

- Large business logic
- Complex API calls

inside schema methods.

---

## Use Async/Await

Database operations are asynchronous.

Always use:

```javascript
async/await
```

for better readability.

---

# ## <span style="color: #ff0000;">Environment Variables</span>

- Sensitive information should never be hardcoded in codebase.
- Examples:
  - Database URL
  - JWT secret
  - API keys
  - Cloudinary secret
  - SMTP password

If sensitive data is pushed to GitHub accidentally:

- Anyone can misuse it.
- Your database may get hacked.
- API usage limit may get exhausted.

So we use:

# Environment Variables

---

# What Are Environment Variables?

Environment variables are external variables used to store configuration data separately from code.

Example:

```env
PORT=4000
DB_URL=mongodb://localhost:27017/test
JWT_SECRET=mysecretkey
```

---

# Why Use Environment Variables?

## 1. Security

Sensitive data stays outside codebase.

---

## 2. Different Configurations

Different environments may need different values.

Example:

| Environment | Database |
|---|---|
| Development | Local DB |
| Testing | Test DB |
| Production | Cloud DB |

---

## 3. Easier Maintenance

No need to change code repeatedly.

Only change `.env` file.

---

# What is `process.env`?

`process.env` is a global object provided by Node.js.

It stores all environment variables.

Example:

```javascript
console.log(process.env.PORT);
```

---

# Using dotenv Package

Node.js cannot automatically read `.env` file.

So we use:

```bash
npm install dotenv
```

---

# Configuring dotenv

In entry file:

```javascript
require('dotenv').config();
```

Now all variables become available inside:

```javascript
process.env
```

---

# Example `.env` File

```env
PORT=4000
DB_URL=mongodb://localhost:27017/instagram
JWT_SECRET=mysecretkey
```

---

# Accessing Environment Variables

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL);

const secret = process.env.JWT_SECRET;
```

---

# Important Rule

❌ Never push `.env` file to GitHub.

Add `.env` in `.gitignore`.

Example:

```gitignore
node_modules
.env
```

---

# What Happens If `.env` Is Leaked?

If hacker gets:

- Database URL
- JWT secret
- API keys

then they may:

- Access database
- Create fake JWT tokens
- Use paid APIs

So `.env` security is extremely important.

---

# Common Environment Variables

| Variable | Purpose |
|---|---|
| PORT | Server port |
| DB_URL | Database connection |
| JWT_SECRET | JWT signing key |
| CLOUDINARY_SECRET | Cloudinary authentication |
| SMTP_PASSWORD | Email service password |

---

# Best Practices for Environment Variables

## Use Strong Secrets

Bad:

```env
JWT_SECRET=12345
```

Good:

```env
JWT_SECRET=akjsdhakjsdhkajshd82374823
```

---

## Use Separate `.env` Files

Example:

```text
.env.development
.env.testing
.env.production
```

---

## Never Share `.env`

Do not send:

- screenshots
- GitHub uploads
- public repositories

with secrets.

---

# ## <span style="color: #ff0000;">Routes in Express</span>

- Putting all APIs inside one file is not good practice.
- It makes code:
  - Hard to read
  - Difficult to maintain
  - Difficult to debug

So Express provides:

# Express Router

---

# What is Express Router?

Express Router helps us split APIs into multiple files.

Example:

```text
routes/
    auth.js
    user.js
    admin.js
```

This creates a modular project structure.

---

# Benefits of Using Routes

- Cleaner code
- Better organization
- Easy debugging
- Easy teamwork
- Reusable middleware
- Scalable architecture

---

# Creating Router

We use:

```javascript
express.Router()
```

Example:

```javascript
const express = require('express');

const authRouter = express.Router();
```

---

# Example Route File

```javascript
// routes/auth.js

const express = require('express');

const authRouter = express.Router();

authRouter.post('/login', async(req, res)=>{
    // login logic here
});

authRouter.post('/signup', async(req, res)=>{
    // signup logic here
});

module.exports = authRouter;
```

---

# Using Router in Main File

```javascript
// server.js

const express = require('express');

const app = express();

const authRouter = require('./routes/auth');

app.use('/auth', authRouter);
```

---

# Final API Endpoints

Now routes become:

```text
/auth/login
/auth/signup
```

because:

```javascript
app.use('/auth', authRouter);
```

adds `/auth` prefix.

---

# How Express Routing Works

```text
Client Request
      ↓
Express App
      ↓
Matching Router
      ↓
Matching Route
      ↓
Controller Logic
      ↓
Response Sent
```

---

# Recommended Folder Structure

```text
project/
│
├── routes/
│   ├── auth.js
│   ├── user.js
│   └── admin.js
│
├── models/
│   └── user.js
│
├── middleware/
│   └── auth.js
│
├── config/
│   └── database.js
│
├── .env
├── server.js
└── package.json
```

---

# Route Middleware Example

```javascript
authRouter.get('/profile', authMiddleware, async(req, res)=>{
    res.send("Profile");
});
```

Middleware runs before route handler.

---

# Types of Routes

| Method | Purpose |
|---|---|
| GET | Fetch data |
| POST | Create data |
| PUT | Update complete data |
| PATCH | Update partial data |
| DELETE | Delete data |

---

# Example REST APIs

```text
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

---

# Best Practices for Routes

## Keep Route Files Small

Do not place everything in one route file.

---

## Separate Controllers

Move business logic to controller files.

Bad:

```javascript
router.post('/login', huge logic here)
```

Better:

```javascript
router.post('/login', loginController)
```

---

# Example Controller Structure

```text
controllers/
    authController.js
    userController.js
```

---

# Use Middleware Properly

Middleware is useful for:

- Authentication
- Validation
- Logging
- Error handling

---


---
# Conclusion

- Mongoose methods help create reusable database logic.
- Instance methods work on documents.
- Static methods work on models.
- Environment variables protect sensitive data.
- `.env` files improve security and flexibility.
- Express Router helps organize APIs into modular structure.
- Proper project structure is very important for scalable backend applications.
