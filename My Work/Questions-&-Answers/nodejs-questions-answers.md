# Node.js – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

# What is Node.js?
 -- Node.js is a JavaScript runtime that allows us to execute JavaScript outside the browser, such as on a server.
 -- It uses the V8 JavaScript engine and supports asynchronous, non-blocking I/O


*** JavaScript & Node.js Execution Order *** 

┌───────────────────────────────────────┐
│ 1. SYNCHRONOUS JAVASCRIPT             │
│    ├── Normal statements              │
│    ├── Function calls                 │
│    ├── Loops                          │
│    └── Synchronous callbacks          │
└──────────────────┬────────────────────┘
                   ▼
┌──────────────────────────────────────┐           ===== > There Is No process.nextTick in JavaScript , So No 2nd Step in JavaScript
│ 2. process.nextTick() QUEUE          │
│    └── process.nextTick(callback)    │
└──────────────────┬───────────────────┘
                   ▼
┌───────────────────────────────────────┐
│ 3. MICROTASK QUEUE                    │
│    ├── Promise.then()                 │
│    ├── Promise.catch()                │
│    ├── Promise.finally()              │
│    ├── queueMicrotask()               │
│    └── async/await continuations      │
└──────────────────┬────────────────────┘
                   ▼
┌───────────────────────────────────────┐
│ 4. EVENT LOOP                         │
│                                       │
│    ├── Timers                         │
│    │   ├── setTimeout()               │
│    │   └── setInterval()              │
│    │                                  │
│    ├── Pending callbacks              │
│    ├── Idle / Prepare (internal)      │
│    ├── Poll                           │
│    │   └── I/O callbacks              │
│    ├── Check                          │
│    │   └── setImmediate()             │          ===== > There Is No setImmediate()  in JavaScript
│    └── Close callbacks                │
└───────────────────────────────────────┘



=======================================================

---

1. What is the event loop? How does it work and manage asynchronous operations?
   *(Asked 4×: Persistent Systems, TCS (online), Fundwave, Hyland Software)*

==> An event loop is a general programming pattern: a loop that waits for events (I/O finished,
    timer fired, user click) and runs their callbacks one by one on a single thread. Browsers,
    Deno, Python asyncio and GUI toolkits all have one.

    In Node.js, the event loop (provided by libuv) decides **when each callback gets to run**.
    - JavaScript runs on one main thread (the call stack).
    - Slow work (file read, DB query, network call, timer) is handed off to the OS or libuv (Node's
      C library for async I/O).
    - When that work finishes, its callback is put in a queue.
    - When the call stack is empty, the event loop picks callbacks from the queues and runs them.
    - Order: sync code → `process.nextTick` → Promise microtasks → event loop phases (timers, poll,
      check, ...).

    ```js
    console.log('1');                          // sync
    setTimeout(() => console.log('4'), 0);     // timers phase
    Promise.resolve().then(() => console.log('3')); // microtask
    console.log('2');                          // sync
    // Output: 1 2 3 4
    ```

    In short: the event loop lets one thread handle many async tasks without waiting (blocking).

---

2. What is middleware? Write a custom middleware function
   *(Asked 4×: Persistent Systems, TCS (online), Capsitech, EarlyCoder 5-yr Node (YT))*

==> Middleware is a general concept: code that runs **between the request coming in and the
    response going out** and handles a shared job (auth, logging...). Express, Laravel, Django and
    ASP.NET Core all use it.

    In Express.js, middleware is a function that gets `req`, `res` and `next`.
    - It can read/change `req`/`res`, end the request, or call `next()` to pass control on.
    - Uses: logging, authentication, validation, body parsing, error handling, rate limiting.
    - Types: application-level, router-level, built-in (`express.json()`), third-party (`cors`,
      `helmet`), error-handling.

    ```js
    const express = require('express');
    const app = express();

    // custom logger middleware
    function logger(req, res, next) {
      console.log(`${req.method} ${req.url}`);
      next(); // go to the next middleware / route
    }

    app.use(logger);
    app.get('/', (req, res) => res.send('Hello'));
    app.listen(3000);
    ```

    Interview tip: if you forget `next()` (and don't send a response) the request hangs.

---

3. Have you built real-time applications / used Socket.io? How did you integrate it?
   *(Asked 2×: EarlyCoder 5-yr Node (YT), Senior Node Ep.32 (YT))*

==> Sample answer: "Yes, I used Socket.io for real-time features like notifications / chat / live
    status updates. I attached Socket.io to the same HTTP server as Express, authenticated the
    connection with a JWT in the handshake, and used rooms to send events only to the right users."

    How it is integrated:
    1. Create the HTTP server from Express and attach Socket.io to it.
    2. Add `io.use()` middleware to check the JWT on connect.
    3. Listen for events with `socket.on`, send with `socket.emit` / `io.to(room).emit`.
    4. On the client, `io(url, { auth: { token } })`.

    ```js
    const http = require('http');
    const express = require('express');
    const { Server } = require('socket.io');

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
      socket.on('chat', (msg) => io.emit('chat', msg)); // send to everyone
    });

    server.listen(3000);
    ```

---

4. What is Express.js?
   *(Asked 2×: TCS (online), Technovert)*

==> Express.js is a small, popular **web framework for Node.js**.
    - Node.js gives the runtime; Express makes building servers and REST APIs easy.
    - Gives you simple routing (`app.get`, `app.post`), middleware, request/response helpers
      (`res.json`, `res.status`).
    - Much less code than using the raw `http` module.

    In short: Express = routing + middleware on top of Node's HTTP server.

---

5. How do you create a server in Express.js? Write a basic Express server with an API endpoint
   *(Asked 2×: Persistent Systems, Tech Mahindra (YT))*

==> Steps: `npm install express` → create the app → add middleware/routes → call `listen`.

    ```js
    const express = require('express');
    const app = express();

    app.use(express.json()); // parse JSON body

    app.get('/api/users', (req, res) => {
      res.json([{ id: 1, name: 'Saurabh' }]);
    });

    app.post('/api/users', (req, res) => {
      res.status(201).json({ id: 2, ...req.body });
    });

    app.listen(3000, () => console.log('Server running on port 3000'));
    ```

    Run: `node server.js`, then open `http://localhost:3000/api/users`.

---

6. If Node.js is single-threaded, how does it handle concurrency?
   *(Asked 2×: Kyndryl, Bajaj Finserv)*

==> With **non-blocking I/O + the event loop**.
    - Your JavaScript runs on one thread, but slow I/O (DB, files, network) is handed off to the OS
      / libuv thread pool.
    - While waiting, Node keeps serving other requests.
    - When the I/O is done, its callback is queued and the event loop runs it.
    - So many requests are "in progress" at once, even with one JS thread.

    In short: Node doesn't wait for I/O, so one thread can juggle thousands of requests. (CPU-heavy
    work is the exception – use worker threads for that.)

---

7. Which npm modules do you commonly use, and why that library (e.g. nodemon)?
   *(Asked 2×: Tech Mahindra (YT), Web3Dev)*

==> Sample answer:

    +-------------------------------------+--------------------------------------------+
    | Module                              | Why I use it                               |
    +=====================================+============================================+
    | `express`                           | Web framework – routing and middleware     |
    +-------------------------------------+--------------------------------------------+
    | `nodemon`                           | Dev tool – restarts the server             |
    |                                     | automatically when a file changes          |
    +-------------------------------------+--------------------------------------------+
    | `dotenv`                            | Loads config/secrets from a `.env` file    |
    |                                     | into `process.env`                         |
    +-------------------------------------+--------------------------------------------+
    | `jsonwebtoken`                      | Create and verify JWT tokens for auth      |
    +-------------------------------------+--------------------------------------------+
    | `bcrypt`                            | Hash passwords                             |
    +-------------------------------------+--------------------------------------------+
    | `mongoose` / `mysql2` / `sequelize` | Talk to the database                       |
    +-------------------------------------+--------------------------------------------+
    | `cors`                              | Allow requests from other origins (front   |
    |                                     | end)                                       |
    +-------------------------------------+--------------------------------------------+
    | `helmet`                            | Adds security HTTP headers                 |
    +-------------------------------------+--------------------------------------------+
    | `joi` / `express-validator`         | Validate request data                      |
    +-------------------------------------+--------------------------------------------+
    | `axios`                             | Call other APIs                            |
    +-------------------------------------+--------------------------------------------+
    | `winston` / `morgan`                | Logging                                    |
    +-------------------------------------+--------------------------------------------+
    | `jest` / `mocha`                    | Unit testing                               |
    +-------------------------------------+--------------------------------------------+

    Why nodemon: without it you must stop and restart `node app.js` after every change; nodemon
    watches files and restarts for you. Used only in development (`devDependencies`).

---

8. What is Node.js?
   *(Asked 2×: Algoworks, Technovert)*

==> Node.js is a **JavaScript runtime** that lets you run JavaScript outside the browser, mainly on
    servers.
    - Built on Chrome's **V8** engine (turns JS into machine code).
    - Uses **non-blocking, event-driven I/O**, so it handles many requests at once.
    - Great for APIs, real-time apps, microservices.
    - Comes with npm, the biggest package library.

    In short: Node.js = V8 + libuv (async I/O) + built-in modules like `fs`, `http`.

---

9. What are the phases of the Node.js event loop?
   *(Asked 1×: Senior Node.js round (YT))*

==> Each loop "tick" goes through these phases in order:

    +-----+-------------------+--------------------------------------------+
    | #   | Phase             | What runs here                             |
    +=====+===================+============================================+
    | 1   | Timers            | `setTimeout`, `setInterval` callbacks      |
    +-----+-------------------+--------------------------------------------+
    | 2   | Pending callbacks | Some system I/O callbacks delayed from     |
    |     |                   | last loop (e.g. TCP errors)                |
    +-----+-------------------+--------------------------------------------+
    | 3   | Idle / Prepare    | Internal use only                          |
    +-----+-------------------+--------------------------------------------+
    | 4   | Poll              | Gets new I/O events and runs I/O callbacks |
    |     |                   | (file, network); may wait here             |
    +-----+-------------------+--------------------------------------------+
    | 5   | Check             | `setImmediate` callbacks                   |
    +-----+-------------------+--------------------------------------------+
    | 6   | Close callbacks   | `close` events, e.g. `socket.on('close')`  |
    +-----+-------------------+--------------------------------------------+

    Between every callback, Node first empties the `process.nextTick` queue and then the Promise
    microtask queue.

