# <span style="color: red;">JWT Token</span>

- JSON Web Token (JWT)
- In previous lec we learn that after login client just have to send the jwt token so that they don't have to send username and password again and again.
- JWT token is stateless so we don't have to store it in database or in server.
- JWT token = Header.Payload.Signature
- Payload = some data about user like username, email, id etc. user send this with cookie so they don't have to send it with the get request.
- No sensitive data should be stored in payload because it is not encrypted and anyone can decode it.

    ex:
    ```json
    {
        "username": "hetvirani18",
        "email": "hetvirani87@gmail.com"
    }
    ```
- Signature = content's hashcode and encrypt with key of server. here content = header + payload.
- Header = nothing but which algorithm we used and type of token.

    ex:
    ```json
    {
        "alg": "HS256",
        "typ": "JWT"
    }
    ```
- Now when server get the JWT token it get the hashcode of header and payload and encrypt it with key of server and compare it with signature if both are same then it is valid token otherwise it is invalid token.
- Now we know that JWT token is stateless because here we don't have to store the token in database or in server to verify it later.

- Now let's take example of a JWT token:
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30`
- Here header = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
- Here payload = eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0
- Here signature = KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
- Now what you think is header and payload is encrypted?
- No, they are just encoded in base64 and anyone can decode it.
- They are in encoded format because for safe transmission of data we use base64 encoding.

---

## JWT Structure Deep Dive

### Standard Payload Claims (Registered Claims)

JWT defines a set of standard claim names called **registered claims**. These are not mandatory but are recommended for interoperability:

| Claim | Full Name | Description |
|-------|-----------|-------------|
| `iss` | Issuer | Who issued the token (e.g., `"myapp.com"`) |
| `sub` | Subject | Who the token is about (usually user ID) |
| `aud` | Audience | Who the token is intended for |
| `exp` | Expiration Time | Unix timestamp when token expires |
| `nbf` | Not Before | Token is not valid before this time |
| `iat` | Issued At | Unix timestamp when token was issued |
| `jti` | JWT ID | Unique identifier for the token |

Example of a complete payload using registered claims:
```json
{
    "iss": "myapp.com",
    "sub": "64abc123",
    "aud": "myapp-users",
    "exp": 1716239022,
    "iat": 1716235422,
    "email": "hetvirani87@gmail.com",
    "role": "admin"
}
```

---

## Signing Algorithms

JWT supports multiple signing algorithms. The choice of algorithm depends on your security needs:

### Symmetric Algorithms (same key for sign & verify)

- **HS256** – HMAC with SHA-256 (most common, fast, single secret key)
- **HS384** – HMAC with SHA-384
- **HS512** – HMAC with SHA-512

```javascript
// HS256 – same key used to sign and verify
const token = jwt.sign({ _id: user._id }, "supersecretkey", { algorithm: "HS256" });
const payload = jwt.verify(token, "supersecretkey");
```

### Asymmetric Algorithms (different keys for sign & verify)

- **RS256** – RSA Signature with SHA-256 (private key signs, public key verifies)
- **ES256** – ECDSA using P-256 curve (smaller, faster than RSA)

```javascript
// RS256 – sign with private key, verify with public key
const token = jwt.sign({ _id: user._id }, privateKey, { algorithm: "RS256" });
const payload = jwt.verify(token, publicKey);
```

> **When to use RS256?** When your auth server and resource server are **separate services**. The resource server only needs the public key — it can verify tokens without ever having the secret that creates them.

---

## Now new question Do we need expiredate for JWT token?

- You have seen some website in which you automatically logout after some time and you have to login again and some website in which you don't have to login again and again.
- So, it depends on the requirement of the project. If you want to logout user after some time then you can set expiredate for JWT token otherwise you can set it to never expire.
- In JWT token we can set expiredate in payload and when server get the token it check the expiredate if it is expired then it is invalid token otherwise it is valid token.
- You have seen that in some website when you change the password it says do you want to logout from all devices or not now think how this feature is implemented?
- We will discuss this in next lecture.

---

## Access Token vs Refresh Token

In real-world applications, two tokens are often used together:

### Access Token
- Short-lived (e.g., 15 minutes to 1 hour)
- Sent with every API request
- Stored in memory or cookie
- If leaked, damage is limited because it expires quickly

### Refresh Token
- Long-lived (e.g., 7 days to 30 days)
- Stored securely (httpOnly cookie)
- Used **only** to get a new access token when the old one expires
- Should be stored in the database so it can be revoked

```javascript
// Generating both tokens on login
const accessToken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
);

