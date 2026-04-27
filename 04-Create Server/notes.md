# 🌐 Server – Complete Guide & Internal Working (Deep Dive)

![Server](https://img.shields.io/badge/Topic-Server-blue)
![Level](https://img.shields.io/badge/Level-Beginner%20to%20Advanced-green)
![Notes](https://img.shields.io/badge/Content-Highly%20Detailed-orange)

---

## 📖 Introduction

Servers are the **foundation of all internet-based systems**.
From simple websites to complex applications like:

* Google Search 🔍
* Instagram 📸
* Netflix 🎬

👉 All depend on powerful servers working behind the scenes.

---

## ⚙️ What is a Server?

A **server** is:

> A system (hardware + software) that **receives requests, processes them, and sends responses back to clients**.

### 🔑 Key Characteristics:

* Always **ON (24/7 availability)**
* Handles **multiple users simultaneously**
* Connected to a **network (internet or LAN)**

---

## 🧠 Types of Servers

| Type                | Description       | Example Use    |
| ------------------- | ----------------- | -------------- |
| 🌐 Web Server       | Serves web pages  | Apache, Nginx  |
| 🗄️ Database Server | Manages data      | MySQL, MongoDB |
| 📁 File Server      | Stores files      | Cloud storage  |
| 📧 Mail Server      | Email handling    | Gmail servers  |
| 🎮 Game Server      | Multiplayer games | PUBG servers   |
| ☁️ Cloud Server     | Virtual servers   | AWS, Azure     |

---

## 🏗️ Server Architecture

### 🔹 1. Hardware Layer

* Multi-core CPUs for parallel processing
* Large RAM (16GB–256GB+)
* SSD storage for fast access
* Redundant power supply

### 🔹 2. System Software Layer

* Operating System (Linux preferred)
* Kernel manages hardware resources

### 🔹 3. Application Layer

* Web server (Nginx/Apache)
* Backend runtime (Node.js, Java)
* APIs

### 🔹 4. Data Layer

* Databases
* Cache systems (Redis)

---

## 🖼️ Architecture Diagram

```
Client → Load Balancer → Web Server → App Server → Database
```

---

## 🔄 How a Server Works

### Basic Flow:

1. User enters URL
2. DNS resolves domain → IP address
3. Request sent via HTTP/HTTPS
4. Server processes request
5. Response returned

---

## 🧩 Internal Working of Server (Deep Explanation)

### 🔥 1. Listening Phase

* Server runs on a **port (80/443)**
* Uses sockets to listen for incoming requests

---

### 🔥 2. Connection Establishment

* Uses **TCP 3-way handshake**:

  * SYN
  * SYN-ACK
  * ACK

👉 Ensures reliable connection

---

### 🔥 3. Request Parsing

* Server reads:

  * Method (GET, POST)
  * Headers
  * Body

---

### 🔥 4. Routing

* URL mapped to specific function
* Example:

  ```
  /login → loginHandler()
  ```

---

### 🔥 5. Business Logic Execution

* Core processing happens here:

  * Authentication
  * Calculations
  * Data validation

---

### 🔥 6. Database Interaction

* Query sent to database
* Data retrieved or stored

---

### 🔥 7. Response Creation

* Data formatted into:

  * HTML (for browser)
  * JSON (for APIs)

---

### 🔥 8. Response Sent

* Server sends response via HTTP
* Connection may close or stay alive

---

## 📡 Client-Server Model

```
Client ----Request----> Server
Client <---Response---- Server
```

👉 Stateless communication (HTTP)

---

## 🌐 Networking Basics Behind Server

### 🔹 Important Concepts:

* IP Address → Unique identity
* Port Number → Service identifier
* Protocols:

  * HTTP / HTTPS
  * TCP / UDP

---

## ⚙️ Request Lifecycle (Detailed Flow)

```
Browser → DNS → Server → App Logic → DB → Response → Browser
```

---

## 💾 Database Interaction in Depth

### Example:

User logs in:

1. Request → /login
2. Server checks database
3. If match:

   * Allow access
4. Else:

   * Return error

---

## ⚡ Performance & Scalability

### 🔹 Techniques:

* Load Balancing
* Caching (Redis)
* Horizontal Scaling
* CDN usage

---

## 🔐 Security in Servers

### 🔒 Key Security Concepts:

* HTTPS (SSL/TLS)
* Authentication & Authorization
* Firewalls
* Rate Limiting
* Encryption

---

## 🌍 Real-Life Example

### Opening Netflix:

1. Request sent
2. Server authenticates user
3. Fetches video data
4. Streams content

---

## 💻 Mini Project Example

### Simple Node.js Server

```javascript
const http = require('http');

http.createServer((req, res) => {
  res.end("Server Running 🚀");
}).listen(3000);
```

---

## 📚 Conclusion

Servers are:

* Core of web applications
* Responsible for communication
* Essential for modern systems


---

