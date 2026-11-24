# Architecture & System Design – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

##### 1. What is the MERN stack? Explain its architecture

*(Asked 2×: TCS (online), Technovert)*

==> **MERN** = **MongoDB + Express.js + React + Node.js**: a full-stack app written end to end in
JavaScript. It's a classic **3-tier architecture**:
- **React** – presentation tier: the UI running in the browser.
- **Express.js on Node.js** – application tier: REST API, auth, business logic.
- **MongoDB** – data tier: stores JSON-like documents, usually accessed through **Mongoose**.

Request flow:
1. React calls the API with `fetch` / `axios`.
2. Express route → controller → service → Mongoose model.
3. MongoDB returns documents → Express sends JSON → React re-renders.

```text
React (browser)  --HTTP/JSON-->  Node.js + Express (API)  --Mongoose-->  MongoDB
                 <----JSON-----                           <--documents--
```

```js
// React
const res = await fetch('/api/users/1');
const user = await res.json();          // { _id: '1', name: 'Asha' }

// Express
app.get('/api/users/:id', async (req, res) => {
  res.json(await User.findById(req.params.id));
});
```

In short: UI (React) → API (Express/Node) → DB (MongoDB), with JSON and JavaScript everywhere.

---

##### 2. Monolith vs microservices vs serverless

*(Asked 1×: Algoworks)*

==> Three ways to **split and run** a backend:
- **Monolith** – one codebase, one deploy (e.g. one Express or Laravel app).
- **Microservices** – many small services (users, orders, payments), each deployed and scaled on
  its own, usually as Docker containers on ECS/Kubernetes.
- **Serverless** – small functions (AWS Lambda) that run on events; the cloud manages servers.

```text
+------------+---------------------+-----------------------------+---------------------------+
| Point      | Monolith            | Microservices               | Serverless                |
+============+=====================+=============================+===========================+
| Deploy     | Whole app at once   | Each service on its own     | Each function on its own  |
+------------+---------------------+-----------------------------+---------------------------+
| Scaling    | Scale the whole app | Scale only busy services    | Auto, per request, to 0   |
+------------+---------------------+-----------------------------+---------------------------+
| Servers    | You manage          | You manage (containers)     | Cloud manages             |
+------------+---------------------+-----------------------------+---------------------------+
| Complexity | Simple to start     | High: network, many repos,  | Low ops; cold starts,     |
|            |                     | tracing, data consistency   | 15-min Lambda limit       |
+------------+---------------------+-----------------------------+---------------------------+
| Cost       | One fixed server    | More infra                  | Pay per use               |
+------------+---------------------+-----------------------------+---------------------------+
| Example    | One Express app     | Netflix, Uber               | Lambda + API Gateway      |
+------------+---------------------+-----------------------------+---------------------------+
```

Interview tip: start with a **modular monolith** for a small team; split into microservices only
when parts need to scale or deploy independently.

In short: monolith = one app; microservices = many small apps; serverless = functions, no servers.

---

##### 3. What are microservices and why do we prefer them?

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> **Microservices** = the app is split into small, independent services, each owning **one
business area** (users, orders, payments) and **its own database**. They talk over REST/gRPC or
through a message broker (RabbitMQ, Kafka, SQS).

Why we prefer them:
- **Independent deploy** – ship the payment service without redeploying orders.
- **Independent scaling** – run 10 copies of the search service, 2 of the profile service.
- **Fault isolation** – if the email service crashes, checkout still works.
- **Team ownership** – each small team owns a service and can pick its stack (Node, PHP, Go).

Downsides (say these too):
- Network calls can fail or be slow → need retries, timeouts, **circuit breakers**.
- No cross-service DB transactions → **eventual consistency** (Saga pattern).
- Harder to debug → need centralized logs and **distributed tracing** (Jaeger, AWS X-Ray).

In short: small, independent services = independent deploy, scale and failure, at the cost of
more operational complexity.

---

##### 4. How do microservices communicate?

*(Asked 1×: Algoworks)*