const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
);

// Save refreshToken in DB against the user
await User.findByIdAndUpdate(user._id, { refreshToken });

res.cookie("refreshToken", refreshToken, { httpOnly: true });
res.json({ accessToken });
```

```javascript
// Refresh endpoint – issue a new access token
app.post("/refresh", async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json("No token");

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload._id);
        if (user.refreshToken !== token) return res.status(403).json("Invalid token");

        const newAccessToken = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json("Token expired or invalid");
    }
});
```

---

## JWT vs Session — When to Use What?

| Feature | JWT (Stateless) | Session (Stateful) |
|---------|-----------------|--------------------|
| Storage | Client-side (cookie/localStorage) | Server-side (DB/Redis) |
| Scalability | Easily scales (no shared state) | Needs shared session store |
| Revocation | Hard (must wait for expiry) | Easy (delete from DB) |
| Size | Larger (carries data) | Small (just a session ID) |
| Best for | Microservices, mobile apps, APIs | Traditional web apps |

---

## Now let's go into code

- First we send the JWT token in cookie so how to send anything in cookie?
- We can send anything in cookie by using `res.cookie()` method in express.
```javascript
res.cookie('token', "asljgdfhaskjghas");
```
- and on the client side browser automatically handles everything and also send the cookie with every request to the server.
- Now How do we get the cookie in server?
- We can get the cookie in server by using `req.cookies` object in express.
    ```javascript
    app.get('/info', async (req, res)=>{
        try{
            const result = await User.find({});
            console.log(req.cookies);
            res.send(result);
        }
        catch(err){
            res.status(500).json("Error: " + err);
        }
    })
    ```
- But req.cookies will print undefined because we have to parse them same as we did to the req.body.
- We can use `cookie-parser` library to parse the cookies in express.
- First we have to install the cookie-parser library by using `npm install cookie-parser` command.
- Then we have to use the cookie-parser middleware in our express app.
    ```javascript
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
    ```

Now cookie will be parsed and we can access it by using `req.cookies` object in express.

- Now let's see how to create JWT token and send it in cookie.
- We can create JWT token by using `jsonwebtoken` library in nodejs.
- First we have to install the jsonwebtoken library by using `npm install jsonwebtoken` command.
- Then we have to require the jsonwebtoken library in our code.
    ```javascript
    const jwt = require('jsonwebtoken');
    ```
- Now we can create JWT token by using `jwt.sign()` method in jsonwebtoken library.
    ```javascript
    const token = jwt.sign({_id: user._id, email: user.email}, "supersecretkey");
    ```
- can also add expiredate in payload by using `expiresIn` option in `jwt.sign()` method.
    ```javascript
    const token = jwt.sign({_id: user._id, email: user.email}, "supersecretkey", {expiresIn: '1h'});
    ```
- Here we are creating JWT token by passing the payload and secret key to the `jwt.sign(payload, key)` method.
- Now we can send this token in cookie by using `res.cookie()` method in express.
    ```javascript
    res.cookie('token', token);
    ```
- Now we have to verify the JWT token when we get the request from client.
- We can verify the JWT token by using `jwt.verify()` method in jsonwebtoken library.
    ```javascript
    app.get('/info', async (req, res)=>{
        try{
            //verify token
            const payload = jwt.verify(req.cookies.token, "supersecretkey");
            console.log(payload);
            const result = await User.find({});
            res.send(result);
        }
        catch(err){
            res.status(500).json("Error: " + err);
        }
    })
    ```
- Here it will return the payload if the token is valid otherwise it will throw an error if the token is invalid or expired.
- Now with the payload we can get the user information from database and send it to the client.

---

## JWT Auth Middleware (Best Practice)

Instead of writing JWT verification logic in every route, create a **reusable middleware**:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // attach user info to request
        next();             // move to the actual route handler
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please login again." });
        }
        return res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;
```

```javascript
// Using the middleware in routes
const authMiddleware = require('./middleware/auth');

// Apply to a single route
app.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
});

// Apply to all routes in a router
router.use(authMiddleware);
```

