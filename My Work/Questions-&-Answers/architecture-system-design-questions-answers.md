# Architecture & System Design – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is the MERN stack? Explain its architecture
   *(Asked 2×: TCS (online), Technovert)*

==> MERN = **MongoDB + Express.js + React + Node.js**, a full-stack app written fully in JavaScript.
    - **React** – front end (UI in the browser).
    - **Express.js** – web framework on Node.js for routes/APIs.
    - **Node.js** – runs JavaScript on the server.
    - **MongoDB** – NoSQL database storing JSON-like documents.
    Flow: React calls a REST API (fetch/axios) → Express route → controller → Mongoose model →
    MongoDB → JSON back to React.

    ```
    React (browser)  ──HTTP/JSON──>  Node.js + Express (API)  ──Mongoose──>  MongoDB
           <────────── JSON ─────────          <──────── documents ────────
    ```

    In short: 3-tier app (UI, API, DB) with one language (JavaScript) everywhere.

---

2. Monolith vs microservices vs serverless
   *(Asked 1×: Algoworks)*

==> Comparison:

    +------------+-------------------------+------------------------------------------+---------------------------------------+
    | Feature    | Monolith                | Microservices                            | Serverless                            |
    +============+=========================+==========================================+=======================================+
    | Structure  | One big app, one deploy | Many small services, each deployed alone | Small functions run on events         |
    +------------+-------------------------+------------------------------------------+---------------------------------------+
    | Scaling    | Scale whole app         | Scale each service                       | Auto-scales per request               |
    +------------+-------------------------+------------------------------------------+---------------------------------------+
    | Servers    | You manage              | You manage (often containers)            | Cloud manages                         |
    +------------+-------------------------+------------------------------------------+---------------------------------------+
    | Complexity | Simple to start         | Higher (network, many services)          | Low ops, but cold starts, time limits |
    +------------+-------------------------+------------------------------------------+---------------------------------------+
    | Cost       | Fixed server cost       | Fixed + more infra                       | Pay per use                           |
    +------------+-------------------------+------------------------------------------+---------------------------------------+
    | Example    | Classic Express app     | Netflix                                  | AWS Lambda                            |
    +------------+-------------------------+------------------------------------------+---------------------------------------+

    Interview tip: start with a monolith for small teams; move to microservices when parts need to
    scale or deploy independently.

---

3. What are microservices and why do we prefer them?
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> Microservices = the app is split into small, independent services, each doing one business job
    (users, orders, payments), each with its own database, talking over APIs or messages.
    Why we prefer them:
    - **Independent deploy** – change one service without redeploying all.
    - **Independent scaling** – scale only the busy service.
    - **Fault isolation** – one service failing does not crash everything.
    - **Team ownership** – small teams own small services; can use different tech.
    Downsides: more complex (network calls, monitoring, data consistency).

---

4. How do microservices communicate?
   *(Asked 1×: Algoworks)*

==> Two ways:
    - **Synchronous** (wait for reply): REST/HTTP, gRPC, GraphQL.
    - **Asynchronous** (send and move on): message queues and events – SQS, RabbitMQ, Kafka, SNS.

    +-----------------------+---------------------------------+--------------------------------------------+
    |                       | Synchronous                     | Asynchronous                               |
    +=======================+=================================+============================================+
    | Example               | Order service calls Payment API | Order service publishes "OrderPlaced"      |
    |                       |                                 | event                                      |
    +-----------------------+---------------------------------+--------------------------------------------+
    | Coupling              | Tight                           | Loose                                      |
    +-----------------------+---------------------------------+--------------------------------------------+
    | If other side is down | Call fails                      | Message waits in queue                     |
    +-----------------------+---------------------------------+--------------------------------------------+

    An **API Gateway** is usually the single entry point for clients.

---

5. What is a distributed environment?
   *(Asked 1×: TechM)*

==> A distributed environment (distributed system) is when an app runs on **many computers/servers
    connected over a network** that work together like one system.
    - Example: microservices on different servers, a DB cluster, load-balanced Node.js instances.
    - Benefits: scalability, high availability, fault tolerance.
    - Challenges: network failures, latency, keeping data consistent, tracing requests (use tools
      like X-Ray).

---

6. What is a circuit breaker?
   *(Asked 1×: Senior Node.js round (YT))*

==> A circuit breaker is a pattern that **stops calling a failing service for a while**, so failures
    don't pile up and the whole system stays fast.
    It has 3 states (like an electric breaker):
    - **Closed** – normal, calls go through; failures are counted.
    - **Open** – too many failures → calls fail fast at once (or return a fallback) without calling
      the service.
    - **Half-open** – after a timeout, a few test calls are allowed; if they work → Closed, else →
      Open again.

    ```js
    // Node.js example with the "opossum" library
    import CircuitBreaker from "opossum";

    const breaker = new CircuitBreaker(callPaymentService, {
      timeout: 3000,                 // a call slower than 3 s counts as failure
      errorThresholdPercentage: 50,  // open when 50% of calls fail
      resetTimeout: 10000,           // try again (half-open) after 10 s
    });
    breaker.fallback(() => ({ status: "payment service busy, try later" }));

    const result = await breaker.fire(orderId);
    ```

