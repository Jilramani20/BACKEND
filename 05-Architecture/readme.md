# <span style="color: red;">What happens in a company?</span>

A software company is not just about writing code. It is a structured ecosystem of teams, processes, architectures, and engineering decisions that work together to deliver a product. Understanding how a real company like UBER operates gives clarity on why modern software engineering looks the way it does.

---

## <span style="color: red;">Teams in a company?</span>

In a company like UBER there are many teams like discount team, fraud team, payment team etc. Each team works on their own microservice.

- **Discount team** works on discount microservice
- **Fraud team** works to detect fraud going on in the app like fake accounts, fake rides etc.
- **Fintech team** works on data filtering and financial operations
- **Bill team** works on billing microservice
- **Airport team** works on airport rides
- **Notification team** works on notification microservice

Also, new services keep on adding as the product grows.

### How teams are structured internally

Each product team typically contains:

| Role | Responsibility |
|---|---|
| Product Manager (PM) | Defines *what* to build and *why* |
| Solution Architect | Defines *how* the system is designed at a high level |
| Senior Developer (SDE-2/SDE-3) | Designs and builds core features, reviews code |
| Junior Developer (SDE-1) | Implements features under mentorship |
| QA / SDET | Tests features, writes automated test suites |
| DevOps / SRE | Manages deployment, CI/CD pipelines, uptime |
| Data Analyst | Monitors metrics, builds dashboards |

> **Real world note:** At UBER scale, even the "notification team" may have 20+ engineers. Each team owns their microservice end-to-end — from design to production.

---

## <span style="color: red;">Steps to build a software?</span>

1. **Requirements gathering** — what features to be built, done by the product manager
2. **Design** — how the feature will be built, done by solution architects and senior developers (tech stack, LLD, HLD, DB design etc.)
3. **Development** — writing code, done by developers (SDE-1, SDE-2 etc.)
4. **Testing** — testing the code, done by QA engineers (SDT, SDET etc.)
5. **Deployment** — deploying the code to production, done by DevOps engineers
6. **Maintenance** — monitoring and fixing bugs, done by support engineers

### A deeper look at each step

#### 1. Requirements Gathering
This is the most critical step. A wrong requirement leads to wasted engineering months. PMs use tools like **user stories**, **PRDs (Product Requirement Documents)**, and **customer feedback sessions** to define requirements. Requirements are either **functional** (what the system should do) or **non-functional** (how well it should do it — performance, security, availability).

#### 2. Design — HLD vs LLD

**High-Level Design (HLD):**
- System architecture overview
- Which services will be created
- How services communicate (REST, gRPC, message queues)
- Database choices (SQL vs NoSQL)
- Third-party integrations

**Low-Level Design (LLD):**
- Class diagrams, ER diagrams
- API contracts and schemas
- Detailed database table design
- Algorithm choices
- Edge case handling

#### 3. Development — Branching Strategy
Teams follow a **Git branching model** (e.g., GitFlow):
- `main` — production-ready code
- `develop` — integration branch
- `feature/xyz` — individual feature work
- `hotfix/xyz` — urgent production fixes

Code reviews are mandatory. No code merges to `main` without at least one peer review.

#### 4. Testing — Types of Tests

| Test Type | Purpose | Who writes it |
|---|---|---|
| Unit Test | Tests a single function/class in isolation | Developer |
| Integration Test | Tests how modules work together | Developer / QA |
| End-to-End (E2E) Test | Simulates a real user flow | SDET |
| Performance Test | Load/stress testing | QA / DevOps |
| Security Test | Vulnerability scanning | Security team |

#### 5. Deployment — CI/CD Pipeline
Modern companies use **CI/CD (Continuous Integration / Continuous Deployment)**:

```
Code Push → GitHub Actions / Jenkins triggers →
  → Unit Tests run →
  → Docker image built →
  → Deployed to Staging →
  → E2E tests run on staging →
  → Deployed to Production (canary or blue-green)
```

