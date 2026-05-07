# 🍃 Mongoose — Complete Guide

> **Object Data Modeling (ODM) library for MongoDB and Node.js**

---

## 📌 What is Mongoose?

* Mongoose is an **Object Data Modeling (ODM) library** for MongoDB and Node.js.
* We can work without mongoose, but without it we have to write a lot of code to interact with MongoDB and manage our data.
* MongoDB is **schemaless**, but mongoose allows us to define a schema for our data.
* Without a schema, we would have to write a lot of code to validate our data and ensure that it is in the correct format.
* With mongoose, we can define a **schema** that specifies the structure of our data and the types of data that we expect to receive.
* With mongoose, we can just treat our data as JavaScript objects and mongoose will take care of the rest, including **validating** our data and saving it to the database.
* **Express app → Mongoose → MongoDB → Database (secondary memory)**. This is the standard request-data flow when using Mongoose with an Express application.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Your Application                  │
│  (Express / Node.js)                                │
└───────────────────┬─────────────────────────────────┘
                    │  JavaScript Objects / Promises
                    ▼
┌─────────────────────────────────────────────────────┐
│                    MONGOOSE (ODM)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Schema  │  │  Model   │  │  Query Builder   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │Validation│  │Middleware│  │   Plugins        │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└───────────────────┬─────────────────────────────────┘
                    │  BSON / MongoDB Wire Protocol
                    ▼
┌─────────────────────────────────────────────────────┐
│               MongoDB Driver (mongodb npm)          │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│          MongoDB Database (Secondary Memory)        │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Internal Working of Mongoose

Understanding what happens under the hood is key to using Mongoose effectively.

### 1. Connection Pooling
When you call `mongoose.connect()`, Mongoose doesn't create a single connection — it creates a **connection pool** (default size: 5). Each query picks a free connection from the pool, executes, then returns it. This avoids the overhead of creating/destroying connections per request.

```
mongoose.connect(uri)
        │
        ▼
  Connection Pool
  ┌──┬──┬──┬──┬──┐
  │C1│C2│C3│C4│C5│   ← idle connections waiting for queries
  └──┴──┴──┴──┴──┘
```

### 2. Schema → Document Mapping
When you define a Schema and create a Model, Mongoose registers it internally:

```
Schema Definition (JS)
        │
        ▼
  SchemaType Casting   ← converts values to declared types (e.g., "42" → 42)
        │
        ▼
  Validation Layer     ← runs built-in + custom validators
        │
        ▼
  Document Instance    ← a JS object with Mongoose methods attached
        │
        ▼
  MongoDB Driver       ← converts to BSON for wire protocol
        │
        ▼
  MongoDB Collection
```

### 3. Query Lifecycle
Every Mongoose query goes through a predictable pipeline:

```
Model.find({ age: { $gt: 18 } })
        │
        ▼
  [Pre Query Middleware]    ← e.g., adding default filters
        │
        ▼
  Query Builder             ← builds the MongoDB query object
        │
        ▼
  MongoDB Driver exec()     ← sends query over the wire
        │
        ▼
  Raw BSON response
        │
        ▼
  Hydration                 ← raw docs → Mongoose Document instances
        │
        ▼
  [Post Query Middleware]   ← e.g., logging, transformations
        │
        ▼
  Promise resolved → your .then() / await
```

### 4. Middleware (Hooks) Execution Order
Mongoose middleware intercepts operations at precise moments:

```
save() called
    │
    ├─► pre('validate') hooks
    │         │
    │         ▼
    ├─► Schema validation runs
    │         │
    │         ▼
    ├─► pre('save') hooks
    │         │
    │         ▼
    ├─► MongoDB write operation
    │         │
    │         ▼
    └─► post('save') hooks  →  callback / Promise resolves
```

---

## 🚀 Getting Started

### Installation

```bash
npm install mongoose
```

### Connecting to MongoDB

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB');
});
```

---

## 📐 Schema

A **Schema** defines the shape of documents in a MongoDB collection. It maps to a MongoDB collection and defines the shape of the documents within that collection.

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name:      { type: String,  required: true },
  email:     { type: String,  required: true, unique: true, lowercase: true },
  age:       { type: Number,  min: 0, max: 120 },
  role:      { type: String,  enum: ['user', 'admin', 'moderator'], default: 'user' },
  isActive:  { type: Boolean, default: true },
  createdAt: { type: Date,    default: Date.now },
  address: {
    city:    String,
    country: String,
  },
  tags: [String],   // Array of strings
});
```