==> Two ways:
- **Synchronous** (caller waits for the reply): **REST/HTTP**, **gRPC**, GraphQL.
- **Asynchronous** (send and move on): **message queues / events** – RabbitMQ, Kafka, AWS SQS/SNS.

```text
+-----------------------+---------------------------------+------------------------------------+
|                       | Synchronous                     | Asynchronous                       |
+=======================+=================================+====================================+
| Example               | Order service calls Payment API | Order service publishes an         |
|                       | and waits                       | "OrderPlaced" event                |
+-----------------------+---------------------------------+------------------------------------+
| Coupling              | Tight                           | Loose                              |
+-----------------------+---------------------------------+------------------------------------+
| If other side is down | Call fails (needs retry /       | Message waits in the queue         |
|                       | circuit breaker)                |                                    |
+-----------------------+---------------------------------+------------------------------------+
| Use when              | You need the answer now         | Background work, fan-out to many   |
|                       | (check stock, auth)             | services (email, invoice, stats)   |
+-----------------------+---------------------------------+------------------------------------+
```

```js
// sync: call another service over HTTP
const { data } = await axios.get('http://inventory-svc/stock/42');

// async: publish an event to SQS / RabbitMQ and return
await queue.send('OrderPlaced', { orderId: 101, userId: 7 });
```

Clients usually don't call services directly; they go through an **API Gateway**.

In short: REST/gRPC when you need an answer now; queues/events when you don't.

---

##### 5. What is a distributed environment?

*(Asked 1×: TechM)*

==> A **distributed system** is one app running on **many servers connected over a network**
that work together and look like one system to the user.
- Examples: microservices on different servers, a MongoDB **replica set**, a MySQL primary + read
  replicas, 5 Node.js instances behind a load balancer.
- Benefits: **scalability**, **high availability**, **fault tolerance**.
- Challenges:
  - the network can fail or be slow → timeouts, retries, idempotent APIs;
  - keeping data **consistent** across nodes (**CAP theorem**: during a network partition you
    choose consistency or availability);
  - tracing one request across many services → correlation IDs, Jaeger / AWS X-Ray.

In short: many machines acting as one system – more scale and uptime, harder consistency and
debugging.

---

##### 6. What is a circuit breaker?

*(Asked 1×: Senior Node.js round (YT))*

==> A **circuit breaker** wraps calls to another service and **stops calling it for a while
when it keeps failing**. Requests fail fast (or get a fallback) instead of piling up and slowing
the whole system.

3 states:
- **Closed** – normal; calls go through and failures are counted.
- **Open** – failure threshold crossed → calls fail immediately / return a fallback; the service
  isn't called at all.
- **Half-open** – after a cooldown, a few test calls go through; success → Closed, failure →
  Open again.

```js
// Node.js with the "opossum" library
import CircuitBreaker from 'opossum';

const breaker = new CircuitBreaker(callPaymentService, {
  timeout: 3000,                 // slower than 3 s = failure
  errorThresholdPercentage: 50,  // open when 50% of calls fail
  resetTimeout: 10000,           // go half-open after 10 s
});
breaker.fallback(() => ({ status: 'payment service busy, try later' }));

const result = await breaker.fire(orderId);
// when open → { status: 'payment service busy, try later' }
```

In short: like an electric breaker – trip on repeated failures, fail fast, test again later.

---

##### 7. Design a URL shortener

*(Asked 1×: Irpgrammer Solutions)*

==> **API**
- `POST /shorten` `{ url }` → `{ short: "https://sho.rt/aZ3x9Qk" }`
- `GET /:key` → **301/302 redirect** to the long URL (404 if not found).

**Key generation**
- **Base62** (a–z, A–Z, 0–9) of an auto-increment ID: unique, no collisions; 7 chars give 62^7 ≈
  3.5 trillion keys.
- Or a random 7-char string with a `UNIQUE` index; retry on collision.

**Storage**
- Table `urls(id, short_key UNIQUE, long_url, created_at, expires_at)` in MySQL/PostgreSQL, or
  DynamoDB for huge scale.

**Scale** (reads ≫ writes)
- Cache `key → long_url` in **Redis**; check cache first, DB on a miss.
- **302** if you want to count clicks (browser comes back every time); **301** is cached by the
  browser, so later clicks never reach you.