---

## Cookie Security Options

When sending JWT in a cookie, always set these security options in production:

```javascript
res.cookie('token', token, {
    httpOnly: true,   // JS in browser CANNOT read this cookie (prevents XSS attacks)
    secure: true,     // Cookie only sent over HTTPS
    sameSite: 'Strict', // Prevents CSRF attacks (cookie not sent on cross-site requests)
    maxAge: 3600000   // Cookie lifetime in milliseconds (1 hour)
});
```

| Option | What it does | Why it matters |
|--------|-------------|----------------|
| `httpOnly` | Blocks JS access | Prevents XSS stealing the token |
| `secure` | HTTPS only | Prevents interception on HTTP |
| `sameSite` | Controls cross-origin sending | Prevents CSRF attacks |
| `maxAge` | Auto-expires cookie | Logs user out after inactivity |

---

## Common JWT Errors and How to Handle Them

```javascript
try {
    const payload = jwt.verify(token, secret);
} catch (err) {
    if (err.name === "TokenExpiredError") {
        // Token was valid but has expired
        return res.status(401).json({ message: "Session expired. Please login again." });
    }
    if (err.name === "JsonWebTokenError") {
        // Token is malformed or signature doesn't match
        return res.status(403).json({ message: "Invalid token." });
    }
    if (err.name === "NotBeforeError") {
        // Token used before its nbf time
        return res.status(403).json({ message: "Token not yet active." });
    }
}
```

---

## JWT Security Best Practices

1. **Never store JWT in `localStorage`** — it is accessible to JavaScript and vulnerable to XSS. Always prefer `httpOnly` cookies.
2. **Always use environment variables for secrets** — never hardcode `"supersecretkey"` in production code.
   ```javascript
   // Bad
   jwt.sign(payload, "supersecretkey");

   // Good
   jwt.sign(payload, process.env.JWT_SECRET);
   ```
3. **Always set `expiresIn`** — tokens with no expiry are a security risk.
4. **Keep payload small** — JWT is sent with every request. Storing too much data increases bandwidth usage.
5. **Rotate secrets periodically** — if a secret is compromised, all tokens signed with it must be considered invalid.
6. **Use HTTPS in production** — JWT in cookies sent over HTTP can be intercepted.
7. **Implement token blacklisting for logout** — since JWT is stateless, add a short-lived blacklist (in Redis) to invalidate tokens before they expire.

---

## JWT Logout — How to Properly Logout?

Since JWT is **stateless**, the server doesn't store the token anywhere. This means simply deleting the cookie on the client side is the simplest approach, but not the most secure. Here are the patterns:

### Pattern 1: Clear the Cookie (Simple)
```javascript
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out successfully" });
});
```
> Problem: If someone copied the token, it still works until it expires.

### Pattern 2: Token Blacklist (Secure)
Store invalidated tokens in Redis until their expiry time:
```javascript
const redis = require('redis');
const client = redis.createClient();

app.post('/logout', async (req, res) => {
    const token = req.cookies.token;
    const payload = jwt.decode(token);

    // Blacklist the token until its natural expiry
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    await client.setEx(`blacklist_${token}`, ttl, "true");

    res.clearCookie('token');
    res.json({ message: "Logged out" });
});

// In auth middleware, check blacklist
const isBlacklisted = await client.get(`blacklist_${token}`);
if (isBlacklisted) return res.status(401).json({ message: "Token revoked" });
```

### Pattern 3: Refresh Token Rotation (Logout from All Devices)
- Store refresh tokens in the database
- On "logout from all devices", delete all refresh tokens for that user
- Existing access tokens expire naturally (which is why short expiry matters)

---

## Full Auth Flow Diagram

```
Client                          Server
  |                               |
  |--- POST /login (credentials)->|
  |                               |-- Verify credentials
  |                               |-- Create JWT token
  |<-- Set-Cookie: token=JWT -----|
  |                               |
  |--- GET /profile (cookie) ---->|
  |                               |-- Parse cookie
  |                               |-- jwt.verify(token)
  |                               |-- Extract user from payload
  |<-- 200 OK (user data) --------|
  |                               |
  |--- POST /logout ------------->|
  |                               |-- clearCookie
  |<-- 200 OK ------------------  |
```