### Schema Types

| Type       | Description                          |
|------------|--------------------------------------|
| `String`   | UTF-8 string                         |
| `Number`   | Integer or float                     |
| `Boolean`  | true / false                         |
| `Date`     | JavaScript Date object               |
| `Buffer`   | Binary data                          |
| `ObjectId` | MongoDB's unique `_id` reference     |
| `Array`    | Array of any type                    |
| `Map`      | Key-value pairs with typed values    |
| `Mixed`    | Any arbitrary data (`Schema.Types.Mixed`) |

---

## 🏭 Model

A **Model** is a compiled version of a Schema. It provides an interface to interact with the MongoDB collection.

```javascript
// Model name 'User' → maps to 'users' collection (auto-pluralized, lowercased)
const User = mongoose.model('User', userSchema);
```

---

## 🔄 CRUD Operations

### Create

```javascript
// Method 1: new + save()
const user = new User({ name: 'Jil', email: 'jil@ldce.ac.in', age: 21 });
await user.save();

// Method 2: create() (shorthand)
const user = await User.create({ name: 'Jil', email: 'jil@ldce.ac.in', age: 21 });

// Method 3: insertMany()
await User.insertMany([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob',   email: 'bob@example.com'   },
]);
```

### Read

```javascript
// Find all
const users = await User.find();

// Find with filter
const admins = await User.find({ role: 'admin' });

// Find one
const user = await User.findOne({ email: 'jil@ldce.ac.in' });

// Find by ID
const user = await User.findById('64f1a2b3c4d5e6f7a8b9c0d1');

// Select specific fields (projection)
const users = await User.find().select('name email -_id');

// Sort, Limit, Skip (pagination)
const users = await User.find()
  .sort({ createdAt: -1 })
  .limit(10)
  .skip(20);
```

### Update

```javascript
// findByIdAndUpdate
const updated = await User.findByIdAndUpdate(
  id,
  { $set: { age: 22 } },
  { new: true, runValidators: true }  // return updated doc + run validators
);

// updateMany
await User.updateMany({ isActive: false }, { $set: { role: 'user' } });
```

### Delete

```javascript
// findByIdAndDelete
await User.findByIdAndDelete(id);

// deleteMany
await User.deleteMany({ isActive: false });
```

---

## ✅ Validation

Mongoose runs validation **before** saving to the database.

```javascript
const productSchema = new Schema({
  name:  { type: String, required: [true, 'Product name is required'], trim: true },
  price: { type: Number, required: true, min: [0, 'Price must be positive'] },
  sku:   {
    type: String,
    validate: {
      validator: (v) => /^[A-Z]{3}-\d{4}$/.test(v),
      message:   (props) => `${props.value} is not a valid SKU format!`,
    },
  },
});
```

---

## 🔗 Relationships — Population

Mongoose supports referencing documents in other collections via `ObjectId` and `.populate()`.

```javascript
const postSchema = new Schema({
  title:  String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },  // reference
});

const Post = mongoose.model('Post', postSchema);

// Fetching with population (JOIN equivalent)
const post = await Post.findById(postId).populate('author', 'name email');
// post.author is now a full User document, not just an ID
```

---

## 🪝 Middleware (Hooks)

Middleware functions run **before** (`pre`) or **after** (`post`) certain operations.

```javascript
const bcrypt = require('bcrypt');

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Log after a document is deleted
userSchema.post('findOneAndDelete', function (doc) {
  if (doc) console.log(`User ${doc.name} was deleted`);
});
```

### Supported Middleware Operations
`validate`, `save`, `remove`, `updateOne`, `deleteOne`, `find`, `findOne`, `aggregate`, `insertMany`

---

## 🧰 Virtuals

Virtuals are computed properties that are **not stored** in MongoDB but are derived from existing fields.

```javascript
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// In query results, virtuals are hidden by default
// Enable them like this:
userSchema.set('toJSON',   { virtuals: true });
userSchema.set('toObject', { virtuals: true });
```

