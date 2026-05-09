# 🛡️ Data Sanitization & Schema Validation in MongoDB

> A complete backend developer's guide to keeping your MongoDB data clean, safe, and structurally sound.

---

## 📚 Table of Contents

1. [Why This Matters](#-why-this-matters)
2. [The Big Picture — Layered Defense](#-the-big-picture--layered-defense)
3. [Part 1 — MongoDB Built-in Schema Validation](#part-1--mongodb-built-in-schema-validation)
   - [JSON Schema Validator](#json-schema-validator)
   - [Validation Levels & Actions](#validation-levels--actions)
   - [Updating Validation Rules](#updating-validation-rules)
4. [Part 2 — Mongoose Schema Validation](#part-2--mongoose-schema-validation)
   - [Defining a Schema](#defining-a-schema)
   - [Built-in Validators](#built-in-validators)
   - [Custom Validators](#custom-validators)
   - [Nested Schemas & Arrays](#nested-schemas--arrays)
   - [Schema Options](#schema-options)
5. [Part 3 — Data Sanitization](#part-3--data-sanitization)
   - [What is Sanitization?](#what-is-sanitization)
   - [Sanitizing with express-validator](#sanitizing-with-express-validator)
   - [Preventing NoSQL Injection](#preventing-nosql-injection)
   - [Sanitizing with mongo-sanitize](#sanitizing-with-mongo-sanitize)
   - [XSS Prevention](#xss-prevention)
6. [Part 4 — Joi for Request Validation](#part-4--joi-for-request-validation)
7. [Part 5 — Zod for Schema Validation (TypeScript-first)](#part-5--zod-for-schema-validation-typescript-first)
8. [Part 6 — Real-World Patterns](#part-6--real-world-patterns)
   - [Validation Middleware Pattern](#validation-middleware-pattern)
   - [Service Layer Sanitization](#service-layer-sanitization)
   - [Complete User Registration Example](#complete-user-registration-example)
9. [Part 7 — Common Vulnerabilities & How to Prevent Them](#part-7--common-vulnerabilities--how-to-prevent-them)
10. [Part 8 — Validation vs Sanitization — Quick Reference](#part-8--validation-vs-sanitization--quick-reference)
11. [Tools & Libraries Cheatsheet](#-tools--libraries-cheatsheet)
12. [Best Practices Checklist](#-best-practices-checklist)

---

## 🔥 Why This Matters

When building a backend, **never trust user input**. Raw data coming from HTTP requests can be:

- **Malformed** — wrong types, missing fields, wrong formats
- **Malicious** — NoSQL injection, XSS payloads, operator abuse (`$where`, `$gt`, etc.)
- **Inconsistent** — leading/trailing spaces, mixed cases, invalid enums

Without proper validation and sanitization, your database becomes a chaos of bad data — and your app becomes a security liability.

```
User Input  →  [Sanitize]  →  [Validate]  →  [Store in MongoDB]
                  ↑                ↑
         Strip bad chars      Enforce rules
         Normalize data       Check types/ranges
         Prevent injection    Reject bad shape
```

---

## 🏗️ The Big Picture — Layered Defense

Good backend apps enforce validation at **multiple layers**:

| Layer | Tool | Purpose |
|---|---|---|
| HTTP Request | `express-validator` / `Joi` / `Zod` | Validate & sanitize incoming request data |
| Application (ODM) | `Mongoose` Schema | Enforce structure before hitting DB |
| Database | MongoDB JSON Schema Validator | Last line of defense at DB level |

Each layer catches what the previous might miss. **Never rely on just one.**

---

## Part 1 — MongoDB Built-in Schema Validation

MongoDB (since v3.6) supports **JSON Schema validation** natively. This runs at the database level — even raw `mongosh` queries must pass it.

### JSON Schema Validator

```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "User Object Validation",
      required: ["name", "email", "age", "role"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 2,
          maxLength: 50,
          description: "'name' must be a string between 2–50 chars and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "'email' must be a valid email address"
        },
        age: {
          bsonType: "int",
          minimum: 18,
          maximum: 120,
          description: "'age' must be an integer between 18 and 120"
        },
        role: {
          bsonType: "string",
          enum: ["user", "admin", "moderator"],
          description: "'role' must be one of: user, admin, moderator"
        },
        phone: {
          bsonType: "string",
          pattern: "^\\+?[1-9]\\d{9,14}$",
          description: "'phone' must be a valid phone number (optional)"
        },
        address: {
          bsonType: "object",
          required: ["city", "country"],
          properties: {
            street: { bsonType: "string" },
            city:   { bsonType: "string" },
            country: {
              bsonType: "string",
              minLength: 2,
              maxLength: 2,
              description: "ISO 3166-1 alpha-2 country code (e.g., 'IN', 'US')"
            },
            pincode: { bsonType: "string" }
          }
        }
      }
    }
  }
});
```

### Validation Levels & Actions

MongoDB gives you control over **when** validation runs and **what happens** on failure.

```js
db.createCollection("products", {
  validator: { /* ...schema... */ },

  // validationLevel controls which documents are checked:
  // "strict"  → ALL inserts and updates are validated (default, recommended)
  // "moderate" → Only new inserts + updates to VALID existing docs are checked
  validationLevel: "strict",

  // validationAction controls what happens when validation fails:
  // "error" → Reject the write operation entirely (default, recommended)
  // "warn"  → Allow the write but log a warning (use only for migrations)
  validationAction: "error"
});
```

> ⚠️ **Pro Tip:** Always use `validationLevel: "strict"` and `validationAction: "error"` in production. The `"warn"` mode is only useful when migrating existing dirty data.

### Updating Validation Rules

You can modify validation on existing collections without dropping them:

```js
db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "age", "role", "createdAt"],
      properties: {
        // ...updated properties...
        createdAt: {
          bsonType: "date",
          description: "'createdAt' is now required"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
```

To view existing validation rules:

```js
db.getCollectionInfos({ name: "users" })
// Look for the 'options.validator' field in the output
```

---

## Part 2 — Mongoose Schema Validation

[Mongoose](https://mongoosejs.com/) is the most popular ODM (Object Document Mapper) for MongoDB + Node.js. It adds a rich validation layer **before** data ever reaches MongoDB.

### Defining a Schema

```js
// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,                // removes leading/trailing whitespace
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,           // auto-converts to lowercase before saving
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false              // never returned in queries by default
    },

    age: {
      type: Number,
      min: [18, 'Age must be at least 18'],
      max: [120, 'Age cannot exceed 120']
    },

    role: {
      type: String,
      enum: {
        values: ['user', 'admin', 'moderator'],
        message: 'Role must be one of: user, admin, moderator'
      },
      default: 'user'
    },

    isActive: {
      type: Boolean,
      default: true
    },

    website: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,            // auto-adds createdAt and updatedAt
    versionKey: false            // disables the __v field
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
```

### Built-in Validators

Mongoose ships with validators for every type — here's the full picture:

```js
const productSchema = new Schema({

  // --- String validators ---
  title: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,     // auto-uppercases
    lowercase: true,     // auto-lowercases (don't use with uppercase)
    minlength: 3,
    maxlength: 100,
    match: /^[a-zA-Z0-9\s]+$/
  },

  // --- Number validators ---
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
    max: [1000000, 'Price cannot exceed 10 lakh']
  },

  // --- Date validators ---
  expiresAt: {
    type: Date,
    min: new Date(),    // must be in the future
  },

  // --- Enum validator ---
  category: {
    type: String,
    enum: ['electronics', 'clothing', 'food', 'books', 'other'],
    required: true
  },

  // --- Array with limits ---
  tags: {
    type: [String],
    validate: {
      validator: (arr) => arr.length <= 10,
      message: 'A product can have at most 10 tags'
    }
  }
});
```

### Custom Validators

When built-ins aren't enough, write your own:

```js
const userSchema = new Schema({

  username: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Only alphanumeric + underscore, no spaces
        return /^[a-zA-Z0-9_]{3,20}$/.test(v);
      },
      message: props =>
        `${props.value} is not a valid username. Use 3-20 chars: letters, numbers, underscores only.`
    }
  },

  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{9,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`
    }
  },

  // Async custom validator (e.g., check uniqueness via DB query)
  referralCode: {
    type: String,
    validate: {
      isAsync: true,
      validator: async function(code) {
        const count = await mongoose.model('User').countDocuments({ referralCode: code });
        return count === 0; // must be unique
      },
      message: 'Referral code already in use'
    }
  }
});
```

### Nested Schemas & Arrays

```js
// Reusable sub-schema
const addressSchema = new Schema({
  street:  { type: String, trim: true },
  city:    { type: String, required: true, trim: true },
  state:   { type: String, trim: true },
  pincode: {
    type: String,
    required: true,
    match: [/^\d{6}$/, 'Indian pincode must be 6 digits']
  },
  country: { type: String, default: 'India' }
}, { _id: false }); // _id: false → no separate _id for sub-document

const orderSchema = new Schema({
  user:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shippingAddress: { type: addressSchema, required: true },

  items: [
    {
      product:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1, max: 100 },
      price:    { type: Number, required: true, min: 0 }
    }
  ],

  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });
```

### Schema Options

```js
const schema = new Schema({ /* ... */ }, {
  timestamps: true,        // auto createdAt + updatedAt
  versionKey: false,       // removes __v
  strict: true,            // (default) ignores fields not in schema
                           // set to false to allow any fields (not recommended)
  toJSON: {
    virtuals: true,        // include virtual fields in JSON output
    transform(doc, ret) {
      delete ret.password; // never expose password in JSON
      delete ret.__v;
      return ret;
    }
  }
});
```

---

## Part 3 — Data Sanitization

**Sanitization** is the process of cleaning and normalizing data — stripping dangerous content, normalizing formats, and removing unexpected characters.

### What is Sanitization?

```
Raw Input:   "  <script>alert('xss')</script>  "
After Trim:  "<script>alert('xss')</script>"
After Strip: "alert('xss')"          ← basic strip (not enough)
After Escape: "&lt;script&gt;..."    ← safer approach
```

### Sanitizing with express-validator

```bash
npm install express-validator
```

```js
// validators/userValidator.js
const { body, validationResult } = require('express-validator');

const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters')
    .escape(),                   // converts <, >, & to HTML entities

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),           // lowercases, removes dots in gmail, etc.

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Must contain at least one number')
    .matches(/[!@#$%^&*]/).withMessage('Must contain at least one special character'),

  body('age')
    .optional()
    .isInt({ min: 18, max: 120 }).withMessage('Age must be between 18 and 120')
    .toInt(),                    // converts string "25" to integer 25

  body('role')
    .optional()
    .isIn(['user', 'admin', 'moderator']).withMessage('Invalid role'),

  body('website')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] }).withMessage('Must be a valid URL')
];

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

module.exports = { registerValidationRules, validate };
```

### Preventing NoSQL Injection

NoSQL injection is a critical MongoDB-specific vulnerability. An attacker sends:

```json
{
  "email": { "$gt": "" },
  "password": { "$gt": "" }
}
```

This matches **every user** in the DB — bypassing login completely!

#### The Attack

```js
// ❌ VULNERABLE — directly using req.body
const user = await User.findOne({
  email: req.body.email,       // attacker sends { "$gt": "" }
  password: req.body.password  // bypasses auth
});
```

#### The Fix with express-mongo-sanitize

```bash
npm install express-mongo-sanitize
```

```js
// app.js — apply GLOBALLY as early middleware
const mongoSanitize = require('express-mongo-sanitize');

app.use(express.json());
app.use(mongoSanitize({
  replaceWith: '_',       // replaces $ and . with _
  // OR use onSanitize callback to log attempts:
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ Sanitized key: ${key} from ${req.ip}`);
  }
}));
```

After sanitization, `{ "$gt": "" }` becomes `{ "_gt": "" }` — harmless.

### Sanitizing with mongo-sanitize

For manual use (without Express middleware):

```bash
npm install mongo-sanitize
```

```js
const sanitize = require('mongo-sanitize');

// Sanitize individual values
const cleanEmail = sanitize(req.body.email);
const cleanQuery = sanitize(req.body);   // sanitizes entire object recursively

const user = await User.findOne({ email: cleanEmail });
```

### XSS Prevention

Cross-Site Scripting (XSS) happens when malicious scripts are stored in your DB and later rendered in a browser.

```bash
npm install xss-clean
# or (more modern)
npm install sanitize-html
```

```js
// Option 1: xss-clean middleware (global)
const xss = require('xss-clean');
app.use(xss());

// Option 2: sanitize-html (granular control)
const sanitizeHtml = require('sanitize-html');

const cleanBio = sanitizeHtml(req.body.bio, {
  allowedTags: ['b', 'i', 'em', 'strong', 'a'], // whitelist safe tags
  allowedAttributes: {
    'a': ['href']
  },
  // strips everything else
});
```

---

## Part 4 — Joi for Request Validation

[Joi](https://joi.dev/) is a powerful standalone schema description and validation library — great for validating **request bodies, query params, and route params**.

```bash
npm install joi
```

```js
// validators/schemas/userSchema.js
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required(),

  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[0-9]/, 'number')
    .pattern(/[!@#$%^&*]/, 'special character')
    .required()
    .messages({
      'string.pattern.name': 'Password must contain at least one {#name}'
    }),

  age: Joi.number()
    .integer()
    .min(18)
    .max(120)
    .optional(),

  role: Joi.string()
    .valid('user', 'admin', 'moderator')
    .default('user'),

  address: Joi.object({
    street:  Joi.string().trim().optional(),
    city:    Joi.string().trim().required(),
    pincode: Joi.string().pattern(/^\d{6}$/).required()
  }).optional()
});

// Middleware factory
const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,     // collect ALL errors, not just first
    stripUnknown: true,    // remove fields not in schema
    convert: true          // auto-convert types (string "25" → 25)
  });

  if (error) {
    const errors = error.details.map(d => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return res.status(422).json({ success: false, errors });
  }

  req.body = value; // use the sanitized/converted value
  next();
};

module.exports = { registerSchema, validateBody };
```

Usage in routes:

```js
const { registerSchema, validateBody } = require('../validators/schemas/userSchema');

router.post('/register', validateBody(registerSchema), authController.register);
```

---

## Part 5 — Zod for Schema Validation (TypeScript-first)

[Zod](https://zod.dev/) is increasingly popular for its TypeScript-first design and clean API. Works great with JavaScript too.

```bash
npm install zod
```

```js
// validators/schemas/productSchema.js
const { z } = require('zod');

const productSchema = z.object({
  title: z.string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),

  price: z.number()
    .positive('Price must be positive')
    .max(1000000),

  category: z.enum(['electronics', 'clothing', 'food', 'books', 'other']),

  tags: z.array(z.string().trim()).max(10, 'Max 10 tags allowed').optional(),

  inStock: z.boolean().default(true),

  discount: z.number().min(0).max(100).optional(),

  specs: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

// Middleware
const zodValidate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return res.status(422).json({ success: false, errors });
  }

  req.body = result.data; // cleaned, typed data
  next();
};

module.exports = { productSchema, zodValidate };
```

---

## Part 6 — Real-World Patterns

### Validation Middleware Pattern

Organize validation in a dedicated `middlewares/validate.js`:

```js
// middlewares/validate.js
const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }
  next();
};

module.exports = handleValidationErrors;
```

```js
// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { registerValidationRules } = require('../validators/userValidator');
const handleValidationErrors = require('../middlewares/validate');
const UserController = require('../controllers/UserController');

router.post(
  '/register',
  registerValidationRules,   // Step 1: run validation rules
  handleValidationErrors,    // Step 2: check results, abort if invalid
  UserController.register    // Step 3: execute controller
);
```

### Service Layer Sanitization

Never pass raw `req.body` directly to the database. Extract only what you need:

```js
// controllers/UserController.js
const User = require('../models/User');

const register = async (req, res) => {
  try {
    // ✅ Destructure only the fields you expect — ignore unknown fields
    const { name, email, password, age, role } = req.body;

    // ✅ Additional app-level sanitization
    const sanitizedData = {
      name:  name.trim(),
      email: email.toLowerCase().trim(),
      age:   parseInt(age, 10) || undefined,
      role:  ['user', 'admin', 'moderator'].includes(role) ? role : 'user'
      // password will be hashed in the pre-save hook
    };

    // ✅ Never store plaintext passwords — use bcrypt in a Mongoose pre-save hook
    const user = new User({ ...sanitizedData, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
      return res.status(422).json({ success: false, errors });
    }

    // Handle duplicate key (unique constraint)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { register };
```

### Complete User Registration Example

Putting it all together — here's a production-grade registration flow:

```js
// app.js
const express         = require('express');
const mongoose        = require('mongoose');
const mongoSanitize   = require('express-mongo-sanitize');
const xss             = require('xss-clean');
const helmet          = require('helmet');

const app = express();

// --- Security Middleware (order matters!) ---
app.use(helmet());                            // sets security headers
app.use(express.json({ limit: '10kb' }));     // limit body size to prevent DoS
app.use(mongoSanitize());                     // prevent NoSQL injection
app.use(xss());                               // sanitize HTML/XSS

// --- Routes ---
app.use('/api/users', require('./routes/user.routes'));

module.exports = app;
```

```js
// models/User.js — with pre-save hook for password hashing
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, maxlength: 50 },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 8, select: false },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive:  { type: Boolean, default: true }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

## Part 7 — Common Vulnerabilities & How to Prevent Them

### 1. NoSQL Injection

```js
// ❌ VULNERABLE
const user = await User.findOne({ email: req.body.email });

// Attacker sends: { "email": { "$ne": null } }
// → matches EVERY user!

// ✅ SAFE — use express-mongo-sanitize middleware + type checking
const email = String(req.body.email).toLowerCase().trim();
const user  = await User.findOne({ email });
```

### 2. Mass Assignment

```js
// ❌ VULNERABLE — user can set role: "admin"
const user = new User(req.body);

// ✅ SAFE — whitelist allowed fields
const { name, email, password } = req.body;
const user = new User({ name, email, password });
```

### 3. Prototype Pollution

```js
// ❌ VULNERABLE input: { "__proto__": { "isAdmin": true } }
const config = Object.assign({}, req.body);

// ✅ SAFE — use Joi/Zod with strict mode, or:
const sanitized = JSON.parse(JSON.stringify(req.body)); // strips prototype
```

### 4. Regex DoS (ReDoS)

```js
// ❌ VULNERABLE — catastrophic backtracking on evil input
const emailRegex = /^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/;

// ✅ SAFE — use validator.js or simple, non-catastrophic regex
const validator = require('validator');
if (!validator.isEmail(email)) throw new Error('Invalid email');
```

---

## Part 8 — Validation vs Sanitization — Quick Reference

| | Validation ✅ | Sanitization 🧹 |
|---|---|---|
| **What it does** | Checks if data meets rules | Cleans/normalizes data |
| **On failure** | Rejects the request | Transforms the data |
| **When** | Before processing | Before validation or before saving |
| **Tools** | Joi, Zod, express-validator, Mongoose | mongo-sanitize, xss-clean, .trim(), .toLowerCase() |
| **Examples** | email must match regex | strip `<script>` tags |
| | age must be 18–120 | remove `$` from keys |
| | required fields present | trim whitespace |

**Rule of thumb:** Sanitize first, then validate.

```
Request Body
    │
    ▼
[Sanitize] ← strip injection chars, trim whitespace, normalize case
    │
    ▼
[Validate] ← check types, ranges, required fields, formats
    │
    ▼
[Controller] ← whitelist fields, apply business logic
    │
    ▼
[Mongoose] ← schema-level validation + type casting
    │
    ▼
[MongoDB] ← JSON Schema validator (last defense)
```

---

## 🧰 Tools & Libraries Cheatsheet

| Library | Install | Use Case |
|---|---|---|
| `express-validator` | `npm i express-validator` | Request body validation + sanitization |
| `joi` | `npm i joi` | Standalone schema validation |
| `zod` | `npm i zod` | TypeScript-first schema validation |
| `express-mongo-sanitize` | `npm i express-mongo-sanitize` | NoSQL injection prevention |
| `xss-clean` | `npm i xss-clean` | XSS prevention (deprecated; use alternatives) |
| `sanitize-html` | `npm i sanitize-html` | HTML content sanitization |
| `validator` | `npm i validator` | String validators (email, URL, UUID, etc.) |
| `helmet` | `npm i helmet` | HTTP security headers |
| `bcryptjs` | `npm i bcryptjs` | Password hashing |
| `mongoose` | `npm i mongoose` | ODM with built-in schema validation |

---

## ✅ Best Practices Checklist

- [ ] Apply `express-mongo-sanitize` globally before all routes
- [ ] Apply `xss-clean` or `sanitize-html` for user-generated content
- [ ] Use `helmet` for HTTP security headers
- [ ] Limit request body size with `express.json({ limit: '10kb' })`
- [ ] Validate all incoming data with Joi, Zod, or express-validator
- [ ] Destructure and whitelist fields in controllers — never spread `req.body` directly
- [ ] Use Mongoose schema validators as a second line of defense
- [ ] Set up MongoDB JSON Schema validation as the final line of defense
- [ ] Never store plaintext passwords — use bcrypt pre-save hooks
- [ ] Use `select: false` on sensitive fields like `password` in Mongoose
- [ ] Handle Mongoose `ValidationError` and `MongoError` code `11000` (duplicate) separately
- [ ] Log sanitized/suspicious inputs for security monitoring
- [ ] Use `abortEarly: false` in Joi to collect all errors at once
- [ ] Test with malicious payloads: `{ "$gt": "" }`, `<script>alert(1)</script>`, long strings

---

## 📖 Further Reading

- [Mongoose Validation Docs](https://mongoosejs.com/docs/validation.html)
- [MongoDB JSON Schema Reference](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/)
- [Joi API Reference](https://joi.dev/api/)
- [Zod Documentation](https://zod.dev/)
- [OWASP NoSQL Injection](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection)
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

---

*Made for backend learners. Keep your data clean, your schemas tight, and your DB safe. 🚀*