#### 6. Maintenance — Observability
After deployment, teams monitor using:
- **Logs** (e.g., ELK Stack — Elasticsearch, Logstash, Kibana)
- **Metrics** (e.g., Prometheus + Grafana dashboards)
- **Tracing** (e.g., Jaeger, Zipkin — for tracking a request across microservices)
- **Alerts** (PagerDuty, OpsGenie — notifies on-call engineers when something breaks)

---

## <span style="color: red;">What is monolithic architecture and microservice architecture?</span>

In monolithic architecture, all the features and functionalities like auth, images, frontend, backend etc. are stored in a single server.

When you have a small application with less features and less users, monolithic architecture is fine. But when your application grows and you have more features and more users, monolithic architecture becomes a bottleneck — because all the features compete for RAM and CPU from a single server. So if one feature is using more resources, other features will suffer.

**Why can't we just upgrade RAM and CPU of the server?** Because there is a limit to how much RAM and CPU you can add to a single server. Also, upgrading is expensive — pre-defined server configurations mean you often over-provision resources you don't need (e.g., you need 64GB RAM but get 20TB storage bundled in). We can't scale vertically forever.

**Why can't we just horizontally scale monolithic architecture?** Because in monolithic architecture, all the features are tightly coupled. So if we want to scale one feature, we have to scale the entire application. This leads to wastage of resources and money.

In microservice architecture, each feature and functionality is stored in a separate server. Each microservice can be developed, deployed, and scaled independently. This allows us to scale only the features that need more resources.

For example: if your users mostly use the discount feature, you can scale only the discount microservice and not the entire application.

**Disadvantages of microservice architecture:**
1. Complexity — managing multiple microservices is complex
2. Network latency — communication between microservices can lead to network latency
3. Data consistency — maintaining data consistency across microservices is challenging
4. Deployment — deploying multiple microservices is complex

**Advantages of microservice architecture:**
1. Scalability — each microservice can be scaled independently
2. Flexibility — each microservice can use different technologies and tech stacks
3. Resilience — failure of one microservice does not affect the entire application
4. Faster development — multiple teams can work on different microservices simultaneously
5. Better resource utilization — only scale the microservices that need more resources
6. Easier maintenance — each microservice can be maintained independently

<div style="display: flex">
<div style="flex: 1;">
<strong style="color: orange; font-size: 20px">Monolithic Architecture</strong>

- single codebase (frontend, database, backend, auth, payment etc.)
- Scalability is hard
- Development speed is slow as all teams have to work on same codebase
- Deployment is easy as there is only one codebase
- single tech stack
- Bug issues are easier to track
- If server fails, entire application goes down
- Maintenance is easier as there is only one codebase
- Debugging is easier as there is only one codebase
- Cost is lower as there is only one server to maintain
</div>
<div style="flex: 1;">
<strong style="color: orange; font-size: 20px">Microservice Architecture</strong>

- multiple codebases (each microservice has its own codebase) talking to each other via APIs
- Scalability is easy
- Development speed is fast — each team can work on their own microservice simultaneously
- Deployment is complex as there are multiple microservices to deploy
- multiple tech stacks
- Bug issues are hard to track as each microservice is independent
- If one microservice fails, other microservices are not affected
- Maintenance is complex as there are multiple microservices to maintain
- Debugging is complex as each microservice is independent
- Cost is higher as there are multiple servers to maintain
</div>
</div>

---

## <span style="color: red;">How do microservices communicate?</span>

This is one of the most important questions in distributed system design. Microservices can't share memory or call functions directly — they must communicate over a network.

### 1. Synchronous Communication — REST / gRPC

**REST (HTTP/JSON):**
- Service A sends an HTTP request to Service B and waits for a response
- Simple, widely supported, human-readable
- Problem: If Service B is slow or down, Service A is blocked

