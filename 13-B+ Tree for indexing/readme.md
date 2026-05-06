# 🌳 Why B-Tree / B+ Tree for Indexing? (Not AVL Tree)

> A deep-dive into how disk I/O mechanics, tree structure, and database internals come together to make B+ Trees the gold standard for database indexing.

---

## 📦 How Hard Disk Storage Works

Before understanding why B+ Trees are preferred, you must understand how a hard disk reads and writes data.

### Disk Structure
- A hard disk is made up of **tracks**, and tracks are divided into **sectors**.
- The OS reads/writes data in units called **blocks** (also called **pages**).
- You **cannot** read less than 1 block at a time — it's the minimum unit of disk I/O.

### Block Size
- Most hard disks use a block size of **4 KB** (4096 bytes).
- Even if you want to read **1 byte**, the disk will load the entire **4 KB block** into RAM first.
- Even if you want to write **1 byte**, the OS must:
  1. Read the full 4 KB block into memory
  2. Modify that 1 byte in memory
  3. Write the entire 4 KB block back to disk

> ⚠️ **Key Insight:** Disk I/O is expensive. Every extra block read = extra time. Minimizing the number of disk reads is the #1 goal of database indexing.

---

## 🌲 Why Not AVL Tree?

AVL Trees are perfectly balanced **Binary Search Trees (BST)**. They work great **in memory**, but they fail miserably on disk for the following reasons:

### Problem 1 — Node Size is Tiny
- An AVL node stores: `1 key + 2 child pointers + height`
- That's roughly **~40–80 bytes** per node
- A 4 KB block can hold **~50–100 AVL nodes**, but you only read **1 node per disk access** because each node has a separate disk address
- This means you're wasting **~99% of the block** you just loaded!

### Problem 2 — Too Many Disk I/Os
- For a database with **1 million records**, an AVL Tree has height ≈ `log₂(1,000,000) ≈ 20`
- That means **20 disk reads** to find a single record
- Each disk read can take **5–10 ms** on a spinning HDD → **100–200 ms total** just to find one value

### Problem 3 — No Efficient Range Queries
- In AVL Trees, range queries (e.g., `WHERE age BETWEEN 20 AND 30`) require an **in-order traversal**
- This jumps between random memory addresses (pointer chasing) — terrible for disk I/O

---

## 🏆 Why B-Tree / B+ Tree?

### Core Idea: Fill the Block!
Instead of storing 1 key per node, store **as many keys as fit in one 4 KB disk block**.

A B-Tree node stores:
- **Multiple keys** (e.g., 100+ keys per node)
- **Multiple child pointers**
- **Node size ≈ 4 KB** (matches exactly 1 disk block)

This means: **1 disk read = 1 node = dozens/hundreds of keys scanned in RAM instantly.**

### B-Tree vs AVL Tree — Height Comparison

| Metric | AVL Tree | B+ Tree (order 100) |
|---|---|---|
| Keys per node | 1 | ~100 |
| Height (1M records) | ~20 | ~3 |
| Disk reads to find 1 record | ~20 | ~3 |
| Disk block utilization | ~1% | ~100% |

> With a B+ Tree of order 100 (100 keys/node), a tree of height **3** can index `100³ = 1,000,000` records — with only **3 disk reads**!

---

## 🔑 B-Tree Structure

```
                    [30 | 70]
                   /    |    \
          [10|20]   [40|50|60]   [80|90]
         /  |  \
      [5]  [15] [25]
```

- Each **internal node** holds keys and child pointers
- **All nodes** (internal + leaf) store actual data pointers (record addresses)
- A search, insert, or delete touches at most `O(log_t n)` nodes, where `t` = minimum degree

---

## ⭐ B+ Tree — The Database Standard

B+ Tree is an **improvement over B-Tree** and is what most real databases (MySQL InnoDB, PostgreSQL, SQLite, MongoDB) actually use.

### Key Differences from B-Tree

| Feature | B-Tree | B+ Tree |
|---|---|---|
| Data stored in | All nodes | **Only leaf nodes** |
| Internal nodes store | Keys + data pointers | Keys only (routing) |
| Leaf nodes linked? | ❌ No | ✅ Yes — doubly linked list |
| Range query | Slow (traversal) | Fast (follow leaf links) |
| Space in internal nodes | Shared with data | More keys fit → shorter tree |

### B+ Tree Structure

```
         Internal Nodes (routing only)
              [30 | 70]
             /    |    \
       [10|20]  [40|60]  [80|90]
          ↓        ↓        ↓
    Leaf Nodes (linked list — actual data pointers)
[5→|10→|20→] ↔ [30→|40→|60→] ↔ [70→|80→|90→]
```

- Internal nodes only hold **keys for routing** — no actual record data
- All actual data (or pointers to data rows) live in **leaf nodes**
- Leaf nodes are connected via a **doubly linked list**

---

## 🚀 Range Queries — B+ Tree's Killer Feature

Consider: `SELECT * FROM users WHERE age BETWEEN 25 AND 40`