---

7. Design a URL shortener
   *(Asked 1×: Irpgrammer Solutions)*

==>
    1. **POST /shorten** – client sends the long URL.
    2. Create a unique short key (e.g. base62 of an auto-increment id, or a random 7-char string;
       check it is not taken).
    3. Save `key → long URL` in the DB.
    4. Return the short URL, e.g. `https://sho.rt/aZ3x9Qk`.
    5. **GET /:key** – look up the key (check Redis cache first, then DB).
    6. Not found → 404; found → **redirect (301/302)** to the long URL.
    7. Scale: cache hot keys in Redis, index on `key`, optionally count clicks async.

    ```
    Client ──POST /shorten──> API ──> DB (urls: id, short_key UNIQUE, long_url, created_at)
    Client ──GET /aZ3x9Qk───> API ──> Redis cache ──miss──> DB
            <──302 redirect to long URL──
    ```

---

8. Design large-file upload to S3 with processing
   *(Asked 1×: Kyndryl)*

==>
    1. Client asks the backend for upload URLs.
    2. Backend creates **pre-signed URLs** with **S3 multipart upload** (file split into parts,
       uploaded in parallel, retry only failed parts).
    3. Client uploads **directly to S3** (no load on our server).
    4. S3 fires an **ObjectCreated event** after upload completes.
    5. Event → **SQS** (buffer, retries) → **Lambda** processes it (use ECS/Fargate or Step
       Functions for jobs over 15 min).
    6. Save status/result in DB and notify the user.

    ```
    Client ──get pre-signed URL──> API
    Client ──multipart upload────> S3 ──event──> SQS ──> Lambda/Fargate ──> DB + notify
    ```

---

9. Image upload feature: React front end, Node.js back end, MongoDB. API endpoints, data flow and
   schema
   *(Asked 1×: Bitwise Global)*

==>
    1. React: `<input type="file">` → put file in `FormData` → `POST /api/images`.
    2. Node.js (Express + **multer**) receives the file, checks type (jpg/png) and size limit.
    3. Store the **file in S3/cloud storage** (or disk), not inside MongoDB.
    4. Save **metadata + URL** in MongoDB.
    5. Return the saved record; React shows the image using its `url`.
    (For big files: backend gives a pre-signed URL and React uploads straight to S3.)

    API endpoints:
    - `POST /api/images` – upload
    - `GET /api/images` – list (with pagination)
    - `GET /api/images/:id` – one image
    - `DELETE /api/images/:id` – delete file + record

    ```
    React ──FormData──> Express (multer) ──file──> S3
                              └──metadata──> MongoDB
    React <──── { _id, url } ────
    ```

    ```js
    // Mongoose schema
    const imageSchema = new mongoose.Schema({
      userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      url:          { type: String, required: true },
      key:          String,          // S3 object key, used to delete
      originalName: String,
      mimeType:     String,
      size:         Number,
    }, { timestamps: true });
    ```

---

10. What is MVC architecture?
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> MVC = **Model – View – Controller**, a way to split code into 3 parts:
    - **Model** – data and DB logic (e.g. Mongoose/Sequelize models).
    - **View** – what the user sees (HTML template, or React / JSON response for APIs).
    - **Controller** – takes the request, uses the model, sends back the view/response.
    In Express: `routes/` → `controllers/` → `models/`, often with a `services/` layer for business
    logic.

    ```
    Request → Route → Controller → Model → DB
                         ↓
                   View / JSON response
    ```

    Benefit: clean, easy to test and maintain, and each part can change on its own.

---

11. Did you handle any production issues?
   *(Asked 1×: TCS)*

==> Sample answer: "Yes. I handled API, deployment and performance issues."
    - **Issue 1 – slow APIs at peak traffic:** I checked logs and metrics (CloudWatch), found a slow
      DB query, added an index and Redis caching. Response time dropped a lot.
    - **Issue 2 – bad deployment:** a release failed because of a wrong environment variable. I
      rolled back to the last version, fixed the config and redeployed.
    My steps for any issue:
    1. Check impact and alerts.
    2. Read logs/metrics/traces to find the root cause.
    3. Quick fix or rollback to restore service.
    4. Permanent fix with tests.
    5. Write a short post-mortem and add monitoring so it doesn't repeat.

    Interview tip: use the STAR format (Situation, Task, Action, Result) and give numbers if you
    can.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

