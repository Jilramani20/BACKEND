# <span style ="color:blue">Ratelimiting</span>

## Introduction

Rate Limiting is a technique used in backend systems to control how many requests a user or client can make to a server within a specific time period.

It acts like a traffic controller for APIs and servers. Without rate limiting, a malicious user or bot can continuously send requests and overload the server, causing slow performance or complete downtime.

Rate limiting is one of the most important security and performance mechanisms used in modern web applications.

---

# Why Do We Need Rate Limiting?

## 1. Protection Against DOS Attacks

A DOS (Denial of Service) attack happens when a single system sends a huge number of requests to a server to make it unavailable.

The server resources such as:
- CPU
- RAM
- Database connections
- Network bandwidth

can become exhausted.

Rate limiting blocks excessive requests and protects the server from crashing.

---

## 2. Protection Against DDOS Attacks

A DDOS (Distributed Denial of Service) attack is similar to DOS, but requests come from multiple systems or bots instead of one machine.

These attacks are more dangerous because:
- Thousands of systems attack simultaneously
- Requests appear to come from different IP addresses
- Detection becomes difficult

Rate limiting helps reduce the impact of these attacks by limiting request frequency.

---

## 3. Prevent API Abuse

Without limits, users may:
- Spam requests
- Continuously refresh APIs
- Scrape data
- Abuse free resources

Rate limiting ensures fair usage for everyone.

---

## 4. Improve Server Stability

When requests are controlled:
- Server load becomes predictable
- Database pressure decreases
- Response time improves
- Resources are distributed fairly

---

## 5. Reduce Infrastructure Cost

Cloud services charge based on:
- CPU usage
- Memory usage
- Network bandwidth

Limiting unnecessary requests reduces operational costs.

---

# How Rate Limiting Works Internally

The server tracks requests from users.

For every incoming request:
1. Identify the user
2. Check how many requests they already made
3. Compare against the allowed limit
4. Allow or reject the request

If the user exceeds the allowed limit, the server returns an error response such as:

```http
429 Too Many Requests
```

---

# How Users Are Identified

The server must identify who is sending the request.

## Common Identification Methods

### 1. User ID
Used when the user is logged in.

Example:
- Email
- Database ID
- JWT token ID

---

### 2. IP Address
Used when the user is not logged in.

Every internet request contains:
- Source IP address
- Destination IP address

The server can read the IP address from request headers.

---

# Why Redis Is Used in Rate Limiting

Rate limiting requires:
- Fast read/write operations
- Temporary storage
- Expiration support
- High performance

Redis is ideal because:
- It stores data in memory
- It is extremely fast
- Supports automatic expiration (TTL)
- Supports atomic operations

---

# Important Redis Concepts

## 1. Key

A key identifies a user.

Example:

```text
192.168.1.10
```

---

## 2. Value

Stores:
- Number of requests
- Timestamp
- Metadata

---

## 3. TTL (Time To Live)

TTL defines how long data should exist.

After TTL expires:
- Redis automatically deletes the key

This helps reset request counters automatically.

---

# Types of Rate Limiting Algorithms

There are multiple rate limiting strategies.

The most common are:

1. Token Bucket
2. Fixed Window
3. Sliding Window
4. Leaky Bucket

---

# 1. Token Bucket Algorithm

## Concept

Imagine a bucket filled with tokens.

Every request requires one token.

If a token is available:
- Request is allowed

If no token is available:
- Request is rejected

---

# Internal Working

## Step-by-Step Process

### Step 1
The server creates a bucket with limited tokens.

Example:

```text
Bucket Capacity = 100 tokens
```

---

### Step 2
A user sends a request.

---

### Step 3
The server removes one token from the bucket.

---

### Step 4
The request is processed.

---

### Step 5
Tokens refill gradually over time.

---

# Advantages

- Allows temporary bursts of traffic
- Flexible
- Smooth traffic handling

---

# Disadvantages

One user may consume all tokens.

Other users may get blocked even if they made no requests.

This creates unfair resource distribution.

---

# 2. Fixed Window Algorithm

## Concept

The server counts requests inside a fixed time interval.

Example:
- 60 requests per hour

At the end of the hour:
- Counter resets

---