```
Discount Service → HTTP GET /user/123/discount → User Service
                 ← 200 OK { discount: "10%" }
```

**gRPC (HTTP/2 + Protocol Buffers):**
- Faster than REST (binary format instead of JSON)
- Strongly typed contracts via `.proto` files
- Used internally at UBER, Google, Netflix for low-latency communication

### 2. Asynchronous Communication — Message Queues

When you don't need an immediate response, use a **message queue** (e.g., Kafka, RabbitMQ).

```
Payment Service → publishes "payment_success" event → Kafka Topic
                                                     → Notification Service consumes it → sends SMS
                                                     → Billing Service consumes it → generates invoice
                                                     → Fraud Service consumes it → runs fraud checks
```

**Why this is powerful:**
- Payment service doesn't wait for notification, billing, and fraud — it just fires and forgets
- If Notification Service is temporarily down, Kafka holds the message and retries later
- New services can subscribe to the same event without changing the Payment service

---

## <span style="color: red;">What is an API Gateway?</span>

When you have 50+ microservices, you don't want the client (mobile app or browser) to directly call each one. This creates chaos — the client has to know the IP/URL of every service, handle authentication for every service, and manage 50 different connections.

**An API Gateway** is a single entry point that sits in front of all microservices.

```
Client (App/Browser)
        ↓
   [API Gateway]  ← handles Auth, Rate Limiting, Logging, Routing
   /      |      \
Discount  Fraud  Payment  Notification  ...
Service  Service Service   Service
```

**What the API Gateway does:**
- **Authentication** — verifies JWT tokens before passing requests to services
- **Rate Limiting** — prevents abuse (e.g., max 100 requests/minute per user)
- **Load Balancing** — distributes traffic across multiple instances of a service
- **SSL Termination** — handles HTTPS so internal services can use plain HTTP
- **Request Routing** — routes `/api/discount` to Discount Service, `/api/payment` to Payment Service

Popular API Gateways: **NGINX**, **Kong**, **AWS API Gateway**, **Traefik**

---

## <span style="color: red;">What is a Service Registry and Load Balancer?</span>

In a microservice world, services start and stop dynamically (especially with containers and Kubernetes). Their IPs change constantly. So how does Service A find Service B?

### Service Registry (Service Discovery)
A service registry is a database of currently running services and their network locations.

- When a service starts, it **registers itself** with the registry (e.g., Consul, Eureka, etcd)
- When a service wants to talk to another, it **queries the registry** for the address

```
Discount Service starts → registers at Consul: { name: "discount-service", ip: "10.0.0.5", port: 8080 }
Payment Service needs discount info → asks Consul: "where is discount-service?" → gets IP → calls it
```

### Load Balancer
When 5 instances of Discount Service are running, the load balancer decides which instance handles each request.

**Strategies:**
- **Round Robin** — requests go to instances 1, 2, 3, 4, 5, 1, 2, 3... in order
- **Least Connections** — sends to the instance handling fewest active requests
- **IP Hash** — same user always goes to the same instance (useful for session stickiness)

---

## <span style="color: red;">Databases in microservices — Database per Service pattern</span>

A critical rule in microservice architecture: **each service owns its own database**. No two services share a database directly.

**Why?**
- If two services share a DB, a schema change by one team can break the other team's service
- Services become tightly coupled through the database — defeating the purpose of microservices
- Each service can choose the best DB for its needs

| Service | Best Database Choice | Why |
|---|---|---|
| User Service | PostgreSQL (Relational) | Structured user data, ACID transactions |
| Notification Service | Cassandra (NoSQL) | High write throughput for logs |
| Search Service | Elasticsearch | Full-text search capabilities |
| Session/Cache Service | Redis | Ultra-fast key-value in-memory store |
| Ride History Service | MongoDB (Document) | Flexible schema for ride metadata |

---

## <span style="color: red;">What is Docker and Kubernetes?</span>