12. Serverless vs containers
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> Both run your code without managing physical servers, but in different ways.
    - Serverless (AWS Lambda, Azure Functions): you upload functions; the cloud runs them per event
      and scales them automatically. You pay per request/execution time.
    - Containers (Docker on Kubernetes, ECS): you package the whole app with its runtime; it runs as
      a long-lived process that you scale and configure.

    +------------+--------------------------------------------+--------------------------------------------+
    | Point      | Serverless                                 | Containers                                 |
    +============+============================================+============================================+
    | Unit       | Function                                   | Whole app/service                          |
    +------------+--------------------------------------------+--------------------------------------------+
    | Scaling    | Automatic, to zero                         | You configure (auto-scaling, replicas)     |
    +------------+--------------------------------------------+--------------------------------------------+
    | Cost       | Pay per use; cheap for low/spiky traffic   | Pay for running instances; cheaper for     |
    |            |                                            | steady high traffic                        |
    +------------+--------------------------------------------+--------------------------------------------+
    | Cold start | Yes, first call can be slow                | No (process already running)               |
    +------------+--------------------------------------------+--------------------------------------------+
    | Limits     | Max run time, memory, no long connections  | Few limits, full control                   |
    +------------+--------------------------------------------+--------------------------------------------+
    | Good for   | Webhooks, cron jobs, event processing,     | Long-running APIs, WebSockets, complex     |
    |            | small APIs                                 | apps                                       |
    +------------+--------------------------------------------+--------------------------------------------+

    In short: Serverless = no server management, pay per use, cold starts; containers = more
    control, better for steady and long-running workloads.

---

13. What does a typical production Node.js architecture look like?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A common setup:
    1. Client (web/mobile) -> CDN for static files.
    2. Load balancer / reverse proxy (Nginx, AWS ALB) with HTTPS.
    3. Several stateless Node.js instances (PM2 cluster, Docker containers or Kubernetes pods).
    4. Database (PostgreSQL/MySQL/MongoDB) with replicas and backups.
    5. Redis for cache, sessions and rate limiting.
    6. Message queue (RabbitMQ, Kafka, SQS, BullMQ) + worker processes for background jobs (emails,
       reports).
    7. Object storage (S3) for files.
    8. Logging, monitoring and alerts (Winston/Pino, Prometheus/Grafana, ELK), and CI/CD pipeline.

    Inside the app: layered code - routes -> controllers -> services -> data access
    (models/repositories), plus middleware for auth, validation and error handling; config from
    environment variables.

    In short: CDN + load balancer + many stateless Node instances + DB + Redis + queue/workers +
    monitoring.

---

14. Horizontal vs vertical scaling; how do you scale a Node.js app (stateless servers, Redis,
   queues)?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> Vertical scaling = make one machine bigger (more CPU/RAM). Simple, but has a hard limit and is a
    single point of failure.
    Horizontal scaling = add more machines/instances behind a load balancer. Almost no limit and
    fault tolerant, but the app must be stateless.

    How to scale a Node.js app:
    - Use all CPU cores: Node runs JavaScript on one thread, so use the `cluster` module or PM2
      cluster mode (one worker per core).
    - Keep servers stateless: no sessions or uploads in local memory/disk. Store sessions in Redis,
      files in S3, tokens as JWT.
    - Add a load balancer in front of many instances (Nginx, ALB, Kubernetes).
    - Cache hot data in Redis to reduce DB load.
    - Move heavy or slow work to a queue (BullMQ, RabbitMQ, SQS) and process it with workers.
    - Scale the DB: indexes, read replicas, connection pooling, sharding if needed.
    - Use worker_threads for CPU-heavy tasks so the event loop is not blocked.

    ```js
    const cluster = require('cluster');
    const os = require('os');

    if (cluster.isPrimary) {
      for (let i = 0; i < os.cpus().length; i++) cluster.fork();
    } else {
      require('./server'); // each worker runs the HTTP server
    }
    ```

    In short: Vertical = bigger machine; horizontal = more machines. Scale Node by clustering,
    stateless servers, Redis, queues and a load balancer.

---

