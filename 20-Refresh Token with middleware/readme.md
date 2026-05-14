# <span style="color: #ff0000;">Refresh Token</span>

- Not every server uses refresh tokens.
- Refresh tokens are mainly used in applications where authentication and security are very important.
- Examples: Instagram, LinkedIn, Google, Banking Apps, Facebook, etc.

---

# Access Token vs Refresh Token

| Feature | Access Token | Refresh Token |
|---|---|---|
| Purpose | Access protected APIs | Generate new access token |
| Expire Time | Short (15 min - 1 hour) | Long (7 days - months) |
| Database Check | Usually No | Usually Yes |
| Sent Frequently | Yes | Rarely |
| Security Risk | Medium | High |
| Stored In | Memory / Cookie | Secure HTTP-only Cookie |

---

# Why We Need Refresh Token?

- The token that we learned previously is called an **Access Token**.
- Suppose you log in to websites like Instagram or LinkedIn.
- Even after closing the browser, you usually do not need to log in again.

You may think:

> "Maybe their JWT token never expires."

But that is wrong.

If JWT tokens never expire, then it becomes a very big security problem.

---

## Problem Without Expiration

Suppose:

- Your JWT token gets stolen by a hacker.
- If the token never expires:
  - Hacker can access your account forever.
  - Even changing password may not help immediately.
  - User account becomes highly insecure.

So to solve this problem:

- We set expiration time in JWT access token.

Example:

- 15 minutes
- 30 minutes
- 1 hour
- 1 day

Now even if someone steals the token:

- It becomes useless after expiration.

This improves security.

---

## New Problem After Expiration

Now another problem appears.

After access token expires:

- User has to login again and again.
- This creates a bad user experience.

Imagine:

- Every 30 minutes Instagram asks you to login again.

That would be very annoying.

So to solve this issue we use:

# Refresh Token

---

# What is Refresh Token?

- Refresh token is a special token used to create a new access token.
- It has a much longer expiry time compared to access token.
- Access token is used to access APIs.
- Refresh token is only used to generate new access tokens.

---

# How Refresh Token Works?

## Step-by-Step Flow

### 1. User Login

When user logs in:

Server creates:

- Access Token
- Refresh Token

Then server sends both tokens to client.

---

### 2. Access Token Used

- Client uses access token for API requests.
- Access token works until expiration.

Example:

```js
Access Token Expire Time = 15 minutes
```

---

### 3. Access Token Expires

After expiration:

- API requests fail with `401 Unauthorized`.

Now client sends refresh token to server.

---

### 4. Server Verifies Refresh Token

Server checks:

- Is refresh token valid?
- Is refresh token expired?
- Is refresh token موجود in database?
- Is token revoked?

If valid:

- Server creates new access token.
- Sometimes server also creates new refresh token.

---

# Rotating Refresh Token

In rotating refresh token:

Every time client sends refresh token:

Server creates:

- New Access Token
- New Refresh Token

And old refresh token becomes invalid.

---

## Why Rotating Refresh Token is More Secure?

Suppose hacker steals refresh token.

If legitimate user uses refresh token first:

- Old refresh token becomes invalid.
- Hacker cannot use stolen token anymore.

This greatly improves security.

---

## Flow of Rotating Refresh Token

```text
Login
   ↓
Access Token + Refresh Token
   ↓
Access Token Expires
   ↓
Send Refresh Token
   ↓
Server Creates:
   - New Access Token
   - New Refresh Token
   ↓
Old Refresh Token Invalid
```

---

# Non-Rotating Refresh Token

In non-rotating refresh token:

- Server only creates new access token.
- Same refresh token continues to work until expiry.

Example:

```text
Refresh Token Expire Time = 7 Days
```

After 7 days:

- User must login again.

---

# Rotating vs Non-Rotating Refresh Token