# Internal Working

## Step-by-Step Process

### Step 1
User sends a request.

---

### Step 2
Server checks Redis for user's key.

Example:

```text
IP → Request Count
```

---

### Step 3
If key does not exist:
- Create new key
- Set request count = 1
- Set TTL

---

### Step 4
If key exists:
- Increase request count

---

### Step 5
If request count exceeds limit:
- Reject request

---

### Step 6
When TTL expires:
- Redis deletes key automatically

---

# Example

Limit:

```text
60 requests per hour
```

Scenario:
- User makes 1 request at 12:00
- Makes 59 more requests at 12:59

Total = 60 requests

Now at 1:00:
- Window resets
- User can again make 60 requests immediately

Result:
- 120 requests in very short time

This creates traffic spikes.

---

# Problem With Fixed Window

Fixed windows create boundary problems.

Traffic can become uneven because counters reset suddenly.

---

# 3. Sliding Window Algorithm

## Concept

Sliding Window solves the fixed window problem.

Instead of resetting counters suddenly, it continuously tracks requests over rolling time intervals.

---

# Internal Working

The server stores timestamps of requests.

For every new request:
1. Remove old timestamps outside the window
2. Count remaining timestamps
3. Compare against limit
4. Allow or reject request

---

# Example

Limit:

```text
60 requests per hour
```

If user already made:
- 59 requests between 12:01 and 1:00

Then at 1:01:
- Only 1 additional request should be allowed

This creates smoother traffic control.

---

# Advantages

- More accurate
- Fair distribution
- Prevents burst abuse

---

# Disadvantages

- More memory usage
- More computation required

---

# Delay Between Consecutive Requests

Sometimes limiting total requests is not enough.

We may also want:
- Minimum delay between requests

Example:
- User can send only one request every 10 seconds

---

# Why This Is Needed

Without delay:
- Bots can spam continuously
- Brute force attacks become easier
- APIs may still experience sudden spikes

---

# Internal Working

The server stores:
- Last request timestamp

When a new request arrives:
1. Get current time
2. Compare with previous request time
3. Calculate time difference

If difference is smaller than allowed delay:
- Reject request

Otherwise:
- Process request
- Update timestamp

---

# Combining Count and Timestamp

Sometimes both are stored together:
- Request count
- Last request time

This allows:
- Total request limiting
- Delay enforcement simultaneously

---

# Real-World Use Cases

## 1. Login APIs

Prevents:
- Brute force password attacks

---

## 2. OTP APIs

Stops:
- Continuous OTP generation

---

## 3. Payment Systems

Prevents:
- Repeated payment attempts

---

## 4. Public APIs

Ensures:
- Fair usage among developers

---

## 5. AI APIs

Protects:
- Expensive AI resources from abuse

---

# Problems With IP-Based Tracking

IP tracking is simple but has limitations.

---

# Shared Network Problem

In places like:
- Colleges
- Offices
- Cafes
- Hostels

many users share the same public IP address.

If one user exceeds the limit:
- Everyone using that network may get blocked

This creates unfair restrictions.

---

# Other Problems With IP Tracking

## 1. VPN Usage

Users can change IP addresses easily.

---

## 2. Dynamic IP Addresses

Internet providers may change user IPs frequently.

---

## 3. NAT (Network Address Translation)

Many devices may appear under one public IP.

---

# Better Alternatives

Instead of only IP:
- User authentication
- API keys
- Device fingerprinting
- Session IDs
- JWT tokens

can be used for more accurate tracking.

---

# HTTP Response for Rate Limiting

When rate limit exceeds, server usually returns:

```http
429 Too Many Requests
```

Additional headers may also be included:

```http
Retry-After
X-RateLimit-Limit
X-RateLimit-Remaining
```

These help clients know:
- Remaining requests
- Reset time

---

# Best Practices

## 1. Use Redis

Because it is fast and supports TTL.

---

## 2. Use Sliding Window

It provides smoother traffic control.

---

## 3. Apply Different Limits

Examples:
- Login API → strict limits
- Public API → moderate limits
- Internal API → relaxed limits

---

## 4. Combine Multiple Techniques

Use:
- Rate limiting
- Captcha
- Authentication
- Firewall
- DDOS protection