---

## ⚡ Instance & Static Methods

### Instance Methods (on a document)

```javascript
userSchema.methods.greet = function () {
  return `Hi, I'm ${this.name}!`;
};

const user = await User.findOne({ name: 'Jil' });
console.log(user.greet());  // "Hi, I'm Jil!"
```

### Static Methods (on the Model)

```javascript
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

const user = await User.findByEmail('jil@ldce.ac.in');
```

---

## 🔌 Plugins

Plugins let you package reusable schema logic.

```javascript
// timestampPlugin.js
function timestampPlugin(schema) {
  schema.add({ createdAt: Date, updatedAt: Date });

  schema.pre('save', function (next) {
    const now = Date.now();
    this.updatedAt = now;
    if (!this.createdAt) this.createdAt = now;
    next();
  });
}

// Apply to a schema
userSchema.plugin(timestampPlugin);

// Or apply globally to all schemas
mongoose.plugin(timestampPlugin);
```

> 💡 **Pro tip:** Mongoose's built-in `{ timestamps: true }` option does this automatically.
> ```javascript
> const userSchema = new Schema({ ... }, { timestamps: true });
> ```

---

## 🔍 Query Helpers & Chaining

```javascript
// Query helper
userSchema.query.active = function () {
  return this.where({ isActive: true });
};

// Usage
const activeAdmins = await User.find().active().where('role').equals('admin');
```

---

## 🗂️ Indexes

Indexes dramatically speed up query performance.

```javascript
const userSchema = new Schema({
  email: { type: String, unique: true },   // single-field index
  name:  String,
});

// Compound index
userSchema.index({ name: 1, createdAt: -1 });

// Text index for full-text search
userSchema.index({ name: 'text', bio: 'text' });
```

---

## 📦 Transactions

Mongoose supports **multi-document ACID transactions** (requires MongoDB 4.0+ replica set).

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await User.create([{ name: 'Alice' }], { session });
  await Order.create([{ userId: alice._id }], { session });

  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

---

## 🛡️ Error Handling

```javascript
// Validation Error
try {
  await user.save();
} catch (err) {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    console.error('Validation failed:', messages);
  }
}

// Duplicate Key Error (E11000)
try {
  await User.create({ email: 'duplicate@example.com' });
} catch (err) {
  if (err.code === 11000) {
    console.error('Duplicate key:', err.keyValue);
  }
}
```

---

## 📊 Key Concepts — Quick Reference

| Concept       | Description                                            |
|---------------|--------------------------------------------------------|
| **Schema**    | Blueprint/structure for a document                     |
| **Model**     | Compiled Schema — interface to a collection            |
| **Document**  | An instance of a Model (a single record)               |
| **Query**     | Chainable interface to fetch/update data               |
| **Middleware**| Pre/post hooks on operations (save, find, delete, etc.)|
| **Virtual**   | Computed field not stored in DB                        |
| **Population**| Replacing ObjectId refs with actual documents (JOIN)   |
| **Plugin**    | Reusable schema logic                                  |
| **Index**     | Speeds up queries on specific fields                   |

---

## 🔒 Best Practices

1. **Always handle errors** — wrap async operations in `try/catch` or use `.catch()`.
2. **Use `lean()`** for read-only queries — returns plain JS objects, not Mongoose Documents (much faster).
   ```javascript
   const users = await User.find().lean();
   ```
3. **Use `select()`** to fetch only needed fields — reduces bandwidth and memory usage.
4. **Enable `{ timestamps: true }`** on all schemas — automatic `createdAt` and `updatedAt`.
5. **Never expose `_v`** (version key) to clients — use `{ versionKey: false }` if not needed.
6. **Use environment variables** for connection strings — never hardcode credentials.
7. **Index frequently queried fields** — but don't over-index (writes become slower).
8. **Use `populate()` sparingly** — for large datasets, prefer aggregation pipelines.

---

## 📚 Resources

* [Official Mongoose Documentation](https://mongoosejs.com/docs/)
* [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
* [Mongoose GitHub Repository](https://github.com/Automattic/mongoose)
* [MongoDB University (Free Courses)](https://learn.mongodb.com/)

---

> Made with ❤️ for Node.js + MongoDB developers