- Count clicks asynchronously through a queue, not inside the redirect.

```text
Client --POST /shorten--> API --> DB (short_key UNIQUE)
Client --GET /aZ3x9Qk---> API --> Redis --miss--> DB
       <--302 Location: https://long-url...--
```

```js
app.get('/:key', async (req, res) => {
  const url = (await redis.get(req.params.key)) ?? (await db.findLongUrl(req.params.key));
  if (!url) return res.sendStatus(404);
  res.redirect(302, url);
});
```

In short: base62 key + DB with a unique index + Redis cache + redirect.

---

##### 8. Design large-file upload to S3 with processing

*(Asked 1×: Kyndryl)*

==>
1. Client asks the backend to start an upload (`POST /uploads`).
2. Backend starts an **S3 multipart upload** and returns **pre-signed URLs**, one per part (e.g.
   10 MB parts).
3. Client uploads the parts **directly to S3**, in parallel, retrying only failed parts. The file
   never passes through our server.
4. Client calls `POST /uploads/:id/complete` → backend calls `CompleteMultipartUpload`.
5. S3 fires an **ObjectCreated** event → **SQS** (buffer + retries + DLQ).
6. A **Lambda** (up to 15 min) or an **ECS Fargate** worker / **Step Functions** (longer jobs)
   processes the file: virus scan, resize, parse.
7. Save status in the DB and notify the user (WebSocket / email).

```text
Client --start upload--------> API --> S3 CreateMultipartUpload + pre-signed URLs
Client --PUT parts directly--> S3 --ObjectCreated--> SQS --> Lambda / Fargate --> DB + notify
```

Also mention: S3 **lifecycle rule** to abort incomplete multipart uploads, and size/type checks
before signing URLs.

In short: pre-signed multipart upload straight to S3, then event → queue → worker.

---

##### 9. Image upload feature: React front end, Node.js back end, MongoDB. API endpoints, data flow and schema

*(Asked 1×: Bitwise Global)*

==> **Flow**
1. React: `<input type="file">` → add the file to `FormData` → `POST /api/images`.
2. Express + **multer** receives the file and checks type (jpg/png/webp) and size (e.g. 5 MB max).
3. Store the **file in S3** (or disk), **not inside MongoDB**.
4. Save **metadata + URL** in MongoDB.
5. Return the record; React shows the image from its `url`.

For big files: the backend returns a **pre-signed URL** and React uploads straight to S3.

**API endpoints**
- `POST /api/images` – upload
- `GET /api/images?page=1&limit=20` – list with pagination
- `GET /api/images/:id` – one image
- `DELETE /api/images/:id` – delete the S3 object + the record

```text
React --FormData--> Express (multer) --file------> S3
                                     --metadata--> MongoDB
React <-- { _id, url } --
```

```js
// Express route
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

app.post('/api/images', auth, upload.single('image'), async (req, res) => {
  const key = `images/${Date.now()}-${req.file.originalname}`;
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: req.file.buffer }));
  const img = await Image.create({
    userId: req.user.id, key, url: `https://${BUCKET}.s3.amazonaws.com/${key}`,
    originalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size,
  });
  res.status(201).json(img);
});

// Mongoose schema
const imageSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  url:          { type: String, required: true },
  key:          String,          // S3 object key, used to delete
  originalName: String,
  mimeType:     String,
  size:         Number,
}, { timestamps: true });
```

In short: file → S3, metadata → MongoDB, React shows it by URL.

---

##### 10. What is MVC architecture?

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> **MVC = Model – View – Controller**: split the code into 3 jobs.
- **Model** – data and DB logic (Mongoose / Sequelize models, Laravel Eloquent models).
- **View** – what the user gets back (EJS / Blade template, or JSON for an API).
- **Controller** – receives the request, calls the model, returns the view/response.

In Express: `routes/` → `controllers/` → `models/`, usually with a `services/` layer for
business logic so controllers stay thin.

```text
Request -> Route -> Controller -> Service -> Model -> DB
                        |
                        v
                View / JSON response