---

10. Output: setTimeout vs Promise order
    *(Asked 1×: Hitachi)*

==>
    ```js
    console.log('Start');
    setTimeout(() => console.log('Timeout'), 0);
    Promise.resolve().then(() => console.log('Promise'));
    console.log('End');
    ```

    Output:

    ```
    Start
    End
    Promise
    Timeout
    ```

    Why:
    1. `Start` and `End` are sync, so they print first.
    2. `Promise.then` goes to the microtask queue; `setTimeout` goes to the timers (macrotask)
       queue.
    3. When the stack is empty, microtasks run before timers → `Promise`, then `Timeout`.

---

11. Output: console.log / setTimeout / Promise.then / process.nextTick order
    *(Asked 1×: Irpgrammer Solutions)*

==>
    ```js
    console.log('start');
    setTimeout(() => console.log('timeout'), 0);
    Promise.resolve().then(() => console.log('promise'));
    process.nextTick(() => console.log('nextTick'));
    console.log('end');
    ```

    Output:

    ```
    start
    end
    nextTick
    promise
    timeout
    ```

    Why:
    1. Sync code first → `start`, `end`.
    2. In Node, the `process.nextTick` queue runs before Promise microtasks → `nextTick`, then
       `promise`.
    3. Timers come last, in the event loop's timers phase → `timeout`.

---

12. Output: console.log, two Promise.then chains and setTimeout(0) (A D E C F B)
    *(Asked 1×: TechM)*

==>
    ```js
    console.log("A");

    Promise.resolve().then(() => {
      console.log("E");
    }).then(() => {
      console.log("F");
    });

    setTimeout(() => {
        console.log("B");
    }, 0);

    Promise.resolve().then(() => {
        console.log("C");
    });

    console.log("D");
    ```

    Output:

    ```
    A
    D
    E
    C
    F
    B
    ```

    Why:
    1. Sync first → `A`, `D`.
    2. Microtask queue starts with [E, C]. `E` runs, and only then is `F` (the next `.then`) added →
       queue is [C, F].
    3. So `C` then `F`.
    4. Timer (macrotask) runs last → `B`.

---

13. Output: console.log('first'), setTimeout logging 'second', console.log('third')
    *(Asked 1×: Tech Mahindra (YT))*

==>
    ```js
    console.log('first');
    setTimeout(() => console.log('second'), 0);
    console.log('third');
    ```

    Output:

    ```
    first
    third
    second
    ```

    Why: `setTimeout` never runs right away, even with 0 ms. Its callback waits in the timers queue
    until all sync code (`first`, `third`) is done.

---

14. What is the difference between an HTTP connection and a socket connection?
    *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==>
    +--------------------------------------------+--------------------------------------------+
    | HTTP connection                            | Socket (WebSocket) connection              |
    +============================================+============================================+
    | Request → response, then done              | Stays open (persistent)                    |
    +--------------------------------------------+--------------------------------------------+
    | Only the client starts communication       | Both client and server can send any time   |
    +--------------------------------------------+--------------------------------------------+
    | Server can't push data by itself           | Server can push data instantly             |
    +--------------------------------------------+--------------------------------------------+
    | Each request carries headers (more         | Small messages after the handshake         |
    | overhead)                                  |                                            |
    +--------------------------------------------+--------------------------------------------+
    | Stateless                                  | Stateful (server knows the connected       |
    |                                            | client)                                    |
    +--------------------------------------------+--------------------------------------------+
    | Good for normal REST APIs                  | Good for chat, notifications, live updates |
    +--------------------------------------------+--------------------------------------------+

    In short: HTTP = ask and get an answer; socket = an open two-way phone line.

---

15. How do you authenticate a socket connection? How do you pass the JWT?
    *(Asked 1×: Senior Node Ep.32 (YT))*

==> Check the JWT **once, during the handshake**, before the connection is accepted.
    1. Client sends the token in the `auth` object when connecting.
    2. Server uses `io.use()` middleware to `jwt.verify` it.
    3. If valid, save the user on `socket` and call `next()`; else `next(new Error('Unauthorized'))`
       and the connection is refused.

    ```js
    // client
    const socket = io('https://api.example.com', { auth: { token: accessToken } });

    // server
    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        socket.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
      } catch (err) {
        next(new Error('Unauthorized'));
      }
    });
    ```

---

16. Does the socket handshake start from the front end or the back end?
    *(Asked 1×: Senior Node Ep.32 (YT))*

==> From the **front end (client)**.
    - The client sends a normal HTTP request asking to "upgrade" to WebSocket.
    - The server checks it and replies `101 Switching Protocols`; now the connection is open both
      ways.
    - The server only listens; it never starts the connection.

---

17. How do you validate the token when there is no middleware on the front end?
    *(Asked 1×: Senior Node Ep.32 (YT))*

==> Validation is never done on the front end. The front end only **sends** the token; the
    **server** validates it.
    - On the server, Socket.io has its own middleware: `io.use((socket, next) => ...)`.
    - It runs during the handshake, reads `socket.handshake.auth.token` and calls `jwt.verify`.
    - Bad token → `next(new Error(...))` → connection rejected.
    - You can also use `socket.use()` to check each incoming event (e.g. if the token expired).

---

18. Is passing the token directly in the socket payload secure?
    *(Asked 1×: Senior Node Ep.32 (YT))*

==> Not a good idea.
    - If you send the token in every message payload, it gets repeated everywhere and may end up in
      logs.
    - Better: send it **once in the handshake** (`auth` object), verify it, and attach the user to
      the socket.
    - Always use `wss://` (TLS), so the token is encrypted on the wire.
    - Avoid putting it in the URL query string, because URLs get logged by proxies and servers.
    - Keep access tokens short-lived; disconnect the socket when the token expires.

---

19. Which socket handshake objects can carry the token (e.g. auth, query)?
    *(Asked 1×: Senior Node Ep.32 (YT))*

==>
    +----------------+--------------------------------------------+------------------------------------------+--------------------------------------------+
    | Place          | Client                                     | Server reads                             | Note                                       |
    +================+============================================+==========================================+============================================+
    | `auth`         | `io(url, { auth: { token } })`             | `socket.handshake.auth.token`            | Best choice                                |
    +----------------+--------------------------------------------+------------------------------------------+--------------------------------------------+
    | `query`        | `io(url, { query: { token } })`            | `socket.handshake.query.token`           | Shows in URL/logs – avoid                  |
    +----------------+--------------------------------------------+------------------------------------------+--------------------------------------------+
    | `extraHeaders` | `io(url, { extraHeaders: { Authorization:  | `socket.handshake.headers.authorization` | Not supported by browser WebSocket         |
    |                | 'Bearer ...' } })`                         |                                          | transport                                  |
    +----------------+--------------------------------------------+------------------------------------------+--------------------------------------------+
    | Cookie         | sent automatically by the browser          | `socket.handshake.headers.cookie`        | Use HttpOnly + Secure + SameSite           |
    +----------------+--------------------------------------------+------------------------------------------+--------------------------------------------+

---

20. Create a Node.js server using the http module
    *(Asked 1×: TCS)*

==> Use the built-in `http` module – no install needed.

    ```js
    const http = require('http');

    const server = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Hello World!');
      }
      res.writeHead(404);
      res.end('Not Found');
    });

    server.listen(3000, () => console.log('Server running on port 3000'));
    ```

    Run: `node server.js`.

---

21. Create an API using any backend framework (Node.js)
    *(Asked 1×: Bajaj Finserv)*

==> A small CRUD API with Express (in-memory data for simplicity):

    ```js
    const express = require('express');
    const app = express();
    app.use(express.json());

    let users = [{ id: 1, name: 'Amit' }];

    app.get('/users', (req, res) => res.json(users));

    app.get('/users/:id', (req, res) => {
      const user = users.find(u => u.id === Number(req.params.id));
      if (!user) return res.status(404).json({ message: 'Not found' });
      res.json(user);
    });

    app.post('/users', (req, res) => {
      const user = { id: Date.now(), name: req.body.name };
      users.push(user);
      res.status(201).json(user);
    });

    app.delete('/users/:id', (req, res) => {
      users = users.filter(u => u.id !== Number(req.params.id));
      res.status(204).end();
    });

    app.listen(3000);
    ```

---

22. Which framework have you used for Node.js in your projects / microservices?
    *(Asked 1×: Tech Mahindra (YT))*

==> Sample answer: "Mainly **Express.js**. It is lightweight, has a huge middleware ecosystem, and I
    structure it as routes → middleware → controllers → services → models. I also know **NestJS**,
    which adds TypeScript, modules and dependency injection for bigger projects."

    +-----------+--------------------------------------------+
    | Framework | One line                                   |
    +===========+============================================+
    | Express   | Minimal, flexible, most popular            |
    +-----------+--------------------------------------------+
    | NestJS    | Structured, TypeScript, Angular-like, good |
    |           | for large apps                             |
    +-----------+--------------------------------------------+
    | Fastify   | Very fast, built-in schema validation      |
    +-----------+--------------------------------------------+
    | Koa       | From the Express team, modern async        |
    |           | middleware                                 |
    +-----------+--------------------------------------------+

---

23. Why is Node.js single-threaded?
    *(Asked 1×: Bajaj Finserv)*

==> It was designed that way to keep things **simple and light**.
    - One JS thread = no locks, no race conditions between threads in your code.
    - No extra memory for one thread per request (like old Apache/Java servers).
    - Most server work is waiting for I/O, and the event loop handles that waiting well.
    - Note: only JS execution is single-threaded. libuv uses a thread pool for some I/O, and you can
      use worker threads for CPU work.