**AVL Tree approach:**
1. Traverse the tree to find `25` → pointer chase across random disk locations
2. Do an in-order traversal, jumping between random nodes
3. Result: **many scattered disk reads**

**B+ Tree approach:**
1. Traverse from root to leaf → find the node containing `25` (**3 disk reads**)
2. Follow the **linked list** of leaf nodes → sequentially read `26, 27, ... 40`
3. Sequential disk reads are **10–100x faster** than random reads on HDDs
4. Result: **blazing fast range scan**

> This is why SQL databases with range queries, ORDER BY, and BETWEEN conditions are heavily optimized by B+ Tree indexes.

---

## 📐 B+ Tree Order and Node Size Calculation

Databases tune the **order (t)** of B+ Trees to match the disk block size.

### Example Calculation

Suppose:
- Block size = **4096 bytes**
- Key size = **8 bytes** (INT64)
- Pointer size = **8 bytes**
- A node with `k` keys has `k+1` pointers

**Max keys per node:**
```
k × 8 + (k+1) × 8 ≤ 4096
16k + 8 ≤ 4096
k ≤ 255
```

So one node holds **255 keys**, meaning:
- Height 1 tree → 255 records
- Height 2 tree → 255² ≈ 65,000 records
- Height 3 tree → 255³ ≈ 16.5 million records

**16.5 million records found in just 3 disk reads. 🎯**

---

## 🗄️ B+ Tree in Real Databases

### MySQL — InnoDB Storage Engine
- Uses **clustered B+ Tree** index
- The **primary key** IS the B+ Tree — actual row data lives in leaf nodes
- Secondary indexes store the primary key value, not the row address
- This allows MySQL to avoid a second lookup when using covering indexes

### PostgreSQL
- Uses B+ Tree for all default indexes (`CREATE INDEX`)
- Supports **partial indexes** and **expression indexes** on top of B+ Tree
- Uses **WAL (Write-Ahead Log)** to keep B+ Tree consistent during crashes

### SQLite
- Entire database is stored in a single file of **B+ Tree pages**
- Default page size is **4096 bytes** — matches OS block size
- Uses B+ Trees for both tables (row store) and indexes

### MongoDB
- Actual data is stored in **BSON format** (Binary JSON)
- BSON supports: `String`, `Int32`, `Int64`, `Double`, `Date`, `Boolean`, `Array`, `Object`, `ObjectId`, `Binary`, `Null`, `Timestamp`, `Decimal128`
- MongoDB indexes use **B+ Trees** internally (via the WiredTiger storage engine)
- `_id` field is automatically indexed with a B+ Tree
- Compound indexes, TTL indexes, and geospatial indexes are all built on top of B+ Tree structures

---

## 🔄 Insert & Delete in B+ Tree

### Insertion
1. Find the correct leaf node (traverse from root)
2. Insert the key in sorted order
3. If leaf is **full** (overflow) → **split** the node:
   - Create a new leaf node
   - Push the **middle key** up to the parent
   - Update linked list pointers
4. If parent is also full → split propagates upward
5. If root splits → tree height increases by 1

### Deletion
1. Find the key in the leaf node
2. Remove the key
3. If node is **underfull** (below minimum fill):
   - Try to **borrow** a key from a sibling
   - If not possible → **merge** with sibling + pull a key down from parent
4. If parent becomes underfull → repeat upward

> B+ Trees guarantee that all leaf nodes remain at the **same depth** after every insert/delete. This self-balancing property ensures consistent O(log n) performance.

---

## 🧠 Summary — AVL vs B-Tree vs B+ Tree

| Property | AVL Tree | B-Tree | B+ Tree |
|---|---|---|---|
| Best for | In-memory | Disk (general) | Disk (databases) |
| Keys per node | 1 | Many | Many |
| Data location | Every node | Every node | Leaf nodes only |
| Leaf linked list | ❌ | ❌ | ✅ |
| Range query | Slow | Medium | Fast |
| Disk block alignment | ❌ | ✅ | ✅ |
| Used in | RAM-based structures | File systems (ext4, NTFS) | MySQL, Postgres, MongoDB |
| Height (1M records) | ~20 | ~4 | ~3 |

---

## 💡 Key Takeaways

1. **Disk I/O is the bottleneck** — not CPU. Every algorithm design decision in databases is about minimizing disk reads.
2. **Block size awareness** — B+ Tree nodes are sized to match the OS block size (4 KB) to maximize data per disk read.
3. **AVL Trees are great in RAM**, but their 1-key-per-node design is catastrophically inefficient on disk.
4. **B+ Trees are superior to B-Trees** for databases because leaf-only data storage allows more routing keys in internal nodes (shorter tree) and the linked-list enables fast range scans.
5. **MongoDB uses B+ Trees** under the hood (WiredTiger engine) even though data is stored in BSON format.
6. **Sequential reads beat random reads** — that's why B+ Tree's linked leaf list gives huge performance advantages for range queries.

---

*Made with ❤️ for understanding database internals from the ground up.*