```

```js
// routes/users.js
router.get('/:id', userController.show);

// controllers/userController.js
exports.show = async (req, res) => {
  const user = await User.findById(req.params.id);   // Model
  res.json(user);                                     // View (JSON)
};
```

Benefit: clean separation – easy to test, maintain and change one part without breaking others.

In short: Model = data, View = output, Controller = glue between them.

---

##### 11. Did you handle any production issues?

*(Asked 1×: TCS)*

==> Sample answer: "Yes. I've handled performance, deployment and outage issues."
- **Slow APIs at peak traffic:** CloudWatch showed p95 latency jumping to ~4 s. Logs pointed to a
  MySQL query doing a full table scan. I added a composite index and a Redis cache for the hot
  endpoint, and latency dropped to ~300 ms.
- **Bad deployment:** a release broke login because of a missing environment variable. I rolled
  back to the previous version in minutes, fixed the config, added an env check at startup and
  redeployed.

My steps for any incident:
1. Check impact and alerts – who is affected, since when.
2. Read logs / metrics / traces to find the root cause.
3. Restore service fast – rollback, restart, feature flag off.
4. Permanent fix with a test.
5. Write a short **post-mortem** and add monitoring/alerts so it doesn't happen again.

Interview tip: answer in **STAR** format (Situation, Task, Action, Result) and give numbers.

In short: detect → find root cause → restore fast → fix properly → prevent repeat.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

##### 12. Serverless vs containers

*(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> Neither one makes you manage physical servers, but they run your code differently:
- **Serverless** (AWS Lambda, Azure Functions): you upload **functions**; the cloud runs them per
  event, scales automatically (even to zero), and bills per request + execution time.
- **Containers** (Docker on ECS, EKS/Kubernetes): you package the **whole app** with its runtime;
  it runs as a **long-lived process** that you size and scale.

```text
+------------+-----------------------------------+------------------------------------------+
| Point      | Serverless                        | Containers                               |
+============+===================================+==========================================+
| Unit       | Function                          | Whole app / service                      |
+------------+-----------------------------------+------------------------------------------+
| Scaling    | Automatic, down to zero           | You configure (replicas, auto-scaling)   |
+------------+-----------------------------------+------------------------------------------+
| Cost       | Pay per use; cheap for low or     | Pay for running instances; cheaper for   |
|            | spiky traffic                     | steady high traffic                      |
+------------+-----------------------------------+------------------------------------------+
| Cold start | Yes, first call can be slow       | No, process is already running           |
+------------+-----------------------------------+------------------------------------------+
| Limits     | Lambda: 15 min max, 10 GB memory, | Few limits, full control                 |
|            | stateless                         |                                          |
+------------+-----------------------------------+------------------------------------------+
| Good for   | Webhooks, cron jobs, S3/SQS event | Long-running APIs, WebSockets, heavy or  |
|            | processing, small APIs            | steady workloads                         |
+------------+-----------------------------------+------------------------------------------+
```

In short: serverless = no servers, pay per use, cold starts; containers = more control, better
for steady and long-running work.

---

##### 13. What does a typical production Node.js architecture look like?

*(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A common setup:
1. Client (web/mobile) → **CDN** (CloudFront) for static files.
2. **Load balancer / reverse proxy** (Nginx, AWS ALB) with HTTPS.
3. Several **stateless Node.js instances** (PM2 cluster, Docker containers on ECS, Kubernetes
   pods).
4. **Database** (PostgreSQL / MySQL / MongoDB) with replicas and backups.
5. **Redis** for cache, sessions and rate limiting.
6. **Queue + workers** (BullMQ, RabbitMQ, SQS) for background jobs: emails, reports.
7. **Object storage** (S3) for files.
8. **Observability + CI/CD**: logs (Pino/Winston → ELK/CloudWatch), metrics (Prometheus/Grafana),
   alerts, and a GitHub Actions pipeline.

```text
Client -> CDN -> ALB / Nginx -> Node instances (x N) -> DB (primary + replicas)
                                        |-> Redis (cache, sessions)
                                        |-> Queue -> Workers
                                        |-> S3
