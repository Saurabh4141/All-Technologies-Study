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
