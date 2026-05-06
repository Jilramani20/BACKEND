# 📘 Database Storage & Indexing – Complete Notes

---

## 📌 Basic Database Operations

We mostly perform the following operations in a database:

- **Read** → Fetch data  
- **Write** → Insert new data  
- **Update** → Modify existing data  
- **Delete** → Remove data  
- **Range Query** → Fetch data within a range (e.g., age between 20–30)

---

## 🧠 How data are stored in hard disk?

Modern databases store data on **HDD/SSD** in the form of **blocks/pages** (not simple arrays).

- Data is stored in **rows (records)** inside pages
- Each page has fixed size (e.g., 4KB, 8KB)
- Disk access is **slow**, so minimizing reads is very important

---

## ❓ Can we store data one by one like an array?

- Now for search operation it taks O(N) time because array is in unsorted form  
- and insert O(1).  
- Delete O(N).  
- Update O(N) because find ele and also if size increase move all the element to make space for new element.  

### ⚠️ Problem

- Too slow for large databases
- Not scalable for millions of records

---

## ⚠️ What if array is sorted?

- But if array is in sorted form then it takes O(logN) time that's what you think but actually it takes O(N) time because herer size of each row is different and to perform binary search we want all the element to be same size so that we can calculate the mid element.  
- and insert O(N).  
- Delete O(N).  
- Update O(N) because find ele and also if size increase move all the element to make space for new element.  
- Sorting does not help here.  

### ❌ Why sorting fails?

- Rows have **variable size**
- Cannot directly calculate middle element
- Insert/Delete requires shifting → costly

---

## 🚀 What if we add indexing to the array?

- We create a table which stores the start address of each row in the array ans perform binary search (because address size is fixed) or we can even use hash table to find the start of the row in the array.  
- now we dont have to store data in SSD in sorted form or even in array form we can store data in SSD in any random space and we have to maintain the index table in sorted from.  
- insert O(1) in SSD store data in any space but in index table O(N) but we of using array in index table we can use AVL so now insert O(logN) in index table.  
- Id will not alway be a number it can be string like username, email and so the size of the id will not be fixed so we cannot use array in index table so we use AVL tree in index table.  
- Next lec we will see why we need B or B+ tree for indexing not AVL tree.

---

## 🧩 Understanding Indexing (Deep Dive)

### 🔹 What is an Index?

An **index** is a separate data structure that stores:

Example:

| ID | Address |
|----|--------|
| 101 | 0xA1 |
| 205 | 0xB4 |
| 309 | 0xC8 |

---

### 🔹 Benefits of Indexing

- Fast search → **O(log N)**
- No need to scan full table
- Works even if data is unsorted on disk

---

### 🔹 Types of Indexing

#### 1. Primary Index
- Based on primary key
- Unique values

#### 2. Secondary Index
- Based on non-primary field (e.g., name, email)

#### 3. Clustered Index
- Data stored in same order as index

#### 4. Non-Clustered Index
- Index separate from data

---

## 🌳 Why not use AVL Trees?

AVL Trees are good in memory but not for disk:

### ❌ Problems with AVL:

- Height is large → more disk reads
- Each node = separate disk access (slow)
- Not optimized for block storage

---

## 🌲 Why B-Trees / B+ Trees are used?

### ✅ Advantages:

- Low height (very shallow tree)
- Each node stores many keys
- Optimized for disk (block-based storage)
- Fewer disk reads

---

### 📊 Comparison

| Feature | AVL Tree | B-Tree / B+ Tree |
|--------|--------|----------------|
| Height | High | Low |
| Disk Access | More | Less |
| Performance | Slower on disk | Faster on disk |
| Use Case | RAM | Databases |

---

## 🔥 B+ Tree Special Advantage

- All data stored at **leaf nodes**
- Leaf nodes are **linked** → fast range queries
- Perfect for databases

---

## 📦 How Database Actually Works (Simplified Flow)

---

## ⚡ Real-World Example

When you run:

```sql
SELECT * FROM users WHERE id = 101;