---

24. How do you handle high concurrency (non-blocking code)?
    *(Asked 1×: Wipro)*

==>
    1. Write non-blocking code: async/await, Promises, never `readFileSync` etc. in request
       handlers.
    2. Run independent calls in parallel with `Promise.all`.
    3. Move CPU-heavy work to **worker threads** or a queue (e.g. BullMQ).
    4. Use all CPU cores: **cluster** mode or **PM2**.
    5. Run several instances behind a **load balancer** (Nginx).
    6. **Cache** with Redis; use DB **connection pooling**.
    7. Use **streams** for big files; add **rate limiting**.

---

25. Why is Node.js able to handle many requests? Is Node.js multi-threaded?
    *(Asked 1×: Tech Mahindra (YT))*

==> Many requests: because I/O is **non-blocking**. Node starts the DB/file/network call, moves on
    to the next request, and runs the callback later via the event loop. No thread sits idle
    waiting.

    Multi-threaded? **Your JavaScript runs on one thread.** But Node itself is not purely
    single-threaded:
    - libuv has a thread pool (default 4) for file system, DNS, crypto, zlib.
    - You can create threads yourself with `worker_threads`.

    Interview tip: say "single-threaded for JS execution, but uses background threads internally."

---

26. How would you define the term I/O?
    *(Asked 1×: Bajaj Finserv)*

==> I/O = **Input/Output**: any time your program talks to something outside itself.
    - Examples: reading/writing files, database queries, HTTP calls, network sockets, console.
    - I/O is slow compared to CPU work, so Node does it **asynchronously** – it does other work
      while waiting.

---

27. What is the difference between module.exports and exports? (purpose of module.exports)
    *(Asked 1×: Tech Mahindra (YT))*