```

Inside the app: **layers** – routes → controllers → services → repositories/models, plus
middleware for auth, validation and error handling; config from environment variables.

In short: CDN + load balancer + many stateless Node instances + DB + Redis + queue/workers +
monitoring.

---

##### 14. Horizontal vs vertical scaling; how do you scale a Node.js app (stateless servers, Redis, queues)?

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js revision PDF)*

==> **Vertical scaling** = a bigger machine (more CPU/RAM). Simple, but it has a hard limit and
is a single point of failure.

**Horizontal scaling** = more machines/instances behind a load balancer. Nearly no limit and
fault tolerant, but the app must be **stateless**.

How to scale a Node.js app:
- **Use all CPU cores** – Node runs your JS on one thread, so use the `cluster` module or PM2
  cluster mode (one process per core).
- **Stateless servers** – no sessions or uploads in local memory/disk: sessions in Redis, files
  in S3, or JWT.
- **Load balancer** in front of many instances (Nginx, ALB, Kubernetes Service).
- **Cache** hot data in Redis to cut DB load.
- **Queues** – move slow work (emails, PDFs) to BullMQ / RabbitMQ / SQS workers.
- **Scale the DB** – indexes, read replicas, connection pooling, sharding if needed.
- **worker_threads** for CPU-heavy tasks so the event loop isn't blocked.

```js
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();   // one worker per core
} else {
  require('./server');   // each worker runs the HTTP server on the same port
}
// On an 8-core machine → 8 Node processes sharing port 3000
```

In short: vertical = bigger machine; horizontal = more machines. Scale Node with clustering,
stateless servers, Redis, queues and a load balancer.

---

##### 15. What is a load balancer? Load-balancing strategies (round robin, least connections, IP hash)

*(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A **load balancer** sits in front of many servers and spreads incoming requests across them.
- Benefits: more capacity, no single point of failure, **health checks** (stops sending traffic
  to dead servers), **SSL termination**.
- Examples: Nginx, HAProxy, AWS **ALB** (HTTP, L7) / **NLB** (TCP, L4).

```text
+----------------------+-------------------------------------+-------------------------------+
| Strategy             | How it works                        | Good for                      |
+======================+=====================================+===============================+
| Round robin          | Servers take turns: 1, 2, 3, 1 ...  | Equal servers, similar        |
|                      |                                     | requests                      |
+----------------------+-------------------------------------+-------------------------------+
| Weighted round robin | Bigger servers get more requests    | Mixed server sizes            |
+----------------------+-------------------------------------+-------------------------------+
| Least connections    | Goes to the server with the fewest  | Long or uneven requests       |
|                      | active connections                  | (WebSockets, uploads)         |
+----------------------+-------------------------------------+-------------------------------+
| IP hash              | Hash of client IP picks the server, | Sticky sessions               |
|                      | so a client keeps the same server   |                               |
+----------------------+-------------------------------------+-------------------------------+
```

```nginx
upstream api {
  least_conn;                 # strategy (default is round robin)
  server 10.0.0.1:3000;
  server 10.0.0.2:3000;
}
server { listen 80; location / { proxy_pass http://api; } }
```

Interview tip: sticky sessions are a workaround; better to keep servers stateless and store
sessions in Redis.

In short: a load balancer spreads traffic; pick the strategy by server sizes and request length.

---

##### 16. What is an API gateway? How is it different from a load balancer?

*(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> An **API gateway** is the **single front door** for all clients in a microservices system.
It routes each request to the right service and handles shared concerns in one place:
- **Auth** / JWT check
- **Rate limiting** and throttling
- **Routing by path**: `/users` → user service, `/orders` → order service
- Request/response transformation, combining several services into one response
- Logging, monitoring, caching

Examples: **AWS API Gateway**, Kong, Nginx, Apigee.

```text
+----------------+--------------------------------------+---------------------------------------+
| Point          | Load balancer                        | API gateway                           |
+================+======================================+=======================================+
| Main job       | Spread traffic across copies of the  | Route requests to different services  |
|                | same service                         |                                       |
+----------------+--------------------------------------+---------------------------------------+
| Works at       | L4 (TCP) or L7 (HTTP)                | L7 (API level)                        |
+----------------+--------------------------------------+---------------------------------------+
| Extra features | Health checks, SSL termination       | Auth, rate limits, API keys,          |
|                |                                      | transformation, analytics             |
+----------------+--------------------------------------+---------------------------------------+
```

They're often used together: client → API gateway → load balancer → service instances.

In short: load balancer = share load among identical servers; API gateway = smart front door
that routes and secures APIs.

---

##### 17. REST vs GraphQL

*(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> Two ways to build an API:
- **REST**: many endpoints, one per resource (`GET /users/1`, `GET /users/1/posts`); uses
  HTTP methods and status codes.
- **GraphQL**: one endpoint (`POST /graphql`); the client sends a **query** naming exactly the
  fields it needs. In Node: Apollo Server.

```text
+--------------------+------------------------------------+-------------------------------------+
| Point              | REST                               | GraphQL                             |
+====================+====================================+=====================================+
| Endpoints          | Many                               | One                                 |
+--------------------+------------------------------------+-------------------------------------+
| Data returned      | Fixed by the server (over- or      | Exactly what the client asks for    |
|                    | under-fetching)                    |                                     |
+--------------------+------------------------------------+-------------------------------------+
| Several resources  | Often several requests             | One request                         |
+--------------------+------------------------------------+-------------------------------------+
| HTTP caching       | Easy (GET + URL)                   | Harder (usually POST)               |
+--------------------+------------------------------------+-------------------------------------+
| Versioning         | /v1, /v2                           | Evolve schema, deprecate fields     |
+--------------------+------------------------------------+-------------------------------------+
| Typing             | Optional (OpenAPI)                 | Strongly typed schema built in      |
+--------------------+------------------------------------+-------------------------------------+
| Watch out          | Over-fetching, many round trips    | N+1 queries (use DataLoader), deep  |
|                    |                                    | query limits                        |
+--------------------+------------------------------------+-------------------------------------+
```

```graphql
query {
  user(id: 1) { name posts { title } }
}
```

Output:

```json
{ "data": { "user": { "name": "Asha", "posts": [{ "title": "Hello" }] } } }
```

In short: REST is simple and cache-friendly; GraphQL gets exactly the needed data in one request.

---

##### 18. What is a webhook?

*(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A **webhook** is an HTTP callback: when an event happens in another system, **that system
sends an HTTP POST to a URL you registered**. Push instead of you polling again and again.
- Example: Stripe / Razorpay calls `POST /webhooks/payment` when a payment succeeds; GitHub calls
  your URL on every push.

Best practices:
- **Verify the signature** (HMAC header) so you know the request is genuine.
- **Reply fast** with 2xx, then do heavy work in a queue.
- Make the handler **idempotent**: the sender retries, so the same event can arrive twice – store
  the event ID and skip duplicates.

```js
app.post('/webhooks/payment', express.raw({ type: 'application/json' }), async (req, res) => {
  const event = stripe.webhooks.constructEvent(       // throws if the signature is wrong
    req.body, req.headers['stripe-signature'], process.env.WEBHOOK_SECRET);

  if (await Event.exists({ id: event.id })) return res.sendStatus(200); // duplicate
  await queue.add('payment', event);                  // process later
  res.sendStatus(200);
});
```

In short: a webhook is another service calling your API when an event happens – verify it, reply
fast, handle duplicates.

======================================================================================================================================

## What to study first

```
MVC architecture        (how one app's code is organized)
   ↓
MERN stack              (React + Express + Node + MongoDB end to end)
   ↓
Monolith vs microservices vs serverless   (ways to split and run an app)
   ↓
Microservice communication & circuit breaker   (sync/async calls, failures)
   ↓
System design scenarios (URL shortener, image upload, large S3 upload)
   ↓
Production issues       (monitoring, rollback, root cause)
```

MVC and the MERN stack are the foundation: they explain how one app is built. Microservices,
distributed systems and circuit breakers build on that to split the app across services. The system
design scenarios combine all of it, and production issues show how you keep it running.