| Feature | Rotating | Non-Rotating |
|---|---|---|
| Security | Higher | Lower |
| Complexity | More | Less |
| Database Calls | More | Less |
| User Experience | Better | Good |
| Token Reuse Detection | Possible | Hard |

---

# What If Refresh Token Gets Stolen?

Now suppose hacker steals refresh token.

This is dangerous because:

- Refresh token lives longer.
- Hacker can continuously create new access tokens.

So refresh token security is extremely important.

---

# How We Protect Refresh Tokens?

## 1. Store Refresh Token in Database

Usually:

- Random string is created.
- Information stored in database:

```text
- User ID
- Expire Date
- Device Information
- IP Address (sometimes)
- Token Version
```

---

## 2. Validate Refresh Token

Whenever client sends refresh token:

Server checks database:

- Token exists?
- Token expired?
- Token revoked?
- Device matches?

Only then new access token is created.

---

## 3. Invalidate Refresh Token

If user:

- Changes password
- Logs out
- Reports suspicious activity

Server can:

- Delete refresh token from database.
- Mark token as revoked.

Now old refresh token becomes invalid immediately.

---

# Device Based Refresh Token

Sometimes servers store:

- Browser information
- Device ID
- IP Address

with refresh token.

This allows:

- One refresh token per device.
- User can logout from one device only.
- Better security monitoring.

Example:

```text
Chrome on Windows
iPhone Safari
Android App
```

All devices can have separate refresh tokens.

---

# Why We Hash Refresh Tokens?

We should never store refresh tokens in plain text.

Instead:

- Hash refresh token before storing in database.

Example:

```text
Original Token → Hash → Store in DB
```

Same as password hashing.

---

## Why Hashing is Important?

Suppose database gets leaked.

If tokens are stored in plain text:

- Hacker can directly use them.

If hashed:

- Hacker cannot easily recover original tokens.

This improves security.

---

# Best Place to Store Tokens

## Access Token

Usually stored in:

- Memory
- Short-lived cookies

---

## Refresh Token

Usually stored in:

- HTTP-only Secure Cookies

Why?

Because JavaScript cannot access HTTP-only cookies.

This helps prevent:

- XSS attacks

---

# Access Token Lifetime Best Practice

Recommended:

| Token | Expiry |
|---|---|
| Access Token | 15 min - 1 hour |
| Refresh Token | 7 days - 30 days |

---

# Common Security Risks

## 1. XSS Attack

Malicious JavaScript steals tokens.

Solution:

- Use HTTP-only cookies.

---

## 2. Token Replay Attack

Attacker reuses stolen refresh token.

Solution:

- Rotating refresh tokens.

---

## 3. Database Leak

Refresh tokens stolen from database.

Solution:

- Hash refresh tokens.

---

## 4. CSRF Attack

Attacker forces browser to send request.

Solution:

- CSRF tokens
- SameSite cookies

---

# Logout Flow

When user logs out:

Server should:

- Delete refresh token from database.
- Clear cookies from browser.

Now refresh token cannot be reused.

---

# Simple Authentication Flow

```text
User Login
   ↓
Server Creates:
   - Access Token
   - Refresh Token
   ↓
Client Stores Tokens
   ↓
Access Token Used For APIs
   ↓
Access Token Expires
   ↓
Client Sends Refresh Token
   ↓
Server Validates Refresh Token
   ↓
New Access Token Created
```

---

# Important Notes

- Access tokens should always have short expiry.
- Refresh tokens should be stored securely.
- Refresh tokens should be hashed in database.
- Rotating refresh tokens are more secure.
- HTTP-only cookies are recommended.
- Refresh tokens increase database calls.
- High-security applications mostly use refresh tokens.

---

# Conclusion

- Access token provides authentication for APIs.
- Refresh token improves user experience without reducing security.
- Short-lived access tokens protect users if tokens are stolen.
- Refresh tokens help users stay logged in.
- Proper implementation of refresh tokens is extremely important for secure authentication systems.