==> `module.exports` is **what `require()` actually returns**. `exports` is just a shortcut variable
    pointing to the same object at the start.

    +--------------------------------------------+--------------------------------------------+
    | `module.exports`                           | `exports`                                  |
    +============================================+============================================+
    | The real exported value                    | A reference to `module.exports`            |
    +--------------------------------------------+--------------------------------------------+
    | Can be set to anything (function, class,   | Can only add properties (`exports.x =      |
    | object)                                    | ...`)                                      |
    +--------------------------------------------+--------------------------------------------+
    | `module.exports = fn` works                | `exports = fn` breaks the link – exports   |
    |                                            | nothing                                    |
    +--------------------------------------------+--------------------------------------------+

    ```js
    // works
    exports.add = (a, b) => a + b;
    module.exports = { add: (a, b) => a + b };

    // does NOT work – require() still returns the old empty object
    exports = { add: (a, b) => a + b };
    ```

---

28. What is a circular dependency in Node.js?
    *(Asked 1×: Senior Node.js round (YT))*

==> When two modules **require each other** (A requires B, and B requires A).
    - Node doesn't crash; it gives B a **partially finished** copy of A's exports (whatever A had
      exported so far).
    - Result: some values are `undefined` → strange bugs.
    - Fix: move shared code to a third module, require inside the function where needed, or use
      dependency injection.

    ```js
    // a.js
    const b = require('./b');
    module.exports = { name: 'A' };

    // b.js
    const a = require('./a');
    console.log(a.name); // undefined – a.js is not finished yet
    ```

---

29. What are the globals / global object in Node.js?
    *(Asked 1×: Senior Node.js round (YT))*

==> Globals are things you can use **without `require`**.
    - `global` (or `globalThis`) – the global object, like `window` in the browser.
    - `process` – env vars, args, exit, `nextTick`.
    - `console`, `Buffer`, `setTimeout`, `setInterval`, `setImmediate`, `clearTimeout`, `URL`,
      `fetch` (Node 18+).
    - Module-level (look global but are per file): `__dirname`, `__filename`, `require`, `module`,
      `exports`.

---

30. What is the difference between Node and Node.js?
    *(Asked 1×: Deloitte (YT))*

==> **No difference.** "Node" is just the short name for Node.js. The command you run is `node`.

---

31. What are the drawbacks of Node.js?
    *(Asked 1×: Bajaj Finserv)*

==>
    - **Bad for CPU-heavy work** (image processing, big calculations): it blocks the single thread.
      Needs worker threads.
    - **Callback hell** in old-style code (fixed with Promises/async-await).
    - One unhandled error can **crash the whole process**.
    - npm packages vary in quality; more dependency/security risk.
    - Plain JS has no types (use TypeScript).
    - Less suited for heavy relational/CPU-bound enterprise logic than Java/.NET.

---

32. Explain REST APIs
    *(Asked 1×: TCS (online))*

==> REST (Representational State Transfer) is a style for building APIs over HTTP.
    - Everything is a **resource** with a URL: `/users`, `/users/5`.
    - Use **HTTP methods** for actions: GET (read), POST (create), PUT/PATCH (update), DELETE
      (remove).
    - **Stateless**: each request carries all it needs (e.g. JWT in the header); the server stores
      no session.
    - Responses use **status codes** (200, 201, 400, 401, 404, 500) and usually **JSON**.

    Example: `GET /api/users/5` → `200 { "id": 5, "name": "Amit" }`.

---

33. How does an API work?
    *(Asked 1×: Web3Dev)*

==> An API is a contract that lets one program ask another for data or actions.
    1. Client sends an HTTP request (method, URL, headers, body) to an endpoint.
    2. Server receives it; routing + middleware (auth, validation) run.
    3. Controller/service runs the business logic, talks to the DB if needed.
    4. Server sends back a response: status code + data (usually JSON).

    In short: request in → logic → response out.

---

34. Which REST API methods have you used (GET, POST, PUT, PATCH, DELETE)?
    *(Asked 1×: American Express)*

==> I've used all of them:

    +--------+----------------------------+-------------------------------+
    | Method | Purpose                    | Example                       |
    +========+============================+===============================+
    | GET    | Read data                  | `GET /users`                  |
    +--------+----------------------------+-------------------------------+
    | POST   | Create                     | `POST /users`                 |
    +--------+----------------------------+-------------------------------+
    | PUT    | Replace the whole resource | `PUT /users/5`                |
    +--------+----------------------------+-------------------------------+
    | PATCH  | Update some fields         | `PATCH /users/5` (only email) |
    +--------+----------------------------+-------------------------------+
    | DELETE | Remove                     | `DELETE /users/5`             |
    +--------+----------------------------+-------------------------------+

    Interview tip: GET, PUT, DELETE are **idempotent** (calling twice gives the same result); POST
    is not.

---

35. Explain the architecture and implementation of a RESTful API you developed
    *(Asked 1×: Upelars)*

==> Sample answer: "I built REST APIs with Node.js + Express in a layered structure:"
    1. **Routes** – define endpoints and methods (`/api/orders`).
    2. **Middleware** – JWT auth, role checks, validation (Joi), rate limiting, logging.
    3. **Controllers** – read `req`, call the service, send the response.
    4. **Services** – business logic.
    5. **Models / repositories** – DB access (Mongoose / Sequelize / MySQL).
    6. **Central error handler** – one place that returns consistent JSON errors.
    7. **Config** in `.env`, Swagger docs, unit tests with Jest.

    "For example `GET /api/orders` lists orders with pagination, `POST /api/orders` validates and
    creates one and returns 201. All responses use the same JSON shape and proper status codes."

---

36. What is the difference between process.nextTick() and setImmediate()? Which runs first?
    *(Asked 1×: TCS/Infosys/Accenture short (YT))*

==> **`process.nextTick` runs first.**

    +--------------------------------------------+--------------------------------------------+
    | `process.nextTick()`                       | `setImmediate()`                           |
    +============================================+============================================+
    | Runs right after the current operation,    | Runs in the check phase of the next loop   |
    | before the event loop continues            | iteration                                  |
    +--------------------------------------------+--------------------------------------------+
    | Runs even before Promise callbacks         | Runs after I/O (poll phase)                |
    +--------------------------------------------+--------------------------------------------+
    | Too many can starve the event loop (I/O    | Safe, doesn't block I/O                    |
    | never runs)                                |                                            |
    +--------------------------------------------+--------------------------------------------+

    ```js
    setImmediate(() => console.log('immediate'));
    process.nextTick(() => console.log('nextTick'));
    // nextTick
    // immediate
    ```

---

37. Why does process.nextTick() run before setImmediate()?
    *(Asked 1×: TCS/Infosys/Accenture short (YT))*

==> Because `process.nextTick` is **not part of the event loop phases**.
    - Node empties the nextTick queue right after the current JS operation finishes, before moving
      on to anything else.
    - `setImmediate` must wait for the event loop to reach the **check** phase.
    - So nextTick always wins. (The names are confusing: "nextTick" is actually more immediate than
      "setImmediate".)

---

38. What is the difference between setImmediate() and setTimeout()?
    *(Asked 1×: Tech Mahindra (YT))*

==>
    +--------------------------------------------+-------------------------------------------+
    | `setTimeout(fn, 0)`                        | `setImmediate(fn)`                        |
    +============================================+===========================================+
    | Runs in the timers phase                   | Runs in the check phase                   |
    +--------------------------------------------+-------------------------------------------+
    | Waits at least the given delay (0 → ~1 ms) | No delay, runs after the poll (I/O) phase |
    +--------------------------------------------+-------------------------------------------+
    | Exists in browser and Node                 | Node API, not in browsers                 |
    +--------------------------------------------+-------------------------------------------+

    Order:
    - In the main script, the order of the two is **not guaranteed** (depends on process timing).
    - Inside an I/O callback, `setImmediate` **always runs first** (check phase comes right after
      poll).

    ```js
    const fs = require('fs');
    fs.readFile(__filename, () => {
      setTimeout(() => console.log('timeout'), 0);
      setImmediate(() => console.log('immediate'));
    });
    // immediate
    // timeout
    ```

---

39. How do you implement centralized error handling in Express?
    *(Asked 1×: Wipro)*

==> Use **one error-handling middleware** (4 arguments: `err, req, res, next`) added **after all
    routes**. Routes just pass errors to it with `next(err)`.

    ```js
    class AppError extends Error {
      constructor(message, status) { super(message); this.status = status; }
    }

    app.get('/users/:id', async (req, res, next) => {
      try {
        const user = await User.findById(req.params.id);
        if (!user) throw new AppError('User not found', 404);
        res.json(user);
      } catch (err) {
        next(err); // send to central handler
      }
    });

    // central error handler – always last
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(err.status || 500).json({ message: err.message || 'Server error' });
    });
    ```

    Interview tip: Express 5 forwards rejected async errors automatically; in Express 4 use
    try/catch or an `asyncHandler` wrapper.

---

40. How do you handle unexpected exceptions (uncaughtException / unhandledRejection)?
    *(Asked 1×: Tech Mahindra (YT))*

==>
    - First, catch errors normally: try/catch with async/await, `.catch()` on Promises, central
      Express error handler.
    - As a last safety net, listen to process events: log the error, then **exit and let
      PM2/Docker/Kubernetes restart** the app (the app may be in a bad state).

    ```js
    process.on('uncaughtException', (err) => {
      console.error('Uncaught exception:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled rejection:', reason);
      process.exit(1);
    });
    ```

    In short: handle errors where they happen; use these events only to log and restart cleanly.

---

41. How do you get the error object in a callback (error-first callbacks)?
    *(Asked 1×: Tech Mahindra (YT))*

==> Node callbacks follow the **error-first** pattern: the **first argument is the error** (or
    `null`), the rest are the results. Always check it first.

    ```js
    const fs = require('fs');

    fs.readFile('data.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('Failed:', err.message);
        return;
      }
      console.log(data);
    });
    ```

---

42. How can you improve Node.js application performance?
    *(Asked 1×: Deloitte)*

==>
    1. Never block the event loop – use async APIs, move CPU work to worker threads.
    2. **Cache** frequent data (Redis, in-memory).
    3. **Optimize DB**: indexes, select only needed fields, pagination, connection pooling, avoid
       N+1 queries.
    4. Run parallel tasks with `Promise.all`.
    5. Use all cores: **cluster / PM2**; scale horizontally behind a load balancer.
    6. **Compression** (gzip) and **streams** for large data.
    7. Profile and monitor (clinic.js, `--inspect`, APM tools) to find the real bottleneck.

---

43. If 10k requests hit your API, how will you handle them efficiently?
    *(Asked 1×: American Express)*

==>
    1. Keep handlers **non-blocking** (async I/O only).
    2. **Cache** repeated reads in Redis so most requests skip the DB.
    3. Use a DB **connection pool** and indexed queries.
    4. Run **multiple instances** (cluster/PM2, containers) behind a **load balancer**.
    5. Push slow work (emails, reports) to a **queue** (BullMQ, RabbitMQ, Kafka) and return quickly.
    6. Add **rate limiting** to protect the system.
    7. Use **auto-scaling** and monitoring to add instances under load.

---

44. An API takes 10 seconds and must respond in 2–3 seconds. What steps do you take to optimize it?
    *(Asked 1×: Senior Node.js round (YT))*

==> First **measure**, then fix. Don't add indexes blindly.
    1. Add logging/timing (or an APM tool) to find which part is slow: DB, external API, or code.
    2. If the DB is slow: run **EXPLAIN** (query execution plan) to see if it does a full table
       scan.
    3. Add the right **index** on the columns used in WHERE/JOIN/ORDER BY (the primary key index
       doesn't help a search on `name` or `age`).
    4. Fetch only needed columns; add pagination; remove N+1 queries.
    5. Run independent calls in **parallel** (`Promise.all`) instead of one by one.
    6. **Cache** results that don't change often (Redis).
    7. Move heavy work to a **background job** and return early.
    8. Re-test and compare timings.

---

45. Write sample code to connect a Node.js application to a database
    *(Asked 1×: Persistent Systems)*

==> MongoDB with Mongoose:

    ```js
    const mongoose = require('mongoose');

    async function connectDB() {
      try {
        await mongoose.connect(process.env.MONGO_URI); // e.g. mongodb://localhost:27017/mydb
        console.log('MongoDB connected');
      } catch (err) {
        console.error('DB connection failed:', err.message);
        process.exit(1);
      }
    }

    connectDB();
    ```

    MySQL with a connection pool (`mysql2`):

    ```js
    const mysql = require('mysql2/promise');

    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: 'mydb',
      connectionLimit: 10,
    });

    async function getUsers() {
      const [rows] = await pool.query('SELECT * FROM users');
      return rows;
    }
    ```

    Interview tip: keep credentials in `.env`, never in code.

---

46. How do you do database operations in Node.js?
    *(Asked 1×: Wipro)*

==> Use a DB driver or an ORM/ODM, with async/await:
    - MongoDB: `mongoose` (ODM) – `find`, `findById`, `create`, `updateOne`, `deleteOne`.
    - SQL: `mysql2` / `pg` drivers, or ORMs like Sequelize, Prisma, TypeORM.
    - Use **parameterized queries** (`?` placeholders) to prevent SQL injection.
    - Use connection pooling, try/catch for errors, transactions for multi-step updates.

    ```js
    // CRUD with Mongoose
    const user = await User.create({ name: 'Amit' });           // Create
    const users = await User.find({ active: true });            // Read
    await User.updateOne({ _id: user._id }, { name: 'Ravi' });  // Update
    await User.deleteOne({ _id: user._id });                    // Delete

    // SQL with a placeholder
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    ```

---

47. Write a GET API that queries MongoDB and finds the employee with a given id
    *(Asked 1×: Bajaj Finserv)*

==>
    ```js
    const express = require('express');
    const mongoose = require('mongoose');

    const Employee = mongoose.model('Employee', new mongoose.Schema({
      name: String,
      department: String,
      salary: Number,
    }));

    const app = express();

    app.get('/employees/:id', async (req, res) => {
      try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid id' });
        }
        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    });

    mongoose.connect('mongodb://localhost:27017/company')
      .then(() => app.listen(3000, () => console.log('Running on 3000')));
    ```

---

48. How do you handle asynchronous operations in Node.js?
    *(Asked 1×: Deloitte)*

==> Three ways, from old to modern:
    1. **Callbacks** – error-first `(err, data)`; can lead to callback hell.
    2. **Promises** – `.then()` / `.catch()`; `Promise.all` for parallel work.
    3. **async/await** – reads like normal code; errors handled with try/catch. (What I use most.)

    ```js
    async function getUserOrders(id) {
      try {
        const user = await User.findById(id);
        const orders = await Order.find({ userId: user._id });
        return { user, orders };
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
    ```

    In short: async operations (DB, API, files) don't block the main thread; we wait for their
    result with Promises / async-await.

---

49. How do you implement asynchronous programming in Node.js?
    *(Asked 1×: Tech Mahindra (YT))*

==> Same tools as Q48 – callbacks, Promises, async/await – plus a few extras:
    - `util.promisify` to turn an old callback API into a Promise.
    - `Promise.all` / `Promise.allSettled` to run tasks in parallel.
    - **EventEmitter** and **streams** for events and data that arrive over time.
    - Worker threads for CPU-heavy work so it doesn't block the event loop.

    ```js
    const fs = require('fs/promises');

    async function readTwoFiles() {
      const [a, b] = await Promise.all([
        fs.readFile('a.txt', 'utf8'),
        fs.readFile('b.txt', 'utf8'),
      ]);
      return a + b;
    }
    ```

---

50. What is libuv and what role does it play in Node.js?
   *(Asked 1×: Persistent Systems)*

==> libuv is a C library inside Node.js that gives it the event loop and async I/O.
    - It runs the **event loop** (phases: timers, pending callbacks, poll, check, close).
    - It talks to the OS for **async network I/O** (epoll on Linux, kqueue on macOS, IOCP on
      Windows). Network sockets do NOT use the thread pool.
    - It has a **thread pool** (default size 4, change with `UV_THREADPOOL_SIZE`) for work the OS
      cannot do async: `fs`, `crypto` (pbkdf2, scrypt), `zlib`, `dns.lookup`.
    - When the work finishes, libuv puts the callback in a queue and the event loop runs it on the
      main JS thread.

    ```js
    // Runs on the libuv thread pool, main thread stays free
    const crypto = require('crypto');
    crypto.pbkdf2('pass', 'salt', 100000, 64, 'sha512', () => console.log('hash done'));
    console.log('main thread not blocked');
    ```

    In short: V8 runs your JavaScript; libuv gives Node the event loop, async I/O and the thread
    pool.

---

51. Explain Node.js and its event-driven model (what does event-driven programming mean?)
    *(Asked 1×: One97 Paytm)*

==> Event-driven programming means **code runs in response to events** (a request arrived, a file
    finished reading,
    a timer fired), instead of running top to bottom and waiting.
    - Node.js is a JS runtime built around this: it registers callbacks (listeners) and the event
      loop calls them when events happen.
    - Many core objects (HTTP server, streams) are **EventEmitters**.

    ```js
    const EventEmitter = require('events');
    const emitter = new EventEmitter();

    emitter.on('orderPlaced', (id) => console.log('Send email for order', id)); // listener
    emitter.emit('orderPlaced', 101);                                           // fire event
    ```

    In short: "when X happens, run this function" – that's how Node handles many things at once
    without blocking.

---

52. What are streams in Node.js?
    *(Asked 1×: Wipro)*

==> Streams let you **process data piece by piece (chunks)** instead of loading it all into memory
    at once.
    - Great for big files, video, uploads, large DB exports.
    - Four types: **Readable** (`fs.createReadStream`), **Writable** (`fs.createWriteStream`,
      `res`), **Duplex** (both, e.g. a TCP socket), **Transform** (changes data while passing, e.g.
      `zlib.createGzip`).
    - `pipe()` / `pipeline()` connect them and handle backpressure (slowing the source when the
      destination is slow).

    ```js
    const fs = require('fs');
    const zlib = require('zlib');
    const { pipeline } = require('stream');

    pipeline(
      fs.createReadStream('big.log'),
      zlib.createGzip(),
      fs.createWriteStream('big.log.gz'),
      (err) => console.log(err ? 'Failed' : 'Done')
    );
    ```

    In short: streams = low memory + start working before all the data has arrived.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

53. Output: setTimeout(0) and setImmediate scheduled inside an fs.readFile callback — which prints
   first?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> Inside an I/O callback, **setImmediate always prints first**.
    - The readFile callback runs in the **poll** phase.
    - After poll comes the **check** phase, where setImmediate runs.
    - setTimeout(0) waits for the **timers** phase of the next loop iteration.

    ```js
    const fs = require('fs');
    fs.readFile(__filename, () => {
      setTimeout(() => console.log('timeout'), 0);
      setImmediate(() => console.log('immediate'));
    });
    // Output:
    // immediate
    // timeout
    ```

    Interview tip: In the main module (not inside I/O) the order of these two is NOT guaranteed — it
    depends on process timing.

---

54. A route runs a 5-second synchronous loop. What happens to other requests (e.g. /health) during
   that time?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> All other requests wait. Even `/health` does not respond for 5 seconds.
    - JavaScript in Node runs on **one main thread**.
    - A synchronous loop blocks the event loop, so no other callback, request or timer can run.
    - Load balancers may think the server is dead because health checks time out.
    - Fixes:
    1. Move CPU-heavy work to **worker_threads** or a background job queue (e.g. BullMQ).
    2. Split the work into small chunks with `setImmediate`.
    3. Run more processes (cluster / PM2) — helps throughput, but each blocked process is still
       stuck.

    ```js
    app.get('/slow', (req, res) => {
      const end = Date.now() + 5000;
      while (Date.now() < end) {} // blocks everything
      res.send('done');
    });
    app.get('/health', (req, res) => res.send('ok')); // waits until /slow finishes
    ```

    In short: Blocking the event loop blocks the whole server, not just one request.

---

55. Polling vs Server-Sent Events (SSE) vs WebSocket: when do you use each?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> All three get fresh data to the client; they differ in direction and cost.

    +-----------+-------------------------------------+--------------------------------------------+--------------------------------------------+
    |           | Polling                             | SSE                                        | WebSocket                                  |
    +===========+=====================================+============================================+============================================+
    | How       | Client asks again every few seconds | One HTTP connection, server keeps pushing  | Persistent two-way connection              |
    +-----------+-------------------------------------+--------------------------------------------+--------------------------------------------+
    | Direction | Client → server (request/response)  | Server → client only                       | Both ways                                  |
    +-----------+-------------------------------------+--------------------------------------------+--------------------------------------------+
    | Data      | Any                                 | Text only (UTF-8)                          | Text and binary                            |
    +-----------+-------------------------------------+--------------------------------------------+--------------------------------------------+
    | Reconnect | N/A                                 | Built-in auto reconnect                    | You handle it (or use Socket.io)           |
    +-----------+-------------------------------------+--------------------------------------------+--------------------------------------------+
    | Use for   | Simple, rare updates (job status)   | Live feeds, notifications, AI token        | Chat, multiplayer games, collaborative     |
    |           |                                     | streaming                                  | editing                                    |
    +-----------+-------------------------------------+--------------------------------------------+--------------------------------------------+

    In short: Rare updates → polling; server-only push → SSE; real-time two-way → WebSocket.

---

56. Socket.io vs plain WebSocket: what is the difference?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> WebSocket is a protocol; Socket.io is a library built on top of it with extra features.

    +--------------------------------+-----------------------------+--------------------------------------------+
    |                                | Plain WebSocket (e.g. `ws`) | Socket.io                                  |
    +================================+=============================+============================================+
    | Type                           | Standard protocol           | Library (own protocol on top of WebSocket) |
    +--------------------------------+-----------------------------+--------------------------------------------+
    | Compatible                     | Any WebSocket client        | Needs a Socket.io client on the other side |
    +--------------------------------+-----------------------------+--------------------------------------------+
    | Auto reconnect                 | No                          | Yes                                        |
    +--------------------------------+-----------------------------+--------------------------------------------+
    | Fallback                       | No                          | HTTP long-polling fallback                 |
    +--------------------------------+-----------------------------+--------------------------------------------+
    | Rooms / namespaces             | Build yourself              | Built-in                                   |
    +--------------------------------+-----------------------------+--------------------------------------------+
    | Acknowledgements, named events | Build yourself              | Built-in                                   |
    +--------------------------------+-----------------------------+--------------------------------------------+
    | Overhead                       | Lighter                     | A bit heavier                              |
    +--------------------------------+-----------------------------+--------------------------------------------+

    ```js
    // Socket.io
    io.on('connection', (socket) => {
      socket.join('room1');
      socket.on('chat', (msg) => io.to('room1').emit('chat', msg));
    });
    ```

    In short: Use plain WebSocket for lightweight/standard needs; Socket.io when you want rooms,
    reconnect and fallbacks out of the box.

---

57. How do you scale Socket.io across multiple servers?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> Problem: each server only knows its own connected sockets, so a message emitted on server A does
    not reach users on server B.
    1. Use an **adapter** (e.g. `@socket.io/redis-adapter`) — servers share events via Redis
       Pub/Sub, so `io.to(room).emit()` reaches all servers.
    2. Use **sticky sessions** on the load balancer (needed when HTTP long-polling is used, because
       one session's requests must hit the same server).
    3. In Node cluster mode, use `@socket.io/sticky` + the cluster adapter.

    ```js
    const { createAdapter } = require('@socket.io/redis-adapter');
    const { createClient } = require('redis');

    const pub = createClient({ url: 'redis://localhost:6379' });
    const sub = pub.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);
    io.adapter(createAdapter(pub, sub));
    ```

    In short: Redis adapter + sticky sessions.

---

58. Why use Express if Node.js already has the http module?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> The `http` module is low-level; you must do everything by hand. Express adds the common pieces.
    - **Routing** by method and path, with params (`/users/:id`).
    - **Middleware** chain (auth, logging, CORS, body parsing).
    - Helpers like `res.json()`, `res.status()`, `res.redirect()`.
    - Central **error handling**.
    - Huge ecosystem of middleware.

    ```js
    // Plain http
    http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([]));
      }
    }).listen(3000);

    // Express
    app.get('/users', (req, res) => res.json([]));
    ```

    In short: Express is a thin layer over http that saves boilerplate and organises code.

---

59. How do you read route params, query string, body and headers in Express? Why is req.body
   undefined without express.json() (body-parser)?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> Express puts each part of the request in its own place.
    - Route params → `req.params` (`/users/:id` → `req.params.id`)
    - Query string → `req.query` (`?page=2` → `req.query.page`, always a string)
    - Body → `req.body`
    - Headers → `req.headers['authorization']` or `req.get('Authorization')`
    - The request body arrives as a **stream of raw bytes**. Express does not read it by default.
      `express.json()` (built-in version of body-parser) reads the stream, parses JSON and sets
      `req.body`. Without it, `req.body` is `undefined`.
    - For HTML forms use `express.urlencoded({ extended: true })`; for files use multer.

    ```js
    app.use(express.json());

    app.post('/users/:id', (req, res) => {
      const id = req.params.id;
      const page = req.query.page;
      const token = req.get('Authorization');
      const { name } = req.body;
      res.json({ id, page, token, name });
    });
    ```

    Interview tip: express.json() only parses when Content-Type is application/json.

---

60. Why do you get "Cannot set headers after they are sent to the client"?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> You tried to send a response **twice** for the same request. Once a response is sent, headers
    cannot change.
    - Common causes:
    - Missing `return` after `res.send()` inside an `if`.
    - Calling `next()` after sending a response.
    - Sending in a callback and also after it.

    ```js
    // Bug
    app.get('/user', (req, res) => {
      if (!req.query.id) {
        res.status(400).send('id required'); // no return
      }
      res.send('ok'); // second send -> error
    });

    // Fix
    if (!req.query.id) return res.status(400).send('id required');
    ```

    In short: One request = one response. Use `return res...` to stop the function.

---

61. Express vs Fastify
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> Both are Node.js web frameworks.

    +--------------+--------------------------------------------+--------------------------------------------+
    |              | Express                                    | Fastify                                    |
    +==============+============================================+============================================+
    | Speed        | Good                                       | Faster (optimised routing and JSON         |
    |              |                                            | serialisation)                             |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Validation   | Add a library (Joi, zod)                   | Built-in JSON Schema validation            |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Structure    | Middleware chain                           | Plugins + hooks with encapsulation         |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Async errors | Express 5 forwards rejected promises;      | Native async/await support                 |
    |              | Express 4 does not                         |                                            |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Logging      | Add morgan/winston                         | Built-in Pino logger                       |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Ecosystem    | Biggest, most tutorials                    | Smaller but growing                        |
    +--------------+--------------------------------------------+--------------------------------------------+

    In short: Express for simplicity and ecosystem; Fastify when performance and built-in schema
    validation matter.

---

62. CommonJS vs ES Modules (require vs import)
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> CommonJS (CJS) is the module system Node.js started with (`require` / `module.exports`). ES
    Modules (ESM) are the official JavaScript standard (`import` / `export`), used in browsers,
    Deno, bundlers and Node.js. Node.js supports both.

    +-----------------+--------------------------------+--------------------------------------------+
    |                 | CommonJS                       | ES Modules                                 |
    +=================+================================+============================================+
    | Syntax          | `require()` / `module.exports` | `import` / `export`                        |
    +-----------------+--------------------------------+--------------------------------------------+
    | Loading         | Synchronous, at runtime        | Static, analysed before running (async     |
    |                 |                                | loading)                                   |
    +-----------------+--------------------------------+--------------------------------------------+
    | Where it works  | Anywhere, even inside if       | Top level (dynamic `import()` for runtime) |
    +-----------------+--------------------------------+--------------------------------------------+
    | Top-level await | No                             | Yes                                        |
    +-----------------+--------------------------------+--------------------------------------------+
    | `__dirname`     | Available                      | Not available (use `import.meta.url` /     |
    |                 |                                | `import.meta.dirname`)                     |
    +-----------------+--------------------------------+--------------------------------------------+
    | Enable          | Default in `.js`               | `.mjs` or `"type": "module"` in            |
    |                 |                                | package.json                               |
    +-----------------+--------------------------------+--------------------------------------------+
    | Tree shaking    | No                             | Yes (static)                               |
    +-----------------+--------------------------------+--------------------------------------------+

    ```js
    // CommonJS
    const fs = require('fs');
    module.exports = { add };

    // ES Modules
    import fs from 'fs';
    export const add = (a, b) => a + b;
    ```

    In short: CommonJS is Node's old default; ES Modules are the JavaScript standard.

---

63. What happens when you require() the same file twice? (module caching)
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> The file runs **only once**. Node caches it in `require.cache`; the second `require()` returns
    the **same** `module.exports` object.
    - So both variables point to the same function and share the same state.

    ```js
    // counter.js
    let n = 0;
    module.exports = () => ++n;

    // app.js
    const a = require('./counter');
    const b = require('./counter');
    console.log(a(), b(), a()); // 1 2 3
    ```

    - `a === b` is `true`, so `n` is shared.
    - To force a reload: `delete require.cache[require.resolve('./counter')]` (rarely needed).

    In short: require() caches modules, so a module behaves like a singleton.

---

64. What is npx?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> npx is a tool (comes with npm) that **runs a package's command** without installing it globally.
    - If the package is installed locally, it runs the one in `node_modules/.bin`.
    - If not, it downloads it temporarily and runs it.
    - Good for one-time tools and for using a specific version.

    ```bash
    npx create-react-app my-app
    npx nodemon app.js
    npx eslint@8 .
    ```

    In short: npm installs packages; npx runs them.

---

65. Semantic versioning: what do ^ and ~ mean in package.json?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> Version format is **MAJOR.MINOR.PATCH** (e.g. 1.2.3).
    - MAJOR → breaking changes
    - MINOR → new features, backward compatible
    - PATCH → bug fixes

    +----------+-----------------------+----------------+
    | Spec     | Allows                | Example range  |
    +==========+=======================+================+
    | `^1.2.3` | Minor + patch updates | >=1.2.3 <2.0.0 |
    +----------+-----------------------+----------------+
    | `~1.2.3` | Patch updates only    | >=1.2.3 <1.3.0 |
    +----------+-----------------------+----------------+
    | `1.2.3`  | Exact version only    | 1.2.3          |
    +----------+-----------------------+----------------+

    Interview tip: For `0.x` versions `^` is stricter: `^0.2.3` allows only `<0.3.0`. The lock file
    pins the exact installed versions.

---

66. npm install vs npm ci
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> Both install dependencies, but in different ways.

    +-------------------+------------------------------+--------------------------------------------+
    |                   | npm install                  | npm ci                                     |
    +===================+==============================+============================================+
    | Uses              | package.json (and lock file) | package-lock.json only, exactly            |
    +-------------------+------------------------------+--------------------------------------------+
    | Updates lock file | Can update it                | Never; fails if it doesn't match           |
    |                   |                              | package.json                               |
    +-------------------+------------------------------+--------------------------------------------+
    | node_modules      | Keeps existing, adds/updates | Deletes it first, clean install            |
    +-------------------+------------------------------+--------------------------------------------+
    | Add a package     | `npm install express`        | Not possible                               |
    +-------------------+------------------------------+--------------------------------------------+
    | Best for          | Local development            | CI/CD and production builds                |
    +-------------------+------------------------------+--------------------------------------------+

    In short: `npm ci` = fast, clean, reproducible install from the lock file.

---

67. What does idempotent mean? Which HTTP methods are idempotent?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> Idempotent means calling the same request **once or many times leaves the server in the same
    state**.
    - Idempotent: **GET, PUT, DELETE, HEAD, OPTIONS** (GET/HEAD/OPTIONS are also "safe" — they don't
      change data).
    - Not idempotent: **POST** (each call can create a new record), **PATCH** (not guaranteed, e.g.
      "increment by 1").
    - Example: `DELETE /users/5` twice → user 5 is gone either way (second call may return 404, but
      state is the same).
    - Why it matters: safe to **retry** on network failure. For POST payments, use an
      **Idempotency-Key** header.

    In short: Same request repeated = same result on the server.

---

68. REST API design best practices: resource naming, versioning (/api/v1) and pagination
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> Main rules for a clean REST API:
    - **Naming**: use plural nouns, not verbs: `GET /users`, `GET /users/5`, `POST /users`. Nested:
      `GET /users/5/orders`. Lowercase, hyphens.
    - **HTTP methods** say the action: GET read, POST create, PUT replace, PATCH partial update,
      DELETE remove.
    - **Status codes**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403
      Forbidden, 404 Not Found, 500 Server Error.
    - **Versioning**: put the version in the URL (`/api/v1/users`) so old clients keep working when
      v2 changes things.
    - **Pagination**: never return all rows.
    - Offset: `?page=2&limit=20` — simple, slow on big tables.
    - Cursor: `?cursor=abc&limit=20` — fast and stable for large/real-time data.
    - **Filtering/sorting**: `?status=active&sort=-createdAt`.
    - Consistent JSON error format.

    ```js
    // GET /api/v1/users?page=2&limit=20
    app.get('/api/v1/users', async (req, res) => {
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const users = await User.find().skip((page - 1) * limit).limit(limit);
      res.json({ data: users, page, limit });
    });
    ```

    In short: Nouns in URLs, verbs as HTTP methods, version in the path, always paginate.

---

69. What is a health check endpoint?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A simple route (e.g. `GET /health`) that tells if the service is up.
    - Used by load balancers, Kubernetes (liveness/readiness probes), Docker and monitoring tools.
    - If it fails, traffic is stopped or the container is restarted.
    - **Liveness**: is the process alive? **Readiness**: can it serve traffic (DB, Redis connected)?
    - Keep it fast and don't put heavy logic in it.

    ```js
    app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

    app.get('/ready', async (req, res) => {
      try {
        await db.query('SELECT 1');
        res.json({ status: 'ready' });
      } catch {
        res.status(503).json({ status: 'not ready' });
      }
    });
    ```

    In short: An endpoint that tells infrastructure "I'm alive and ready".

---

70. What is API documentation (Swagger / OpenAPI)?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> Two related terms:
    - **OpenAPI** is a standard format (YAML/JSON) to describe a REST API: endpoints, params,
      request/response bodies, status codes, auth.
    - **Swagger** is the set of tools for it — Swagger UI shows interactive docs where you can "Try
      it out".
    - In Node: `swagger-ui-express` to serve docs, `swagger-jsdoc` to build the spec from comments.
    - Benefits: frontend/QA know the contract, client SDKs can be generated, easier onboarding.

    ```js
    const swaggerUi = require('swagger-ui-express');
    const spec = require('./openapi.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
    ```

    In short: OpenAPI is the spec; Swagger UI turns it into interactive docs.

---

71. Is Node.js a programming language or a framework?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> Neither. Node.js is a **JavaScript runtime environment**.
    - The language is **JavaScript**.
    - Node.js = **V8 engine** (runs JS) + **libuv** (event loop, async I/O) + built-in modules (fs,
      http, crypto...).
    - It lets JavaScript run **outside the browser**, on servers.
    - Frameworks like **Express, NestJS, Fastify** are built on top of Node.js.

    In short: JavaScript is the language, Node.js is the runtime, Express is a framework.

---

72. What is the REPL in Node.js?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> REPL = **Read, Eval, Print, Loop**. It is the interactive Node shell.
    - Start it by typing `node` in the terminal with no file.
    - It reads your input, evaluates it, prints the result, and waits again.
    - Useful to quickly test JS code or a module.
    - Handy commands: `.help`, `.exit`, `.editor` (multi-line), `_` (last result). Press Ctrl+C
      twice to quit.

    ```bash
    $ node
    > 2 + 3
    5
    > _ * 2
    10
    > .exit
    ```

    In short: A quick playground to run JavaScript line by line.

---

73. What are compression and morgan middleware?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> Both are popular third-party Express middleware.
    - **compression**: gzip/deflate/brotli-compresses the response body before sending it. Smaller
      responses mean faster load and less bandwidth.
    - **morgan**: an HTTP request logger. It logs one line per request (method, URL, status,
      response time).
    - Both are added with `app.use()`, usually near the top so they apply to every route.

    ```js
    const express = require('express');
    const compression = require('compression');
    const morgan = require('morgan');

    const app = express();
    app.use(compression());   // compress responses
    app.use(morgan('dev'));   // GET /users 200 12.3 ms - 512
    ```

    In short: compression makes responses smaller; morgan logs every HTTP request.

---

74. What is a memory leak in Node.js? Common causes and how do you detect it?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A memory leak is memory that is no longer needed but is still referenced, so the garbage
    collector cannot free it. Heap usage keeps growing until the process slows down or crashes (out
    of memory).
    Common causes:
    - Global variables or module-level arrays/maps/caches that keep growing.
    - Event listeners added again and again (e.g. per request) and never removed.
    - Timers (`setInterval`) that are never cleared.
    - Closures holding references to large objects.
    How to detect:
    - Watch `process.memoryUsage().heapUsed` over time (keeps going up = leak).
    - Run with `node --inspect`, open Chrome DevTools, take heap snapshots and compare them.
    - Use tools like clinic.js, or APM tools (New Relic, Datadog); PM2 monitoring.

    ```js
    const cache = {};                       // leak: grows forever
    app.get('/user/:id', (req, res) => {
      cache[req.params.id] = new Array(1e5).fill('x');
      res.send('ok');
    });
    ```

    In short: a leak is unused memory still referenced; detect it with memoryUsage and heap
    snapshots, fix it by removing references (bounded caches, removeListener, clearInterval).

---

75. What is heap memory, and how does garbage collection work in Node.js (V8)?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> - **Stack**: stores primitive values and function call frames; small and fast.
    - **Heap**: stores objects, arrays, functions and closures (dynamic memory).
    - V8 frees heap memory automatically with **garbage collection (GC)**: anything that is no
      longer reachable from the roots (globals, current stack) is removed.
    - The heap is split into generations:
    - **Young generation (new space)**: new objects; cleaned often and fast (Scavenge). Most objects
      die young.
    - **Old generation (old space)**: objects that survived a few GCs; cleaned less often with
      **Mark-Sweep-Compact** (mark reachable objects, sweep the rest, compact to remove gaps).
    - The default old-space limit can be raised with `node --max-old-space-size=4096 app.js` (MB).

    In short: objects live in the heap, and V8's generational GC frees whatever is no longer
    reachable.

---

76. How do you debug a Node.js application?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> - `console.log` / `console.error` for quick checks.
    - `node --inspect app.js` (or `--inspect-brk` to stop on the first line), then open
      `chrome://inspect` in Chrome to use breakpoints, watch variables and the call stack.
    - VS Code debugger: add a launch config (or use the JavaScript Debug Terminal) and set
      breakpoints in the editor.
    - Put a `debugger;` statement in code; execution pauses there when a debugger is attached.
    - Read stack traces and use proper logs (winston/pino) in production.
    - For performance/memory problems: `--inspect` with CPU profiles and heap snapshots, or
      clinic.js.

    ```bash
    node --inspect-brk app.js   # then open chrome://inspect
    ```

    In short: use `--inspect` with Chrome DevTools or the VS Code debugger, breakpoints instead of
    guessing with console.log.

---

77. Logging in Node.js: console vs winston / pino / morgan
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> | Tool | What it is | Use for |
    +---------+--------------------------------------------+----------------------------------+
    | ---     | ---                                        | ---                              |
    +=========+============================================+==================================+
    | console | Built-in, prints to stdout/stderr          | Quick local debugging            |
    +---------+--------------------------------------------+----------------------------------+
    | winston | Full-featured logger: levels, formats,     | App logs in production           |
    |         | many transports (file, console, remote)    |                                  |
    +---------+--------------------------------------------+----------------------------------+
    | pino    | Very fast JSON logger, low overhead        | High-performance production logs |
    +---------+--------------------------------------------+----------------------------------+
    | morgan  | Express middleware for HTTP request logs   | Logging each request             |
    +---------+--------------------------------------------+----------------------------------+

    - `console` has no log levels to filter, no JSON structure, no log rotation, and `console.log`
      writes synchronously in some cases, so it is not ideal for production.
    - Real apps often use morgan (or pino-http) for request logs plus winston/pino for application
      logs.

    ```js
    const pino = require('pino');
    const logger = pino({ level: 'info' });
    logger.info({ userId: 42 }, 'user logged in');
    ```

    In short: console for development; winston or pino for structured production logs; morgan for
    HTTP request logs.

---

78. How do async errors reach the Express error handler (Express 4 vs Express 5)?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> - Express error handler = middleware with 4 arguments `(err, req, res, next)`.
    - Synchronous `throw` inside a route is caught automatically in both versions.
    - **Express 4**: a rejected promise / error in an `async` handler is NOT caught. You must
      `try/catch` and call `next(err)` (or use a wrapper like `express-async-handler`). Otherwise
      you get an unhandled rejection and the request hangs.
    - **Express 5**: if an async handler returns a rejected promise, Express automatically forwards
      it to the error handler (`next(err)` is called for you).

    ```js
    // Express 4
    app.get('/user', async (req, res, next) => {
      try {
        const user = await User.findById(req.query.id);
        res.json(user);
      } catch (err) {
        next(err);                     // forward manually
      }
    });

    // Express 5: just throw / let it reject
    app.get('/user', async (req, res) => {
      const user = await User.findById(req.query.id);
      res.json(user);
    });

    app.use((err, req, res, next) => {
      res.status(500).json({ message: err.message });
    });
    ```

    In short: Express 4 needs `next(err)` (try/catch or a wrapper) for async errors; Express 5
    forwards rejected promises automatically.

---

79. What is util.promisify?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> - `util.promisify` converts a callback-style function (error-first callback `(err, result)`)
    into a function that returns a Promise.
    - Then you can use it with `async/await` instead of nested callbacks.
    - Many core modules already have promise versions (`fs/promises`), but promisify is useful for
      older libraries.

    ```js
    const util = require('util');
    const fs = require('fs');

    const readFile = util.promisify(fs.readFile);

    async function main() {
      const data = await readFile('a.txt', 'utf8');
      console.log(data);
    }
    ```

    In short: promisify turns an error-first callback function into a promise-returning one.

---

80. What is the libuv thread pool? Which tasks use it, and what is its default size?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> - libuv is the C library behind Node's event loop and async I/O.
    - Some work cannot be done asynchronously by the OS, so libuv runs it on a small pool of
      background threads: the **thread pool**.
    - **Default size: 4 threads**. Change it with the `UV_THREADPOOL_SIZE` environment variable (set
      before the pool is first used).
    - Uses the thread pool:
    - `fs` operations (readFile, writeFile ...)
    - `crypto` heavy functions (`pbkdf2`, `scrypt`, `randomBytes` async)
    - `zlib` (compression)
    - `dns.lookup`
    - Does NOT use the thread pool: network I/O (HTTP, TCP sockets, database connections). The OS
      handles them asynchronously (epoll / kqueue / IOCP).

    ```bash
    UV_THREADPOOL_SIZE=8 node app.js
    ```

    In short: 4 background threads by default for fs, crypto, zlib and dns.lookup; network I/O does
    not use them.

---

81. What is backpressure in streams?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> - Backpressure happens when data is produced (read) faster than it can be consumed (written).
    - If not handled, data piles up in memory and memory usage grows a lot.
    - `writable.write(chunk)` returns `false` when its internal buffer is full (above
      `highWaterMark`). Then you should stop writing and wait for the `'drain'` event.
    - `pipe()` and `pipeline()` handle backpressure automatically (pause the reader, resume on
      drain).

    ```js
    readable.on('data', (chunk) => {
      const ok = writable.write(chunk);
      if (!ok) {
        readable.pause();
        writable.once('drain', () => readable.resume());
      }
    });
    ```

    In short: backpressure = slowing the fast producer down so the slow consumer is not flooded;
    pipe/pipeline do it for you.

---

82. pipe() vs pipeline() in streams
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> | | pipe() | pipeline() |
    +------------------+--------------------------------------------+--------------------------------------------+
    | ---              | ---                                        | ---                                        |
    +==================+============================================+============================================+
    | Backpressure     | Handled                                    | Handled                                    |
    +------------------+--------------------------------------------+--------------------------------------------+
    | Error handling   | Errors are not forwarded; you need an      | One callback / promise gets the error from |
    |                  | `'error'` handler on every stream          | any stream                                 |
    +------------------+--------------------------------------------+--------------------------------------------+
    | Cleanup on error | Streams are not destroyed automatically    | Destroys all streams on error              |
    |                  | (possible leaks)                           |                                            |
    +------------------+--------------------------------------------+--------------------------------------------+
    | Style            | Chain `a.pipe(b).pipe(c)`                  | `pipeline(a, b, c, cb)` or `await          |
    |                  |                                            | pipeline(...)` from `stream/promises`      |
    +------------------+--------------------------------------------+--------------------------------------------+

    ```js
    const { pipeline } = require('stream/promises');
    const fs = require('fs');
    const zlib = require('zlib');

    await pipeline(
      fs.createReadStream('big.log'),
      zlib.createGzip(),
      fs.createWriteStream('big.log.gz')
    );
    ```

    In short: both handle backpressure, but pipeline() also handles errors and cleanup, so prefer
    it.

---

83. Are EventEmitter listeners synchronous or asynchronous? (include output: `e.on('x', () =>
    console.log('1')); e.emit('x'); console.log('2');` → 1 2; also mention the two classic bugs:
    emitting 'error' with no listener crashes the process, and adding listeners per request leaks
    memory / MaxListenersExceededWarning)
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> - **Synchronous.** `emit()` calls all listeners right away, one by one, in the order they were
    added, and only then returns.
    - So the output of the code below is `1` then `2`.
    - If you want async behaviour inside a listener, use `setImmediate` / `process.nextTick` inside
      it yourself.

    ```js
    const EventEmitter = require('events');
    const e = new EventEmitter();

    e.on('x', () => console.log('1'));
    e.emit('x');
    console.log('2');
    // Output:
    // 1
    // 2
    ```

    Two classic bugs:
    1. Emitting `'error'` with no `'error'` listener: Node throws the error and the process crashes.
       Always add `e.on('error', handler)`.
    2. Adding listeners inside a request handler (each request adds one more, never removed): memory
       leak. After 10 listeners on one event Node prints `MaxListenersExceededWarning`. Fix: add
       listeners once, use `once()`, or `removeListener()`/`off()`.

    In short: emit() is synchronous; always handle 'error', and never keep adding listeners per
    request.

---

84. What is clustering in Node.js? Cluster vs worker threads
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> - Node runs your JS on one thread, so one process uses one CPU core.
    - **Cluster module**: the primary process forks several worker **processes** (usually one per
      CPU core). They share the same server port, and incoming connections are distributed among
      them. If a worker dies, the primary can fork a new one.
    - Use `cluster.isPrimary` (`isMaster` is deprecated).

    ```js
    const cluster = require('cluster');
    const os = require('os');
    const http = require('http');

    if (cluster.isPrimary) {
      os.cpus().forEach(() => cluster.fork());
      cluster.on('exit', () => cluster.fork());   // restart dead worker
    } else {
      http.createServer((req, res) => res.end(`pid ${process.pid}`)).listen(3000);
    }
    ```

    +---------------+-------------------------------------------+--------------------------------------------+
    |               | Cluster                                   | Worker threads                             |
    +===============+===========================================+============================================+
    | ---           | ---                                       | ---                                        |
    +---------------+-------------------------------------------+--------------------------------------------+
    | Runs as       | Separate processes                        | Threads inside one process                 |
    +---------------+-------------------------------------------+--------------------------------------------+
    | Memory        | Each has its own memory                   | Own JS heap, but can share memory          |
    |               |                                           | (SharedArrayBuffer)                        |
    +---------------+-------------------------------------------+--------------------------------------------+
    | Communication | IPC messages                              | `postMessage`, shared memory               |
    +---------------+-------------------------------------------+--------------------------------------------+
    | Best for      | Scaling an HTTP server over all CPU cores | CPU-heavy tasks (image processing,         |
    |               |                                           | hashing, big calculations) without         |
    |               |                                           | blocking the event loop                    |
    +---------------+-------------------------------------------+--------------------------------------------+

    In short: cluster = more processes to handle more requests; worker threads = offload CPU-heavy
    work inside one process.

---

85. exec vs spawn in child_process
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> | | exec | spawn |
    +-------------+--------------------------------------------+--------------------------------------------+
    | ---         | ---                                        | ---                                        |
    +=============+============================================+============================================+
    | Output      | Buffers the whole output, gives it in a    | Streams output (`stdout`/`stderr` streams) |
    |             | callback                                   |                                            |
    +-------------+--------------------------------------------+--------------------------------------------+
    | Shell       | Runs the command in a shell (pipes, `&&`   | No shell by default (safer)                |
    |             | work)                                      |                                            |
    +-------------+--------------------------------------------+--------------------------------------------+
    | Output size | Limited by `maxBuffer` (default 1 MB)      | No limit, good for large/long output       |
    +-------------+--------------------------------------------+--------------------------------------------+
    | Use for     | Small, quick commands                      | Long-running processes, big output         |
    +-------------+--------------------------------------------+--------------------------------------------+

    - Be careful with `exec` and user input: it runs in a shell, so it can allow command injection.
    - Related: `execFile` (no shell, buffered) and `fork` (spawns a new Node process with an IPC
      channel).

    ```js
    const { exec, spawn } = require('child_process');

    exec('ls -l', (err, stdout) => console.log(stdout));

    const ls = spawn('ls', ['-l']);
    ls.stdout.on('data', (chunk) => console.log(chunk.toString()));
    ```

    In short: exec buffers the output (small commands); spawn streams it (big or long-running
    processes).

---

86. What is PM2?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> PM2 is a production process manager for Node.js apps.
    - Keeps the app alive: auto-restarts it if it crashes.
    - Cluster mode: runs one instance per CPU core with load balancing (`-i max`), no code changes.
    - Zero-downtime reload (`pm2 reload`).
    - Logs and monitoring (`pm2 logs`, `pm2 monit`).
    - Starts apps again after a server reboot (`pm2 startup`, `pm2 save`).
    - Config in `ecosystem.config.js`.

    ```bash
    pm2 start app.js -i max --name api
    pm2 logs api
    pm2 reload api
    ```

    In short: PM2 keeps Node apps running in production with restarts, clustering, logs and
    zero-downtime reloads.

---

87. What is the process object? (process.argv, process.cwd(), process.memoryUsage(), process.exit
    codes)
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> `process` is a global object (no `require` needed) that gives information about and control over
    the current Node process.
    - `process.argv`: command-line arguments array. `[0]` = node path, `[1]` = script path, the rest
      are your args.
    - `process.cwd()`: the directory from which node was started (current working directory).
    - `process.memoryUsage()`: memory info in bytes (`rss`, `heapTotal`, `heapUsed`, `external`).
    - `process.exit(code)`: ends the process. `0` = success, `1` (or any non-zero) = failure.
    - Also: `process.env`, `process.pid`, `process.platform`, `process.nextTick()`, and events like
      `process.on('exit')`, `'uncaughtException'`, `'SIGTERM'`.

    ```js
    // node app.js hello
    console.log(process.argv[2]);                  // hello
    console.log(process.cwd());                    // e.g. /home/me/project
    console.log(process.memoryUsage().heapUsed);   // bytes
    process.exit(1);                               // exit with error
    ```

    In short: process is the global handle to the running Node process: args, env, memory, cwd, exit
    and signals.

---

88. What is process.env, and how do you load a .env file (dotenv / node --env-file)?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> - `process.env` is an object with the environment variables of the process (PORT, DB_URL,
    secrets ...).
    - Values are always **strings** (`process.env.PORT` is `"3000"`, convert with `Number()` when
      needed).
    - A `.env` file keeps these values for local development. Never commit it to Git (add it to
      `.gitignore`).
    - Two ways to load it:
    1. **dotenv** package: `require('dotenv').config()` at the very top of the entry file.
    2. **Node 20.6+**: built-in flag `node --env-file=.env app.js` (no package needed).

    ```js
    // .env
    // PORT=3000
    // DB_URL=mongodb://localhost/test

    require('dotenv').config();
    const port = Number(process.env.PORT) || 3000;
    ```

    In short: process.env holds config as strings; load .env with dotenv or `node --env-file=.env`.

---

89. What is graceful shutdown, and how do you implement it?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> Graceful shutdown = when the app is asked to stop (deploy, scale down, Ctrl+C), it finishes
    current work cleanly instead of dying in the middle of requests.
    Steps:
    1. Listen for `SIGTERM` (sent by Docker/Kubernetes/PM2) and `SIGINT` (Ctrl+C).
    2. Stop accepting new connections: `server.close()`.
    3. Let in-flight requests finish.
    4. Close resources: DB connections, Redis, message queues.
    5. `process.exit(0)`, with a timeout that forces exit if cleanup hangs.

    ```js
    const server = app.listen(3000);

    function shutdown() {
      console.log('Shutting down...');
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10000).unref(); // force after 10s
    }

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    ```

    In short: on SIGTERM/SIGINT stop new requests, finish old ones, close DB connections, then exit.

---

90. Three ways to read a file with fs (sync, callback, promises). Why not use readFileSync in a
    server?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> 1. **Sync**: `fs.readFileSync` blocks until the file is read.
    2. **Callback**: `fs.readFile(path, cb)` with an error-first callback.
    3. **Promises**: `fs.promises.readFile` (or `require('fs/promises')`) with `async/await`.

    ```js
    const fs = require('fs');
    const fsp = require('fs/promises');

    const a = fs.readFileSync('a.txt', 'utf8');            // 1. sync (blocking)

    fs.readFile('a.txt', 'utf8', (err, data) => {          // 2. callback
      if (err) return console.error(err);
      console.log(data);
    });

    const b = await fsp.readFile('a.txt', 'utf8');         // 3. promises
    ```

    Why not `readFileSync` in a server:
    - It blocks the single JS thread (event loop). While one file is being read, no other request
      can be handled, so all users wait.
    - It is fine at startup (loading config once) or in CLI scripts.
    - For very large files use streams (`fs.createReadStream`) instead of reading everything into
      memory.

    In short: prefer the promise/callback versions in servers; sync blocks the event loop for every
    user.

---

91. path.join vs path.resolve; why use __dirname instead of './'? (__dirname / __filename)
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> | | path.join | path.resolve |
    +----------------+--------------------------------------------+--------------------------------------------+
    | ---            | ---                                        | ---                                        |
    +================+============================================+============================================+
    | What it does   | Joins segments with the correct separator  | Builds an absolute path                    |
    |                | and normalizes                             |                                            |
    +----------------+--------------------------------------------+--------------------------------------------+
    | Result         | Can be relative                            | Always absolute                            |
    +----------------+--------------------------------------------+--------------------------------------------+
    | Starting point | Just the given segments                    | Processes right to left until an absolute  |
    |                |                                            | path is formed; if none, starts from       |
    |                |                                            | `process.cwd()`                            |
    +----------------+--------------------------------------------+--------------------------------------------+

    ```js
    const path = require('path');

    path.join('a', 'b', '../c');     // 'a/c'
    path.resolve('a', 'b');          // '/current/working/dir/a/b'
    path.resolve('/x', 'y');         // '/x/y'

    // __dirname  = folder of the current file
    // __filename = full path of the current file
    const file = path.join(__dirname, 'data', 'users.json');
    ```

    Why `__dirname` instead of `'./'`:
    - `'./'` in `fs` calls is relative to `process.cwd()` (where node was started), not to the file.
      If you run `node src/app.js` from another folder, `'./data.json'` points to the wrong place.
    - `__dirname` is always the folder of the current file, so the path works from anywhere.
    - Note: `__dirname` / `__filename` exist in CommonJS. In ES modules use `import.meta.dirname` /
      `import.meta.filename` (newer Node) or `fileURLToPath(import.meta.url)`.

    In short: join just combines paths, resolve gives an absolute path; use __dirname so file paths
    do not depend on where node was started.

======================================================================================================================================

## What to study first

```
Node.js basics & architecture       (what Node is: V8 + libuv, single thread)
   ↓
Single thread & non-blocking I/O    (why one thread can serve many requests)
   ↓
Event loop & execution order        (phases, microtasks, all the "Output" questions)
   ↓
process.nextTick vs setImmediate vs setTimeout
   ↓
Handling asynchronous operations    (callbacks → Promises → async/await)
   ↓
Modules, globals & npm              (require, module.exports, common packages)
   ↓
Express.js, routing & middleware    (create a server, write middleware)
   ↓
REST APIs & HTTP methods
   ↓
Error handling                      (error-first callbacks, central handler, process events)
   ↓
Database access from Node.js        (connect, CRUD, GET by id)
   ↓
Events, Streams & WebSockets (Socket.io)
   ↓
Performance & scaling               (caching, cluster, queues, query tuning)
```

Node.js basics, single thread/non-blocking I/O and the event loop are the foundation: almost every
other answer (concurrency, nextTick vs setImmediate, async handling, performance) is explained using
them.
Express, middleware and REST APIs build on that and are asked in nearly every round, so practise
writing a server and a middleware from memory.
Error handling, DB access, Socket.io and performance come last; they reuse the same ideas
(async/await, middleware, non-blocking I/O).
