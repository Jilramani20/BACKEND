# Storing Passwords Securely in a Database

## Why Not Plain Text?

We cannot store passwords in plain text in the database because when a database leaks, attackers can easily get the password of all users.

---

## Evolution of Password Storage

### ❌ Plain Text Storage
```
username | password
---------|----------
alice    | admin123
bob      | password1
```
> **Risk:** Any database breach = instant full compromise of all accounts.

---

### ❌ Simple Encryption
- We can encrypt the password before storing it in the database.
- **But** what if the encryption key is leaked? Attackers can easily decrypt every password since encryption is a **two-way** function.

---

### ⚠️ Hashing (Better, but not enough)
Hashing is a **one-way function**, which means that it is impossible to get the original password from the hash.

```
MD5("admin123") → "0192023a7bbd73250516f069df18b500"
```

**But** most people use weak and common passwords, so attackers use:
- **Dictionary Attacks** — trying a list of common words/passwords.
- **Rainbow Tables** — precomputed hash → plaintext lookup tables.

---

### ✅ Hashing + Salting (The Right Approach)

**Salting** is adding a random string to the password before hashing it.

```
hash("admin123" + "x7Gh!2k") → unique hash every time
```

**Two options for salting:**

| Approach | Same Salt for All Users | Different Salt per User |
|----------|------------------------|------------------------|
| Salt Storage | Stored in a variable/config | Stored in the DB alongside hash |
| Risk if salt leaks | All users crackable at once | Only one user crackable at a time |
| Brute-force resistance | Low — same password = same hash | High — same password = different hash |
| **Recommended?** | ❌ No | ✅ Yes |

**Option 1 (same salt):** If many users share the same password, they all produce the same hash. One crack = all exposed.

**Option 2 (unique salt per user):** Even if the salt is leaked, attackers can only crack **one user at a time**, which is much more secure. The salt can safely be stored in plain text in the database.

---

## bcrypt — The Industry Standard

`bcrypt` handles **salting + hashing** automatically. It is deliberately slow, making brute-force attacks computationally expensive.

### Installation

```bash
npm install bcrypt
```

---

## How bcrypt Works

### Basic Hashing

```javascript
const bcrypt = require('bcrypt');
const password = "admin123";

async function Hashing() {
    const hashpassword = await bcrypt.hash(password, 10);
    console.log(hashpassword);
}
Hashing();
```

> Here `10` is the **cost factor** (salt rounds). It means the hashing algorithm runs `2^10 = 1024` iterations internally.

### Cost Factor Guide

| Rounds | Iterations | Hash Time (approx) | Use Case |
|--------|------------|-------------------|----------|
| 8      | 256        | ~40ms             | Too fast, not recommended |
| 10     | 1,024      | ~100ms            | ✅ Standard (most apps) |
| 12     | 4,096      | ~400ms            | ✅ High security apps |
| 14     | 16,384     | ~1.5s             | Very high security, slower UX |

> We mostly use **10–12 rounds** because our server should be able to handle the load without timing out.

---

## Understanding the bcrypt Hash Output

```javascript
const bcrypt = require('bcrypt');
const password = "admin123";

async function Hashing() {
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    console.log(salt);
    console.log(hashpassword);
}
Hashing();

// Output:
// $2b$10$REHG9OY6/yVfcHmzEmdahu
// $2b$10$REHG9OY6/yVfcHmzEmdahuRkdTk8jkYmWdRfckr2jBxDYvihzntMy
```

### Anatomy of a bcrypt Hash

```
$2b$10$REHG9OY6/yVfcHmzEmdahuRkdTk8jkYmWdRfckr2jBxDYvihzntMy
 ↑   ↑  ←───── 22 chars salt ─────→←──────── 31 chars hash ────────→
 │   │
 │   └── Cost factor (rounds = 10)
 └─────── Version ($2b = bcrypt v2b)
```

| Part | Value | Length | Purpose |
|------|-------|--------|---------|
| Version | `$2b$` | 4 chars | bcrypt algorithm version |
| Cost Factor | `10` | variable | Number of hashing rounds |
| Salt | `REHG9OY6/yVfcHmzEmdahu` | 22 chars | Random salt (Base64 encoded) |
| Hash | `RkdTk8jkYmWdRfckr2jBxDYvihzntMy` | 31 chars | Actual password hash |

> The version and cost factor are stored inside the hash string so that `bcrypt.compare()` knows **which version and how many rounds** to use during verification — without needing a separate configuration.

---

## Verifying a Password

```javascript
const bcrypt = require('bcrypt');
const password = "admin123";

async function Hashing() {
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const ans = await bcrypt.compare(password, hashpassword);
    console.log(ans); // true
}
Hashing();
```

### What happens inside `bcrypt.compare()` ?

```
hashpassword = "$2b$10$REHG9OY6/yVfcHmzEmdahuRkdTk8jkYmWdRfckr2jBxDYvihzntMy"
                                 ↓
            Extracts: version=$2b, rounds=10, salt=REHG9OY6/yVfcHmzEmdahu
                                 ↓
            Runs: bcrypt.hash(inputPassword, "$2b$10$REHG9OY6/yVfcHmzEmdahu")
                                 ↓
            Compares result with stored hash → returns true / false
```

---

## Real-World Integration (Express + MongoDB Example)

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Mongoose model

const router = express.Router();
const SALT_ROUNDS = 10;

// Registration
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash before saving
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

---

## Common Mistakes to Avoid

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Storing plain text passwords | Always hash with bcrypt before saving |
| Using MD5 or SHA1 for passwords | These are fast hashes — use bcrypt/argon2 instead |
| Hashing the password in the frontend | Hash only on the **server** side |
| Using the same salt for all users | bcrypt generates a unique salt per call automatically |
| Using cost factor < 10 | Use 10–12 for a good security/performance balance |
| Comparing hashes with `===` | Always use `bcrypt.compare()` — it handles timing-safe comparison |

---

## bcrypt vs Other Password Hashing Algorithms

| Algorithm | Speed | Salt Support | Memory Hard | Recommended |
|-----------|-------|-------------|-------------|-------------|
| MD5       | Very Fast | ❌ No | ❌ | ❌ Never |
| SHA-256   | Fast | ❌ No | ❌ | ❌ Never for passwords |
| bcrypt    | Slow (configurable) | ✅ Yes | ❌ | ✅ Yes |
| scrypt    | Slow | ✅ Yes | ✅ | ✅ Yes |
| Argon2    | Slow | ✅ Yes | ✅ | ✅ Best (modern) |

> **bcrypt** is the most battle-tested option and works excellently for most Node.js applications. **Argon2** is considered the modern gold standard if you're starting a new project.

---

## Summary

```
User Password
      │
      ▼
 + Random Salt  ──────────────────────────────────┐
      │                                            │
      ▼                                            │
 bcrypt.hash()  (2^rounds iterations)              │
      │                                            │
      ▼                                            ▼
 Stored in DB:  $2b$10$<salt(22)><hash(31)>   [salt embedded]
```

- **Never** store plain text passwords.
- **Never** use fast hashing algorithms (MD5, SHA) for passwords.
- **Always** use `bcrypt.hash()` to store and `bcrypt.compare()` to verify.
- Use a **cost factor of 10–12** for the right balance of security and performance.
- bcrypt **automatically handles** unique salting per user — no extra work needed.