### Docker — Containerization
Before Docker, deploying an app meant: "it works on my machine but not on the server."

**Docker packages your application + all its dependencies into a container** — a lightweight, isolated unit that runs the same everywhere.

```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "server.js"]
```

Now this discount service runs identically on your laptop, staging server, and production server.

### Kubernetes (K8s) — Container Orchestration
When you have 50 microservices, each running 5 containers = **250 containers** to manage. Kubernetes automates this.

**What Kubernetes does:**
- **Scheduling** — decides which server (node) runs which container
- **Auto-scaling** — if Discount Service gets 10x traffic, K8s spins up more containers automatically
- **Self-healing** — if a container crashes, K8s restarts it automatically
- **Rolling updates** — deploys new versions with zero downtime (replaces old containers gradually)
- **Load balancing** — distributes traffic across all healthy containers

```
UBER's Kubernetes cluster might run thousands of pods (containers) across hundreds of servers — all managed automatically.
```

---

## <span style="color: red;">System Design — Real example: How does UBER match a rider to a driver?</span>

Let's trace one UBER ride request through the microservice architecture:

```
1. User opens app → API Gateway receives request
2. API Gateway verifies JWT token → Auth Service
3. Rider's location sent → Location Service (stores in Redis for speed)
4. Matching Service queries nearby drivers from Location Service
5. Matching Service applies surge pricing → Pricing Service
6. Best driver selected → Ride Service creates a ride record in DB
7. Notification Service sends push notification to the driver
8. Payment Service pre-authorizes the user's payment method
9. Fraud Service runs real-time fraud checks in background (async via Kafka)
10. Ride starts → Location Service tracks driver position every few seconds
11. Ride ends → Billing Service calculates final fare → Payment Service charges user
12. Notification Service sends receipt → Email + SMS + Push
```

All of this happens in **under 3 seconds** — because each service is independently optimized, horizontally scaled, and communicates efficiently via APIs and message queues.

---

## <span style="color: red;">Key engineering concepts every developer should know</span>

### CAP Theorem
In a distributed system, you can only guarantee **2 out of 3**:
- **C**onsistency — all nodes see the same data at the same time
- **A**vailability — every request gets a response (not guaranteed to be the latest data)
- **P**artition Tolerance — system continues working even if network between nodes fails

**Real world:** Network partitions always happen, so you always pick **CP or AP**. 
- UBER's ride-matching favors **AP** (availability) — showing slightly stale driver locations is acceptable
- Banking systems favor **CP** (consistency) — a bank transfer must be accurate, not just fast

### ACID vs BASE

| Property | ACID (Relational DBs) | BASE (NoSQL DBs) |
|---|---|---|
| Consistency | Strong | Eventual |
| Availability | May block | High |
| Best for | Banking, payments | Social feeds, notifications |

### Rate Limiting
Prevents a single user from overwhelming your service. Common algorithms:
- **Token Bucket** — each user gets N tokens per minute; each request consumes a token
- **Leaky Bucket** — requests processed at a fixed rate regardless of burst
- **Sliding Window** — tracks requests in a rolling time window

---

## <span style="color: red;">Summary — The Big Picture</span>

```
Product Idea
    ↓
PM writes PRD
    ↓
Architect designs HLD + LLD
    ↓
Teams develop microservices independently
    ↓
Each service is containerized with Docker
    ↓
CI/CD pipeline runs tests and deploys to Kubernetes
    ↓
API Gateway handles all client traffic
    ↓
Services communicate via REST / gRPC / Kafka
    ↓
Each service has its own DB (chosen for its use case)
    ↓
Observability: Logs + Metrics + Traces monitor health
    ↓
On-call engineers respond to alerts 24/7
```

This is how a company like UBER, Netflix, Amazon, or any modern tech company operates — not as one giant application, but as a **living ecosystem of small, independent, highly optimized services** working in concert.