together.

---

# Conclusion

Rate Limiting is a critical backend security and performance mechanism.

It helps:
- Prevent DOS/DDOS attacks
- Protect APIs
- Reduce spam
- Ensure fair usage
- Improve server stability

Different algorithms solve different problems:
- Token Bucket allows controlled bursts
- Fixed Window is simple but less accurate
- Sliding Window provides smoother control

Redis is commonly used because of:
- High speed
- In-memory storage
- TTL support

Modern applications rely heavily on rate limiting to maintain security, reliability, and scalability.
## Why need Ratelimiting?
- Protect the system from DOS or DDOS attack.

## How to implement Ratelimiting?
### Token Bucket
- There will be a token bucket, which has number of tokens.
- When user make a request, it will take a token from the bucket and then comes to the server. after request is processed, the token will be put back to the bucket.
- If server receives a request without token, it will reject the request.
- Now the problem is that if one user take all the tokens, other users will not be able to access the server. 

### Individual Tracking (Fixed Window)
- Now what if we make something which treaks the number of requests from each user.
- How to identify the user? If they have logged in the server we can use email or id but if they are not logged in, we can use their IP address.
- How will we get the IP address? It's super easy, it is already stored in the header of the request becasue each packet has source and destination IP address. So we can use that to identify the user.
- We can store this is redis.
- Ip as a key and value number of request and ttl (total time to live).
- Now when user make a new request server will check if this ip address exists then increase the value by 1 and if the value is greater than the limit then reject the request. and it will be automatically deleted after ttl time.  and if the ip address does not exist then create a new key with value 1 and ttl time.
- Now imagine we set the limit to 60 requests per hour, user make 1 request at 12: 00 and then make 59 more request at 12: 59, now user can make 60 more request at 1:01 because the ttl time will be reset after 1 hour. so this is the problem with fixed window. here user made 119 request in 2 minutes which is not good.
- It should have allowed only 1 request at 1:01 beacuse between 12:01 to 1:00 there is already 59 request.
- To solve this we will use sliding window in next lecture.

### How to set limit between 2 consecutive request? 
- I mean we want to implement that user can make 60 requests per Hour and if user make 1 request then he can make next request after 10 seconds.
- We can just add a new field in redis which will store the timestamp of the last request. and when user make a new request we will check if the current timestamp - last request timestamp is less than 10 seconds then reject the request otherwise process the request and update the last request timestamp.
- Now how to store the timestamp and the number of request both in redis?
- We can store it in `count:time` this way and this will be string. and to split we can just use `str.split(":").map(number)` this will return array of number and we can get the count and time from that array .map(number) will convert the string to number.

### Let's implement fixed window in code.
```javascript
const redisClient = require('../config/redis');

//inc function increase the value by 1 and if the key not exists then set it to 1 and return count

const rateLimiter = async (req, res, next) => {
    try{
        const ip = req.ip;

        const count = await redisClient.incr(ip);

        if(count==1) await redisClient.expire(ip, 3600);

        if(count>60) throw new Error("user limit exceeded");

        next();

    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

module.exports = rateLimiter;
```
- and we can use this middleware in our server.js file like this:
    ```javascript
    const express = require('express');
    const rateLimiter = require('./middlewares/rateLimiter');
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use(rateLimiter);
    ```

## now lets implement deplay between 2 consecutive request.
```javascript
const rateLimiter = async (req, res, next) => {
    try{
        const ip = req.ip;
        
        const data = await redisClient.get(ip);
        if(!data){
            await redisClient.set(ip, `1:${Date.now()/1000}`, { EX: 3600 });
        }
        else{
            const [count, lastTime] = data.split(":").map(Number);
            console.log(count);

            if(Date.now()/1000 - lastTime <10) throw new Error("wait a little bit before making another request");
            if(count>=10) throw new Error("user limit exceeded");

            await redisClient.set(ip, `${count+1}:${Date.now()/1000}`, { EX: 3600 });
        }
        next();
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}
```

## One problem with tracking with ip
- There is a problem like in colleges all are connected to same wifi so all has same ip so if one user exusts the limit then all other user will not be able to access the server.
- we will learn later how to solve this problem.

