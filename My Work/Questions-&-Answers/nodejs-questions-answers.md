# Node.js – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is the event loop? How does it work and manage asynchronous operations?
   *(Asked 4×: Persistent Systems, TCS (online), Fundwave, Hyland Software)*

==> The event loop is the part of Node.js that decides **when each callback gets to run**.
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

==> Middleware is a function that runs **between the request coming in and the response going out**.
    - It gets `req`, `res` and `next`.
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
    | Exists in browser and Node                 | Node only                                 |
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

50. Explain Node.js and its event-driven model (what does event-driven programming mean?)
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

51. What are streams in Node.js?
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