15. What is a load balancer? Load-balancing strategies (round robin, least connections, IP hash)
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A load balancer sits in front of many servers and spreads incoming requests across them.
    Benefits: more capacity, no single point of failure, health checks (removes dead servers), and
    SSL termination. Examples: Nginx, HAProxy, AWS ALB/NLB.

    +----------------------+--------------------------------------------+--------------------------------------------+
    | Strategy             | How it works                               | Good for                                   |
    +======================+============================================+============================================+
    | Round robin          | Send to servers one by one in turn         | Servers of equal power, similar requests   |
    +----------------------+--------------------------------------------+--------------------------------------------+
    | Weighted round robin | Stronger servers get more requests         | Mixed server sizes                         |
    +----------------------+--------------------------------------------+--------------------------------------------+
    | Least connections    | Send to the server with the fewest active  | Long or uneven requests (WebSockets,       |
    |                      | connections                                | uploads)                                   |
    +----------------------+--------------------------------------------+--------------------------------------------+
    | IP hash              | Hash of client IP picks the server, so the | Sticky sessions                            |
    |                      | same client goes to the same server        |                                            |
    +----------------------+--------------------------------------------+--------------------------------------------+

    Interview tip: sticky sessions (IP hash) are a workaround; better to keep servers stateless and
    store sessions in Redis.

    In short: A load balancer spreads traffic across servers; pick the strategy based on server
    sizes and request patterns.

---

16. What is an API gateway? How is it different from a load balancer?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> An API gateway is a single entry point for all clients in a microservices system. It receives a
    request and routes it to the right service.
    It also handles common concerns in one place:
    - Authentication / JWT check
    - Rate limiting and throttling
    - Request routing by path (`/users` -> user service, `/orders` -> order service)
    - Request/response transformation, aggregation of several services
    - Logging, monitoring, caching
    Examples: Kong, AWS API Gateway, Nginx, Express Gateway.

    +----------------+--------------------------------------------+--------------------------------------------+
    | Point          | Load balancer                              | API gateway                                |
    +================+============================================+============================================+
    | Main job       | Spread traffic across copies of the same   | Route requests to different services       |
    |                | service                                    |                                            |
    +----------------+--------------------------------------------+--------------------------------------------+
    | Works at       | Network level (L4) or HTTP (L7)            | Application/API level (L7)                 |
    +----------------+--------------------------------------------+--------------------------------------------+
    | Extra features | Health checks, SSL termination             | Auth, rate limiting, transformation, API   |
    |                |                                            | keys, analytics                            |
    +----------------+--------------------------------------------+--------------------------------------------+

    They are often used together: client -> API gateway -> load balancer -> service instances.

    In short: Load balancer = share load among identical servers; API gateway = smart front door
    that routes and secures APIs.

---

17. REST vs GraphQL
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> Both are ways to build APIs.
    - REST: many endpoints, one per resource (`GET /users/1`, `GET /users/1/posts`). Uses HTTP
      methods and status codes.
    - GraphQL: one endpoint (`POST /graphql`); the client sends a query saying exactly which fields
      it needs.

    +--------------------+--------------------------------------------+--------------------------------------------+
    | Point              | REST                                       | GraphQL                                    |
    +====================+============================================+============================================+
    | Endpoints          | Many                                       | One                                        |
    +--------------------+--------------------------------------------+--------------------------------------------+
    | Data returned      | Fixed by server (over/under-fetching       | Exactly what the client asks for           |
    |                    | possible)                                  |                                            |
    +--------------------+--------------------------------------------+--------------------------------------------+
    | Multiple resources | Often several requests                     | One request                                |
    +--------------------+--------------------------------------------+--------------------------------------------+
    | HTTP caching       | Easy (GET + URLs)                          | Harder (usually POST)                      |
    +--------------------+--------------------------------------------+--------------------------------------------+
    | Versioning         | /v1, /v2                                   | Evolve schema, deprecate fields            |
    +--------------------+--------------------------------------------+--------------------------------------------+
    | Typing             | Optional (OpenAPI)                         | Strongly typed schema built in             |
    +--------------------+--------------------------------------------+--------------------------------------------+
    | Watch out          | Over-fetching, many round trips            | N+1 queries (use DataLoader), complex      |
    |                    |                                            | queries, rate limiting                     |
    +--------------------+--------------------------------------------+--------------------------------------------+

    ```graphql
    query {
      user(id: 1) { name posts { title } }
    }
    ```

    In short: REST is simple and cache-friendly; GraphQL lets the client fetch exactly what it needs
    in one request.

---

18. What is a webhook?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A webhook is an HTTP callback: when an event happens in another system, that system sends an
    HTTP POST to a URL you registered. It is "push" instead of you polling again and again.
    - Example: Stripe/Razorpay calls `POST /webhooks/payment` when a payment succeeds; GitHub calls
      your URL on a push.
    Best practices:
    - Verify the signature (HMAC header) so you know the request is genuine.
    - Respond quickly with 2xx, then do heavy work in a queue.
    - Make the handler idempotent: the sender may retry, so the same event can arrive twice (store
      the event ID).

    ```js
    app.post('/webhooks/payment', express.raw({ type: 'application/json' }), (req, res) => {
      // verify signature using req.body (raw) and the secret
      res.sendStatus(200);
      queue.add('payment', JSON.parse(req.body)); // process later
    });
    ```

    In short: A webhook is the other service calling your API when an event happens; verify it,
    reply fast, handle duplicates.

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
