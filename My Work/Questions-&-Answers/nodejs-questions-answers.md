# Node.js – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

# What is Node.js?
 -- Node.js is a JavaScript runtime that allows us to execute JavaScript outside the browser, such as on a server.
 -- It uses the V8 JavaScript engine and supports asynchronous, non-blocking I/O


*** JavaScript & Node.js Execution Order *** 

```text
┌───────────────────────────────────────┐
│ 1. SYNCHRONOUS JAVASCRIPT             │
│    ├── Normal statements              │
│    ├── Function calls                 │
│    ├── Loops                          │
│    └── Synchronous callbacks          │
└──────────────────┬────────────────────┘
                   ▼
┌──────────────────────────────────────┐          
│ 2. process.nextTick() QUEUE          │  ===== > There Is No process.nextTick in JavaScript , So No 2nd Step in  JavaScript
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
```



=======================================================

---

1. What is the event loop? How does it work and manage asynchronous operations?

   *(Asked 4×: Persistent Systems, TCS (online), Fundwave, Hyland Software)*

==> The **event loop** is the part of Node.js (built by **libuv**) that decides **which callback
runs next** on the single JavaScript thread.

How it works:
- Your JS runs on **one main thread** (the call stack).
- Slow work (file read, DB query, HTTP call, timer) is handed to the **OS or the libuv thread
  pool**. Node does not wait for it.
- When that work finishes, its callback goes into a **queue**.
- When the call stack is empty, the event loop takes callbacks from the queues and runs them,
  phase by phase: **timers → pending → poll (I/O) → check (`setImmediate`) → close**.
- Before moving on after each callback, Node empties the **`process.nextTick` queue** and then
  the **Promise microtask queue**.

```js
console.log('1');                               // sync
setTimeout(() => console.log('4'), 0);          // timers phase
Promise.resolve().then(() => console.log('3')); // microtask
console.log('2');                               // sync
// Output: 1 2 3 4
```

In short: the event loop lets one JS thread handle thousands of async tasks without blocking.

---

2. What is middleware? Write a custom middleware function

   *(Asked 4×: Persistent Systems, TCS (online), Capsitech, EarlyCoder 5-yr Node (YT))*

==> In Express, **middleware** is a function `(req, res, next)` that runs **between the request
arriving and the response being sent**.
- It can read or change `req` / `res`.
- It can end the request (`res.send(...)`) or pass control on with **`next()`**.
- Middleware runs **in the order you add it** with `app.use()`.
- Common uses: logging, auth, validation, body parsing, rate limiting, error handling.
- Types: application-level (`app.use`), router-level (`router.use`), built-in
  (`express.json()`), third-party (`cors`, `helmet`), **error-handling** (4 args:
  `(err, req, res, next)`).

```js
const express = require('express');
const app = express();

// custom logger middleware
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // go to the next middleware / route
}

// custom auth middleware
function auth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

app.use(logger);                       // runs for every request
app.get('/profile', auth, (req, res) => res.send('My profile')); // only this route

app.listen(3000);
// GET /profile (no token) → logs "GET /profile", responds 401
```

Interview tip: if you forget `next()` and don't send a response, the request **hangs**.

In short: middleware = a chain of `(req, res, next)` functions that every request passes through.

---

3. Have you built real-time applications / used Socket.io? How did you integrate it?

   *(Asked 2×: EarlyCoder 5-yr Node (YT), Senior Node Ep.32 (YT))*

==> Sample answer: "Yes. I used **Socket.io** for notifications, chat and live status updates. I
attached Socket.io to the same HTTP server as Express, checked the JWT once in the
**handshake** with `io.use()`, and used **rooms** so events go only to the right users."

How it is integrated:
1. Create the HTTP server from the Express app and attach Socket.io to it.
2. Add `io.use()` middleware to verify the JWT on connect.
3. Listen with `socket.on`, send with `socket.emit` / `io.to(room).emit`.
4. Client connects with `io(url, { auth: { token } })`.

```js
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);           // one server for REST + sockets
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.join(`user:${socket.handshake.auth.userId}`);   // private room per user
  socket.on('chat', (msg) => io.emit('chat', msg));      // broadcast to everyone
});

// from anywhere in the app (e.g. after an order is placed)
// io.to('user:42').emit('notification', { text: 'Order shipped' });

server.listen(3000);
```

In short: Socket.io on the same server as Express, JWT check in the handshake, rooms to target
users.

---

4. What is Express.js?

   *(Asked 2×: TCS (online), Technovert)*

==> **Express.js** is a small, popular **web framework for Node.js**.
- Node gives you the runtime and the raw `http` module; Express makes building servers and
  REST APIs easy.
- It adds **routing** (`app.get`, `app.post`), **middleware**, and helpers like `res.json()`,
  `res.status()`, `req.params`, `req.query`.
- Much less code than the raw `http` module (no manual URL parsing or body reading).

```js
const app = require('express')();
app.get('/hello', (req, res) => res.json({ msg: 'Hi' }));
app.listen(3000);
// GET /hello → {"msg":"Hi"}
```

In short: Express = routing + middleware on top of Node's HTTP server.

---

5. How do you create a server in Express.js? Write a basic Express server with an API endpoint

   *(Asked 2×: Persistent Systems, Tech Mahindra (YT))*

==> Steps: `npm install express` → create the app → add middleware and routes → call `listen()`.

```js
const express = require('express');
const app = express();

app.use(express.json()); // parse JSON body into req.body

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Saurabh' }]);
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ id: 2, ...req.body });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

Run `node server.js`, then:
- `GET  http://localhost:3000/api/users` → `[{"id":1,"name":"Saurabh"}]`
- `POST http://localhost:3000/api/users` with `{"name":"Amit"}` → `201 {"id":2,"name":"Amit"}`

In short: `express()` → `app.use()` → `app.get/post()` → `app.listen()`.

---

6. If Node.js is single-threaded, how does it handle concurrency?

   *(Asked 2×: Kyndryl, Bajaj Finserv)*

==> With **non-blocking I/O + the event loop**.
- Only your **JavaScript** runs on one thread.
- Slow I/O is handed off: network sockets go to the **OS** (epoll/kqueue/IOCP), while file
  system, DNS lookup, `crypto` and `zlib` go to the **libuv thread pool** (default 4 threads).
- While that I/O is in progress, Node keeps serving other requests.
- When the I/O finishes, its callback is queued and the event loop runs it.

```js
app.get('/user', async (req, res) => {
  const user = await db.findUser(1); // thread is free while waiting for the DB
  res.json(user);
});
// 1000 requests → 1000 DB queries in flight at once, one JS thread
```

Exception: **CPU-heavy** work (big loops, image processing) blocks the thread. Use
**worker threads** or move it to another service.

In short: Node doesn't wait for I/O, so one thread can juggle thousands of requests.

---

7. Which npm modules do you commonly use, and why that library (e.g. nodemon)?

   *(Asked 2×: Tech Mahindra (YT), Web3Dev)*

==> Sample answer:

```text
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
```

Why **nodemon**: without it you stop and restart `node app.js` after every change. nodemon
watches your files and restarts the server for you. It's a dev-only tool, so it goes in

**`devDependencies`**:

```
npm install --save-dev nodemon
"scripts": { "dev": "nodemon app.js" }   → npm run dev
```

Note: newer Node (v18.11+) also has a built-in `node --watch app.js`.

In short: express for the API, dotenv for config, jsonwebtoken + bcrypt for auth, nodemon for
dev restarts.

---

8. What is Node.js?

   *(Asked 2×: Algoworks, Technovert)*

==> Node.js is a **JavaScript runtime** that lets you run JavaScript outside the browser, mainly on
servers.
- Built on Chrome's **V8** engine (compiles JS to machine code).
- Uses **libuv** for **non-blocking, event-driven I/O**, so one thread handles many requests.
- Gives server-side APIs the browser doesn't have: `fs`, `http`, `path`, `process`, `crypto`.
- Comes with **npm**, the largest package registry.
- Great for REST APIs, real-time apps (chat), microservices, streaming. Not ideal for heavy CPU
  work.

```js
// app.js
const fs = require('fs');
console.log(fs.existsSync('app.js'));
// node app.js → Output: true
```

In short: Node.js = V8 + libuv + built-in modules like `fs` and `http`.

---

9. What are the phases of the Node.js event loop?

   *(Asked 1×: Senior Node.js round (YT))*

==> Each loop iteration goes through these **6 phases** in order:

```text
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
```

- After **every callback**, Node empties the **`process.nextTick` queue** first, then the
  **Promise microtask queue**.
- Because **check** comes right after **poll**, `setImmediate` inside an I/O callback always
  runs before `setTimeout(..., 0)`.

Memory trick: **T-P-I-P-C-C** → Timers, Pending, Idle, Poll, Check, Close.

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
2. `Promise.then` goes to the **microtask queue**; `setTimeout` goes to the event loop's
   **timers phase**.
3. Node drains microtasks as soon as the sync code ends, before the event loop starts its
   phases → `Promise`, then `Timeout`.

In short: sync → microtasks → timers.

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
2. In Node, the **`process.nextTick` queue** runs before the **Promise microtask queue** →
   `nextTick`, then `promise`.
3. Timers run last, in the event loop's **timers phase** → `timeout`.

In short: sync → nextTick → Promise → setTimeout.

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
2. Microtask queue starts as [E, C]. `F` is **not** queued yet – it's added only after `E`
   finishes → queue becomes [C, F].
3. So `E`, `C`, `F`.
4. The timer runs last, in the timers phase → `B`.

In short: a chained `.then` joins the queue only when the previous `.then` finishes.

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

Why: `setTimeout(fn, 0)` never runs right away. Node puts the callback in the **timers phase**,
which only runs after all sync code (`first`, `third`) is done. Also, Node treats `0` as **1 ms**.

In short: `setTimeout 0` means "as soon as the stack is empty", not "now".

---

14. What is the difference between an HTTP connection and a socket connection?

    *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==>
```text
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
| Node: `http` module / Express routes       | Node: `socket.io` or `ws` package          |
+--------------------------------------------+--------------------------------------------+
| Good for normal REST APIs                  | Good for chat, notifications, live updates |
+--------------------------------------------+--------------------------------------------+
```

```js
// HTTP: client asks, server answers once
app.get('/price', (req, res) => res.json({ price: 100 }));

// Socket: server pushes whenever it wants
io.on('connection', (socket) => {
  setInterval(() => socket.emit('price', { price: Math.random() }), 1000);
});
```

In short: HTTP = ask and get one answer; socket = an open two-way phone line.

---

15. How do you authenticate a socket connection? How do you pass the JWT?

    *(Asked 1×: Senior Node Ep.32 (YT))*

==> Check the JWT **once, during the handshake**, before the connection is accepted.
1. Client sends the token in the **`auth`** object when connecting.
2. Server uses **`io.use()`** middleware to `jwt.verify` it.
3. Valid → save the user on `socket` and call `next()`. Invalid →
   `next(new Error('Unauthorized'))` and the connection is refused.

```js
// client
const socket = io('https://api.example.com', { auth: { token: accessToken } });
socket.on('connect_error', (err) => console.log(err.message)); // "Unauthorized" if bad token

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

io.on('connection', (socket) => {
  console.log('Connected:', socket.user.id); // only authenticated users reach here
});
```

In short: token in `auth` → verify in `io.use()` → attach user to `socket`.

---

16. Does the socket handshake start from the front end or the back end?

    *(Asked 1×: Senior Node Ep.32 (YT))*

==> From the **front end (client)**.
- The client sends a normal HTTP request with `Upgrade: websocket` headers.
- The Node server checks it and replies **`101 Switching Protocols`**; now the connection is
  open both ways.
- With Socket.io, the client may first connect via HTTP long-polling and then **upgrade** to
  WebSocket.
- The server only listens (`io.on('connection')`); it never starts the connection.

In short: the client always knocks first; the server opens the door.

---

17. How do you validate the token when there is no middleware on the front end?

    *(Asked 1×: Senior Node Ep.32 (YT))*

==> Validation is never done on the front end. The front end only **sends** the token; the
**Node server** validates it.
- Socket.io has its own server-side middleware: **`io.use((socket, next) => ...)`**.
- It runs during the handshake, reads `socket.handshake.auth.token` and calls `jwt.verify`.
- Bad token → `next(new Error(...))` → connection rejected.
- For per-event checks (e.g. token expired mid-session), use **`socket.use()`**, which runs
  for every incoming event.

```js
io.on('connection', (socket) => {
  socket.use((packet, next) => {
    if (socket.user.exp * 1000 < Date.now()) return next(new Error('Token expired'));
    next();
  });
});
```

In short: the client sends, the server verifies – with `io.use()` on connect and `socket.use()`
per event.

---

18. Is passing the token directly in the socket payload secure?

    *(Asked 1×: Senior Node Ep.32 (YT))*

==> Not a good idea.
- Sending the token in every message payload repeats it everywhere, and it can end up in logs.
- Better: send it **once in the handshake** (`auth` object), verify it in `io.use()`, and
  attach the user to the socket.
- Always use **`wss://`** (TLS), so the token is encrypted on the wire.
- Avoid the URL **query string** – URLs get logged by proxies and servers.
- Keep access tokens short-lived; disconnect the socket (`socket.disconnect()`) when the token
  expires.

In short: token once in the handshake, over `wss://`, never in every message or the URL.

---

19. Which socket handshake objects can carry the token (e.g. auth, query)?

    *(Asked 1×: Senior Node Ep.32 (YT))*

==>
```text
+----------------+-----------------------------------+------------------------------------------+
| Place          | Client sends                      | Server reads                             |
+================+===================================+==========================================+
| `auth`         | `io(url, { auth: { token } })`    | `socket.handshake.auth.token`            |
|                | Best choice                       |                                          |
+----------------+-----------------------------------+------------------------------------------+
| `query`        | `io(url, { query: { token } })`   | `socket.handshake.query.token`           |
|                | Shows in URL/logs – avoid         |                                          |
+----------------+-----------------------------------+------------------------------------------+
| `extraHeaders` | `{ extraHeaders: {                | `socket.handshake.headers.authorization` |
|                |   Authorization: 'Bearer ...' } }`|                                          |
|                | Ignored by the browser WebSocket  |                                          |
|                | transport; works for polling /    |                                          |
|                | Node clients                      |                                          |
+----------------+-----------------------------------+------------------------------------------+
| Cookie         | Sent by the browser automatically | `socket.handshake.headers.cookie`        |
|                | (`withCredentials: true`);        |                                          |
|                | use HttpOnly + Secure + SameSite  |                                          |
+----------------+-----------------------------------+------------------------------------------+
```

In short: use `auth`; avoid `query`.

---

20. Create a Node.js server using the http module

    *(Asked 1×: TCS)*

==> Use the built-in **`http`** module – no install needed.

```js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Hello World!');
  }

  if (req.method === 'GET' && req.url === '/api/user') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ id: 1, name: 'Amit' }));
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

Run `node server.js`:
- `GET /`         → `Hello World!`
- `GET /api/user` → `{"id":1,"name":"Amit"}`
- anything else   → `404 Not Found`

Note: with raw `http` you do routing, JSON conversion and body parsing yourself – that's why
people use Express.

In short: `http.createServer((req, res) => ...)` + `res.writeHead()` + `res.end()` +
`server.listen()`.

---

21. Create an API using any backend framework (Node.js)

    *(Asked 1×: Bajaj Finserv)*

==> A small CRUD API with **Express** (in-memory data to keep it simple):

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

app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.name = req.body.name;
  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== Number(req.params.id));
  res.status(204).end();
});

app.listen(3000);
```

Expected:
- `GET /users`     → `[{"id":1,"name":"Amit"}]`
- `GET /users/5`   → `404 {"message":"Not found"}`
- `DELETE /users/1` → `204` (empty body)

In short: `express.json()` + one route per HTTP method + proper status codes.

---

22. Which framework have you used for Node.js in your projects / microservices?

    *(Asked 1×: Tech Mahindra (YT))*

==> Sample answer: "Mainly **Express.js**. It's lightweight, has a huge middleware ecosystem, and I
structure it as **routes → middleware → controllers → services → models**. I also know
**NestJS**, which adds TypeScript, modules and dependency injection for bigger projects."

```text
+-----------+--------------------------------------------+
| Framework | One line                                   |
+===========+============================================+
| Express   | Minimal, flexible, most popular            |
+-----------+--------------------------------------------+
| NestJS    | Structured, TypeScript, Angular-like, good |
|           | for large apps                             |
+-----------+--------------------------------------------+
| Fastify   | Very fast, built-in JSON schema validation |
+-----------+--------------------------------------------+
| Koa       | From the Express team, modern async        |
|           | middleware                                 |
+-----------+--------------------------------------------+
```

In short: Express for most services, NestJS when the project needs strong structure.

---

23. Why is Node.js single-threaded?

    *(Asked 1×: Bajaj Finserv)*

==> Node runs your JavaScript on **one main thread** on purpose, to keep things **simple and
light**.
- **No locks, no race conditions**: two pieces of your JS never run at the same moment, so you
  don't need mutexes around shared variables.
- **Low memory**: no new thread per request (unlike classic thread-per-request servers), so one
  Node process can hold thousands of open connections.
- **Most server work is waiting** (DB, files, network). Waiting doesn't need a thread; the
  **event loop** just runs the callback when the result is ready.

Important: only **JS execution** is single-threaded, not the whole of Node.
- **libuv thread pool** (default **4** threads, `UV_THREADPOOL_SIZE`) runs `fs`, `crypto`,
  `zlib`, `dns.lookup`.
- **worker_threads** let you run CPU-heavy JS on other threads.

```js
const crypto = require('crypto');
console.log('start');
crypto.pbkdf2('pwd', 'salt', 100000, 64, 'sha512', () => console.log('hash done')); // thread pool
console.log('end');
// Output: start, end, hash done
```

In short: one JS thread = simple and memory-cheap; the heavy waiting is done by libuv and the OS.

---

24. How do you handle high concurrency (non-blocking code)?

    *(Asked 1×: Wipro)*

==> Main rule: **never block the event loop**. Then spread the load.
1. Use async APIs only (`fs.promises`, async DB drivers). No `readFileSync`, `crypto.pbkdf2Sync`
   or long loops inside request handlers.
2. Run independent calls together with `Promise.all` instead of one after another.
3. Move CPU-heavy work to **worker_threads** or a job queue (e.g. BullMQ).
4. Use all CPU cores with the **cluster** module or **PM2** cluster mode.
5. Run several instances behind a **load balancer** (Nginx).
6. **Cache** hot data in Redis; use a DB **connection pool**.
7. Use **streams** for big files; add **rate limiting**.

```js
// slow: one after another (~300 ms)
const user = await getUser(id);      // 100 ms
const orders = await getOrders(id);  // 200 ms

// fast: in parallel (~200 ms)
const [user2, orders2] = await Promise.all([getUser(id), getOrders(id)]);
```

In short: keep the one JS thread free, and scale out with cluster/PM2 when one process isn't
enough.

---

25. Why is Node.js able to handle many requests? Is Node.js multi-threaded?

    *(Asked 1×: Tech Mahindra (YT))*

==> **Many requests:** because I/O is **non-blocking**. Node starts the DB/file/network call, moves
on to the next request, and runs the callback later through the **event loop**. No thread sits
idle waiting.

**Multi-threaded?** Your JavaScript runs on **one main thread**. But Node as a whole is not
single-threaded:
- Network I/O is handled by the OS (epoll / kqueue / IOCP) – no extra threads needed.
- **libuv thread pool** (default **4** threads, `UV_THREADPOOL_SIZE`) runs `fs`, `dns.lookup`,
  `crypto` (e.g. `pbkdf2`) and `zlib` work.
- You can create your own threads with **worker_threads**.

In short: "single-threaded for running JS, multi-threaded under the hood."

---

26. How would you define the term I/O?

    *(Asked 1×: Bajaj Finserv)*

==> **I/O = Input/Output**: any time Node talks to something outside the process.
- Examples in Node: `fs.readFile`, a DB query, an `http`/`fetch` call, a socket, `console.log`.
- I/O is slow compared to CPU work, so Node does it **asynchronously**: it starts the I/O,
  serves other requests, and runs your callback when the result is ready.

```js
const fs = require('fs');
fs.readFile('a.txt', 'utf8', () => console.log('file read'));  // I/O – runs later
console.log('next line');
// Output:
// next line
// file read
```

In short: I/O is waiting on the outside world – Node never sits and waits for it.

---

27. What is the difference between module.exports and exports? (purpose of module.exports)

    *(Asked 1×: Tech Mahindra (YT))*

==> **`module.exports` is what `require()` returns.** `exports` is just a shortcut variable that
points to the same object at the start (`exports = module.exports`).

```text
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
```

```js
// math.js
exports.add = (a, b) => a + b;   // works – adds to the shared object
exports = { sub: (a, b) => a - b }; // ignored – exports now points to a new object

// app.js
const math = require('./math');
console.log(math);               // Output: { add: [Function (anonymous)] }
```

In short: always safe to use `module.exports`; use `exports.x` only to add properties.

---

28. What is a circular dependency in Node.js?

    *(Asked 1×: Senior Node.js round (YT))*

==> When two modules **require each other** (A requires B, and B requires A).
- Node doesn't crash or loop forever. It gives B a **partially finished** copy of A's
  `module.exports` (whatever A had exported so far).
- Result: some values are `undefined` → confusing bugs.
- Fix: move shared code into a third module, `require` inside the function that needs it, or
  use dependency injection.

```js
// a.js
const b = require('./b');
module.exports = { name: 'A' };

// b.js
const a = require('./a');
console.log(a.name);   // Output: undefined – a.js hasn't finished yet

// run: node a.js
```

In short: circular require = half-loaded module = `undefined` values.

---

29. What are the globals / global object in Node.js?

    *(Asked 1×: Senior Node.js round (YT))*

==> Globals are things you can use **without `require`**.
- **`global`** (or `globalThis`) – Node's global object (in Node there is no `window`).
- **`process`** – env vars, argv, `exit`, `nextTick`.
- `console`, `Buffer`, `setTimeout`, `setInterval`, `setImmediate`, `clearTimeout`, `URL`,
  `fetch` (Node 18+).
- **Module-scoped** (look global, but each file gets its own): `__dirname`, `__filename`,
  `require`, `module`, `exports`. Node wraps every CommonJS file in a function that passes
  these in.

```js
var x = 10;
console.log(global.x);   // Output: undefined – top-level vars stay inside the module
global.y = 20;
console.log(y);          // Output: 20
```

In short: `global` + `process` + timers + `Buffer` are true globals; `__dirname` and `require`
are per-module.

---

30. What is the difference between Node and Node.js?

    *(Asked 1×: Deloitte (YT))*

==> **No difference.** "Node" is just the short name for Node.js. The command you run is `node`
(e.g. `node app.js`).

---

31. What are the drawbacks of Node.js?

    *(Asked 1×: Bajaj Finserv)*

==>
- **Bad for CPU-heavy work** (image/video processing, big calculations): it blocks the single JS
  thread, so every other request waits. Needs `worker_threads` or a separate service.
- **Callback hell** in old callback-style code (fixed with Promises / async-await).
- One unhandled error can **crash the whole process** (all users affected) – needs PM2 /
  Docker restarts.
- **npm ecosystem risk**: many small packages, mixed quality, supply-chain security issues.
- Plain JS has **no types** → runtime bugs (use TypeScript).
- One process uses **one CPU core** by default – need cluster/PM2 to use all cores.

In short: great for I/O-heavy apps, weak for CPU-heavy ones.

---

32. Explain REST APIs

    *(Asked 1×: TCS (online))*

==> REST (**Representational State Transfer**) is a style for building APIs over HTTP. In Node
we usually build them with Express.
- Everything is a **resource** with a URL: `/users`, `/users/5`.
- **HTTP methods** say the action: GET (read), POST (create), PUT/PATCH (update), DELETE.
- **Stateless**: each request carries everything it needs (e.g. JWT in the `Authorization`
  header); the server keeps no session.
- Responses use **status codes** (200, 201, 400, 401, 404, 500) and **JSON**.

```js
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.status(200).json(user);
});
// GET /api/users/5  →  200 { "id": 5, "name": "Amit" }
```

In short: resources as URLs + HTTP methods as verbs + JSON + status codes, stateless.

---

33. How does an API work?

    *(Asked 1×: Web3Dev)*

==> In a Node/Express app, a request goes through this flow:
1. Client sends an **HTTP request** (method, URL, headers, body).
2. Node's `http` server receives it; Express matches the **route**.
3. **Middleware** runs first (body parsing, auth, validation).
4. The **controller/service** runs the logic and talks to the DB (async, non-blocking).
5. Express sends the **response**: status code + JSON.

```js
app.post('/api/login', express.json(), auth.validate, async (req, res) => {
  const token = await authService.login(req.body);
  res.json({ token });   // 200 { "token": "..." }
});
```

In short: request in → middleware → logic → response out.

---

34. Which REST API methods have you used (GET, POST, PUT, PATCH, DELETE)?

    *(Asked 1×: American Express)*

==> Sample answer: "I've used all of them in Express."

```text
+--------+----------------------------+-------------------------------+--------------+
| Method | Purpose                    | Express route                 | Usual status |
+========+============================+===============================+==============+
| GET    | Read data                  | `app.get('/users')`           | 200          |
+--------+----------------------------+-------------------------------+--------------+
| POST   | Create                     | `app.post('/users')`          | 201          |
+--------+----------------------------+-------------------------------+--------------+
| PUT    | Replace the whole resource | `app.put('/users/:id')`       | 200          |
+--------+----------------------------+-------------------------------+--------------+
| PATCH  | Update some fields         | `app.patch('/users/:id')`     | 200          |
+--------+----------------------------+-------------------------------+--------------+
| DELETE | Remove                     | `app.delete('/users/:id')`    | 200 / 204    |
+--------+----------------------------+-------------------------------+--------------+
```

Interview tip: GET, PUT, DELETE are **idempotent** (calling twice leaves the same result); POST
is not (it creates a new record each time). PATCH is not guaranteed to be idempotent.

---

35. Explain the architecture and implementation of a RESTful API you developed

    *(Asked 1×: Upelars)*

==> Sample answer: "I built REST APIs with Node.js + Express in a layered structure:"
1. **Routes** – endpoints and methods (`router.get('/orders', ...)`).
2. **Middleware** – JWT auth, role checks, validation (Joi), rate limiting, logging.
3. **Controllers** – read `req`, call the service, send `res`.
4. **Services** – business logic.
5. **Models / repositories** – DB access (Mongoose / Sequelize / mysql2).
6. **Central error handler** – one place that returns consistent JSON errors.
7. **Config** in `.env`, Swagger docs, Jest + Supertest tests.

```
src/
  routes/order.routes.js
  controllers/order.controller.js
  services/order.service.js
  models/order.model.js
  middlewares/auth.js, error.js
  app.js
```

"For example `GET /api/orders` lists orders with pagination, and `POST /api/orders` validates
the body and returns 201. All responses have the same JSON shape and proper status codes."

---

36. What is the difference between process.nextTick() and setImmediate()? Which runs first?

    *(Asked 1×: TCS/Infosys/Accenture short (YT))*

==> **`process.nextTick` runs first.**

```text
+--------------------------------------------+--------------------------------------------+
| `process.nextTick()`                       | `setImmediate()`                           |
+============================================+============================================+
| Runs right after the current operation,    | Runs in the **check** phase of the event   |
| before the event loop moves on             | loop                                       |
+--------------------------------------------+--------------------------------------------+
| Runs even before Promise callbacks         | Runs after the poll (I/O) phase            |
+--------------------------------------------+--------------------------------------------+
| Too many (or recursive) calls can          | Safe – I/O gets a chance between calls     |
| **starve** the event loop                  |                                            |
+--------------------------------------------+--------------------------------------------+
```

```js
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
// Output:
// nextTick
// promise
// immediate
```

In short: nextTick = "right now, before anything else"; setImmediate = "next check phase".

---

37. Why does process.nextTick() run before setImmediate()?

    *(Asked 1×: TCS/Infosys/Accenture short (YT))*

==> Because `process.nextTick` is **not part of the event loop phases**.
- Node drains the **nextTick queue** as soon as the current JS operation finishes, before the
  event loop continues (and before Promise microtasks).
- `setImmediate` has to wait until the event loop reaches the **check** phase.
- So nextTick always wins. The names are swapped in meaning: "nextTick" is actually more
  immediate than "setImmediate" (the Node docs say this themselves).

In short: nextTick skips the queue; setImmediate waits its turn in the loop.

---

38. What is the difference between setImmediate() and setTimeout()?

    *(Asked 1×: Tech Mahindra (YT))*

==>
```text
+--------------------------------------------+-------------------------------------------+
| `setTimeout(fn, 0)`                        | `setImmediate(fn)`                        |
+============================================+===========================================+
| Runs in the **timers** phase               | Runs in the **check** phase               |
+--------------------------------------------+-------------------------------------------+
| Waits at least the delay (0 becomes 1 ms)  | No delay, runs right after the poll (I/O) |
|                                            | phase                                     |
+--------------------------------------------+-------------------------------------------+
| Also exists in browsers                    | Node-only API                             |
+--------------------------------------------+-------------------------------------------+
```

Order:
- In the **main script**, the order is **not guaranteed** (depends on whether 1 ms has passed
  when the loop starts).
- Inside an **I/O callback**, `setImmediate` **always runs first** (check comes right after
  poll; timers only on the next loop).

```js
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
// Output (always):
// immediate
// timeout
```

In short: setTimeout = timers phase, after a delay; setImmediate = check phase, after I/O.

---

39. How do you implement centralized error handling in Express?

    *(Asked 1×: Wipro)*

==> Add **one error-handling middleware** (4 arguments: `err, req, res, next`) **after all routes**.
Routes just forward errors with `next(err)`.

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
    next(err); // go to the central handler
  }
});

// central error handler – always last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
// GET /users/999  →  404 { "message": "User not found" }
```

Interview tip: Express 5 forwards rejected promises from async handlers automatically; in
Express 4 you need try/catch or an `asyncHandler` wrapper.

In short: throw / `next(err)` everywhere, handle in one 4-argument middleware at the end.

---

40. How do you handle unexpected exceptions (uncaughtException / unhandledRejection)?

    *(Asked 1×: Tech Mahindra (YT))*

==>
- First, catch errors normally: try/catch with async/await, `.catch()` on Promises, and the
  central Express error handler.
- As a **last safety net**, listen to `process` events: log the error, then **exit and let
  PM2 / Docker / Kubernetes restart** the app (after an uncaught error the app may be in a bad
  state).
- Since **Node 15**, an unhandled rejection crashes the process by default.

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

==> Node core callbacks follow the **error-first** pattern: the **first argument is the error**
(or `null` on success), the rest are results. Always check it first and `return`.

```js
const fs = require('fs');

fs.readFile('missing.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Failed:', err.code);
    return;
  }
  console.log(data);
});
// Output: Failed: ENOENT
```

In short: `(err, result) => { if (err) return ...; }` – error always comes first.

---

42. How can you improve Node.js application performance?

    *(Asked 1×: Deloitte)*

==>
1. **Don't block the event loop** – async APIs only; move CPU work to `worker_threads`.
2. **Cache** frequent data (Redis or in-memory).
3. **Optimize the DB**: indexes, select only needed fields, pagination, connection pooling,
   avoid N+1 queries.
4. Run independent tasks in parallel with `Promise.all`.
5. Use all cores with **cluster / PM2**; scale horizontally behind a load balancer.
6. Use **compression** (gzip) and **streams** for large data.
7. **Profile** before fixing: `node --inspect`, `node --prof`, clinic.js, APM tools.

In short: free event loop + cache + fast DB + all CPU cores + measure first.

---

43. If 10k requests hit your API, how will you handle them efficiently?

    *(Asked 1×: American Express)*

==>
1. Keep handlers **non-blocking** (async I/O only), so one process can juggle thousands of
   requests.
2. **Cache** repeated reads in Redis so most requests skip the DB.
3. Use a DB **connection pool** and indexed queries.
4. Run **multiple Node processes** (cluster / PM2 / containers) behind a **load balancer**.
5. Push slow work (emails, reports) to a **queue** (BullMQ, RabbitMQ, Kafka) and reply fast.
6. Add **rate limiting** (`express-rate-limit`) to protect the system.
7. **Auto-scale** and monitor to add instances under load.

In short: non-blocking code + cache + pool + more processes + queues.

---

44. An API takes 10 seconds and must respond in 2–3 seconds. What steps do you take to optimize it?

    *(Asked 1×: Senior Node.js round (YT))*

==> First **measure**, then fix. Don't add indexes blindly.
1. Add timing logs (or an APM tool) to find what's slow: DB, external API, or JS code.
2. If the DB is slow: run **EXPLAIN** to see if the query does a full table scan.
3. Add the right **index** on columns used in WHERE / JOIN / ORDER BY (the primary key index
   doesn't help a search on `name` or `age`).
4. Fetch only needed columns; add pagination; remove N+1 queries.
5. Run independent calls in **parallel** (`Promise.all`) instead of one by one.
6. **Cache** results that rarely change (Redis).
7. Move heavy work to a **background job** and return early (e.g. 202 Accepted).
8. Check for **event-loop blocking** (sync code, big `JSON.parse`) and re-test.

```js
console.time('db');
const orders = await Order.find({ userId });
console.timeEnd('db');   // Output: db: 8200.123ms  ← the slow part
```

In short: measure → fix the biggest bottleneck → measure again.

---

45. Write sample code to connect a Node.js application to a database

    *(Asked 1×: Persistent Systems)*

==> MongoDB with **Mongoose**:

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
// Output: MongoDB connected
```

MySQL with a **connection pool** (`mysql2`):

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

Interview tip: keep credentials in `.env` (`process.env`), never in code; connect once at
startup and reuse the connection / pool.

---

46. How do you do database operations in Node.js?

    *(Asked 1×: Wipro)*

==> Use a DB **driver** or an **ORM/ODM** from npm, always with async/await:
- MongoDB: **Mongoose** (ODM) – `find`, `findById`, `create`, `updateOne`, `deleteOne`.
- SQL: `mysql2` / `pg` drivers, or ORMs like Sequelize, Prisma, TypeORM.
- Use **parameterized queries** (`?` placeholders) to prevent SQL injection.
- Use a connection pool, try/catch for errors, and **transactions** for multi-step updates.

```js
// CRUD with Mongoose
const user = await User.create({ name: 'Amit' });           // Create
const users = await User.find({ active: true });            // Read
await User.updateOne({ _id: user._id }, { name: 'Ravi' });  // Update
await User.deleteOne({ _id: user._id });                    // Delete

// SQL with a placeholder (safe from injection)
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
```

In short: driver/ORM + async/await + placeholders + pool.

---

47. Write a GET API that queries MongoDB and finds the employee with a given id

    *(Asked 1×: Bajaj Finserv)*

==> Use **Express** for the route and **Mongoose** for MongoDB. Steps: read `req.params.id`, check
it is a valid **ObjectId**, call `findById`, and return 404 if nothing comes back.

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

Expected responses:
- `GET /employees/665f1c...` (exists)  → `200 { "_id": "...", "name": "Amit", ... }`
- `GET /employees/abc`                 → `400 { "message": "Invalid id" }`
- Valid id but no record               → `404 { "message": "Employee not found" }`

In short: validate id → `findById` → 400 / 404 / 200, wrapped in try/catch.

---

48. How do you handle asynchronous operations in Node.js?

    *(Asked 1×: Deloitte)*

==> Node gives three styles, from old to modern:
1. **Callbacks** – Node's **error-first** style `(err, data)`. Nesting them leads to
   **callback hell**.
2. **Promises** – `.then()` / `.catch()`; `Promise.all` runs tasks in parallel. Core modules
   have Promise versions (`fs/promises`, `timers/promises`).
3. **async/await** – reads like normal code, errors caught with `try/catch`. This is what I use
   most.

```js
const fs = require('fs');
const fsp = require('fs/promises');

// 1. Callback
fs.readFile('a.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// 3. async/await
async function read() {
  try {
    const data = await fsp.readFile('a.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

While Node waits for the file / DB / API, the **event loop** keeps serving other requests.

In short: callbacks → Promises → async/await; the main thread never sits waiting.

---

49. How do you implement asynchronous programming in Node.js?

    *(Asked 1×: Tech Mahindra (YT))*

==> Same base tools as Q48 (callbacks, Promises, async/await), plus these Node tools:
- **`util.promisify`** – turns an old callback API into a Promise one.
- **`Promise.all` / `Promise.allSettled`** – run independent tasks in parallel.
- **EventEmitter** – react to events (`on` / `emit`).
- **Streams** – handle data that arrives in chunks over time.
- **worker_threads** – move CPU-heavy work off the main thread so the event loop stays free.

```js
const fs = require('fs/promises');

async function readTwoFiles() {
  const [a, b] = await Promise.all([      // both reads run at the same time
    fs.readFile('a.txt', 'utf8'),
    fs.readFile('b.txt', 'utf8'),
  ]);
  return a + b;
}
```

In short: async/await for flow, Promise.all for parallel, events/streams for ongoing data,
workers for heavy CPU.

---

50. What is libuv and what role does it play in Node.js?

    *(Asked 1×: Persistent Systems)*

==> **libuv** is the C library inside Node that gives it the **event loop** and **async I/O**.
- It runs the **event loop** phases: timers → pending callbacks → poll → check → close.
- **Network I/O** (sockets, HTTP) uses the OS's own async system (epoll on Linux, kqueue on
  macOS, IOCP on Windows) – it does NOT use the thread pool.
- It has a **thread pool** (default **4** threads, change with `UV_THREADPOOL_SIZE`) for work
  the OS can't do async: `fs`, `crypto` (pbkdf2, scrypt), `zlib`, `dns.lookup`.
- When work finishes, libuv queues the callback and the event loop runs it on the main JS
  thread.

```js
const crypto = require('crypto');
crypto.pbkdf2('pass', 'salt', 100000, 64, 'sha512', () => console.log('hash done'));
console.log('main thread not blocked');
// Output:
// main thread not blocked
// hash done
```

In short: **V8** runs your JavaScript; **libuv** gives Node the event loop, async I/O and the
thread pool.

---

51. Explain Node.js and its event-driven model (what does event-driven programming mean?)

    *(Asked 1×: One97 Paytm)*

==> In Node, code mostly runs **in response to events** – a request arrives, a file finishes
reading, a timer fires – instead of running top to bottom and waiting.
- You register a callback (a **listener**); the **event loop** calls it when the event happens.
- Many core objects are **EventEmitters**: `http.Server` ('request'), streams ('data', 'end'),
  `process` ('exit').
- The `events` module lets you create your own events.

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('orderPlaced', (id) => console.log('Send email for order', id)); // listener
emitter.emit('orderPlaced', 101);                                           // fire event
// Output: Send email for order 101
```

In short: "when X happens, run this function" – that's how one Node thread handles many things
without blocking.

---

52. What are streams in Node.js?

    *(Asked 1×: Wipro)*

==> Streams let Node **process data in small chunks** instead of loading it all into memory.
- Great for big files, video, uploads, large DB exports.
- Four types:
  - **Readable** – `fs.createReadStream`, `req`
  - **Writable** – `fs.createWriteStream`, `res`
  - **Duplex** – both, e.g. a TCP socket
  - **Transform** – changes data on the way, e.g. `zlib.createGzip()`
- Streams are EventEmitters (`data`, `end`, `error`, `finish`).
- `pipe()` / `pipeline()` connect them and handle **backpressure** (pause the source when the
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
// Output: Done   (a 5 GB file is compressed using only a few KB of memory at a time)
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
- The `readFile` callback runs in the **poll** phase.
- Right after poll comes the **check** phase → `setImmediate` runs.
- `setTimeout(0)` has to wait for the **timers** phase of the next loop turn.

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

Interview tip: in the main module (not inside I/O) the order of these two is **not
guaranteed** – it depends on how fast the process starts.

In short: inside I/O, poll → check (immediate) → next loop's timers (timeout).

---

54. A route runs a 5-second synchronous loop. What happens to other requests (e.g. /health) during
    that time?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> **Every other request waits** – even `/health` gets no reply for 5 seconds.
- Your JavaScript runs on **one main thread**.
- A sync loop **blocks the event loop**, so no other request, callback or timer can run.
- Load balancers / Kubernetes may mark the server as dead because health checks time out.

```js
app.get('/slow', (req, res) => {
  const end = Date.now() + 5000;
  while (Date.now() < end) {} // blocks everything
  res.send('done');
});
app.get('/health', (req, res) => res.send('ok')); // waits until /slow finishes
```

Fixes:
1. Move CPU-heavy work to **worker_threads** or a background job queue (e.g. BullMQ).
2. Split the work into small chunks and yield with `setImmediate`.
3. Run more processes (**cluster** / PM2) – other processes still answer, but the blocked one
   is still stuck.

In short: blocking the event loop blocks the whole process, not just one request.

---

55. Polling vs Server-Sent Events (SSE) vs WebSocket: when do you use each?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> All three push fresh data to the client from a Node server; they differ in direction and cost.

```text
+-----------+-----------------------------+-------------------------------+------------------------------+
|           | Polling                     | SSE                           | WebSocket                    |
+===========+=============================+===============================+==============================+
| How       | Client calls an Express     | One HTTP response kept open;  | Persistent two-way           |
|           | route every few seconds     | server keeps `res.write()`ing | connection (`ws`, Socket.io) |
+-----------+-----------------------------+-------------------------------+------------------------------+
| Direction | Client → server             | Server → client only          | Both ways                    |
+-----------+-----------------------------+-------------------------------+------------------------------+
| Data      | Any                         | Text only (UTF-8)             | Text and binary              |
+-----------+-----------------------------+-------------------------------+------------------------------+
| Reconnect | N/A                         | Built into the browser        | You handle it (or Socket.io) |
+-----------+-----------------------------+-------------------------------+------------------------------+
| Use for   | Rare updates (job status)   | Live feeds, notifications,    | Chat, games, collaborative   |
|           |                             | AI token streaming            | editing                      |
+-----------+-----------------------------+-------------------------------+------------------------------+
```

SSE in Express:

```js
app.get('/events', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
  const timer = setInterval(() => res.write(`data: ${Date.now()}\n\n`), 1000);
  req.on('close', () => clearInterval(timer)); // client left
});
// Client receives: data: 1732420000000 ... every second
```

In short: rare updates → polling; server-only push → SSE; real-time two-way → WebSocket.

---

56. Socket.io vs plain WebSocket: what is the difference?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> **WebSocket** is a protocol (in Node you use the `ws` package). **Socket.io** is a library
built on top of it with extra features.

```text
+--------------------------------+-----------------------------+--------------------------------------------+
|                                | Plain WebSocket (`ws`)      | Socket.io                                  |
+================================+=============================+============================================+
| Type                           | Standard protocol           | Library (own protocol on top of WebSocket) |
+--------------------------------+-----------------------------+--------------------------------------------+
| Client                         | Any WebSocket client        | Needs the Socket.io client                 |
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
```

```js
// ws – only raw 'message' events
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => ws.on('message', (msg) => ws.send(`echo: ${msg}`)));

// Socket.io – named events + rooms
io.on('connection', (socket) => {
  socket.join('room1');
  socket.on('chat', (msg) => io.to('room1').emit('chat', msg));
});
```

In short: `ws` for lightweight, standard sockets; Socket.io when you want rooms, reconnect and
fallbacks out of the box.

---

57. How do you scale Socket.io across multiple servers?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> Problem: each Node server only knows **its own** connected sockets, so an emit on server A
never reaches users connected to server B.
1. Add an **adapter** – e.g. `@socket.io/redis-adapter`. Servers share events through Redis
   Pub/Sub, so `io.to(room).emit()` reaches users on every server.
2. Turn on **sticky sessions** at the load balancer – needed when HTTP long-polling is used,
   because all requests of one session must hit the same server.
3. With Node **cluster** on one machine, use `@socket.io/sticky` + `@socket.io/cluster-adapter`.

```js
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pub = createClient({ url: 'redis://localhost:6379' });
const sub = pub.duplicate();
await Promise.all([pub.connect(), sub.connect()]);
io.adapter(createAdapter(pub, sub));
```

In short: **Redis adapter + sticky sessions**.

---

58. Why use Express if Node.js already has the http module?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> Node's `http` module is low-level – you parse the URL, check the method, set headers and
stringify JSON yourself. Express adds the common pieces:
- **Routing** by method and path, with params (`/users/:id`).
- **Middleware** chain (auth, logging, CORS, body parsing).
- Helpers: `res.json()`, `res.status()`, `res.redirect()`.
- Central **error handling**.
- Huge middleware ecosystem on npm.

```js
// Plain http
http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([]));
  }
}).listen(3000);

// Express – same thing
app.get('/users', (req, res) => res.json([]));
```

In short: Express is a thin layer over `http` that cuts boilerplate and organises code.

---

59. How do you read route params, query string, body and headers in Express? Why is req.body
    undefined without express.json() (body-parser)?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> Each part of the request has its own place in Express:
- Route params → **`req.params`** (`/users/:id` → `req.params.id`)
- Query string → **`req.query`** (`?page=2` → `req.query.page`, always a string)
- Body → **`req.body`**
- Headers → `req.headers['authorization']` or `req.get('Authorization')`

Why `req.body` is undefined:
- In Node, `req` is a **readable stream** – the body arrives as raw bytes, and Express does not
  read it by default.
- **`express.json()`** (the built-in body-parser) reads the stream, parses JSON and sets
  `req.body`. Without it, `req.body` is `undefined`.
- HTML forms → `express.urlencoded({ extended: true })`; file uploads → `multer`.

```js
app.use(express.json());

app.post('/users/:id', (req, res) => {
  res.json({
    id: req.params.id,
    page: req.query.page,
    token: req.get('Authorization'),
    name: req.body.name,
  });
});
// POST /users/5?page=2  body {"name":"Amit"}
// Output: { "id": "5", "page": "2", "token": "Bearer x", "name": "Amit" }
```

Interview tip: `express.json()` only parses when `Content-Type` is `application/json`.

In short: params, query, body, headers – and no `express.json()` means no `req.body`.

---

60. Why do you get "Cannot set headers after they are sent to the client"?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> You sent a response **twice** for the same request. Once `res.send()` / `res.json()` runs,
headers are already gone, so Node throws **ERR_HTTP_HEADERS_SENT**.

Common causes:
- Missing `return` after `res.send()` inside an `if`.
- Calling `next()` after already sending a response.
- Sending inside a callback and also after it.

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

In short: one request = one response. Use `return res...` to stop the handler.

---

61. Express vs Fastify

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> Both are Node.js web frameworks.

```text
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
```

```js
// Express
app.get('/hi', (req, res) => res.json({ msg: 'hi' }));

// Fastify – just return the value
fastify.get('/hi', async () => ({ msg: 'hi' }));
```

In short: Express for simplicity and ecosystem; Fastify when speed and built-in schema
validation matter.

---

62. CommonJS vs ES Modules (require vs import)

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> Node supports two module systems:
- **CommonJS (CJS)** – Node's original system: `require()` / `module.exports`.
- **ES Modules (ESM)** – the JavaScript standard: `import` / `export`.

```text
+-----------------+--------------------------------+--------------------------------------------+
|                 | CommonJS                       | ES Modules                                 |
+=================+================================+============================================+
| Syntax          | `require()` / `module.exports` | `import` / `export`                        |
+-----------------+--------------------------------+--------------------------------------------+
| Loading         | Synchronous, at runtime        | Static, analysed before running (async     |
|                 |                                | loading)                                   |
+-----------------+--------------------------------+--------------------------------------------+
| Where it works  | Anywhere, even inside an `if`  | Top level (dynamic `import()` for runtime) |
+-----------------+--------------------------------+--------------------------------------------+
| Top-level await | No                             | Yes                                        |
+-----------------+--------------------------------+--------------------------------------------+
| `__dirname`     | Available                      | Not available (use `import.meta.dirname` / |
|                 |                                | `import.meta.url`)                         |
+-----------------+--------------------------------+--------------------------------------------+
| How to enable   | Default for `.js` / `.cjs`     | `.mjs` or `"type": "module"` in            |
|                 |                                | package.json                               |
+-----------------+--------------------------------+--------------------------------------------+
| Tree shaking    | No                             | Yes (static)                               |
+-----------------+--------------------------------+--------------------------------------------+
```

```js
// CommonJS
const fs = require('fs');
module.exports = { add };

// ES Modules
import fs from 'fs';
export const add = (a, b) => a + b;
```

In short: CommonJS is Node's classic default; ESM is the standard – pick one per package with
`"type"`.

---

63. What happens when you require() the same file twice? (module caching)

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> The file runs **only once**. Node stores it in **`require.cache`**, and the second `require()`
returns the **same** `module.exports` object.

```js
// counter.js
let n = 0;
module.exports = () => ++n;

// app.js
const a = require('./counter');
const b = require('./counter');
console.log(a === b);       // true
console.log(a(), b(), a()); // 1 2 3
```

- `a` and `b` are the same function, so `n` is shared.
- To force a reload: `delete require.cache[require.resolve('./counter')]` (rarely needed).

In short: `require()` caches modules, so every module acts like a **singleton**.

---

64. What is npx?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> **npx** comes with npm and **runs a package's command** without installing it globally.
- If the package is installed locally, it runs the one in `node_modules/.bin`.
- If not, it downloads it to a temporary cache and runs it.
- Good for one-time tools and for running a specific version.

```bash
npx create-react-app my-app   # one-time scaffold tool
npx nodemon app.js            # local dev dependency
npx eslint@8 .                # specific version
```

In short: **npm installs** packages; **npx runs** them.

---

65. Semantic versioning: what do ^ and ~ mean in package.json?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> npm versions follow **MAJOR.MINOR.PATCH** (e.g. `1.2.3`):
- MAJOR → breaking changes
- MINOR → new features, backward compatible
- PATCH → bug fixes

```text
+----------+-----------------------+----------------+
| Spec     | Allows                | Example range  |
+==========+=======================+================+
| `^1.2.3` | Minor + patch updates | >=1.2.3 <2.0.0 |
+----------+-----------------------+----------------+
| `~1.2.3` | Patch updates only    | >=1.2.3 <1.3.0 |
+----------+-----------------------+----------------+
| `1.2.3`  | Exact version only    | 1.2.3          |
+----------+-----------------------+----------------+
```

- `npm install express` saves it as `^` by default.
- For `0.x` versions `^` is stricter: `^0.2.3` allows only `<0.3.0`.
- **package-lock.json** pins the exact versions actually installed.

In short: **^** = same major, **~** = same minor, no symbol = exact.

---

66. npm install vs npm ci

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> Both install dependencies, but differently.

```text
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
```

In short: `npm ci` = clean, exact, reproducible install from the lock file.

---

67. What does idempotent mean? Which HTTP methods are idempotent?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> **Idempotent** = calling the same request once or many times leaves the server in the **same
state**.
- Idempotent: **GET, PUT, DELETE, HEAD, OPTIONS** (GET/HEAD/OPTIONS are also **safe** – they
  don't change data).
- Not idempotent: **POST** (each call can create a new record), **PATCH** (not guaranteed, e.g.
  "increment by 1").
- `DELETE /users/5` twice → user 5 is gone either way (second call may return 404, but the
  state is the same).
- Why it matters: idempotent calls are **safe to retry** on network failure. For POST payments,
  send an **Idempotency-Key** header and store it.

```js
// Express: POST made safe to retry with an Idempotency-Key
app.post('/payments', async (req, res) => {
  const key = req.get('Idempotency-Key');
  const saved = await Payment.findOne({ key });
  if (saved) return res.json(saved);          // retry → same result, no double charge
  const payment = await Payment.create({ key, ...req.body });
  res.status(201).json(payment);
});
```

In short: same request repeated = same result on the server.

---

68. REST API design best practices: resource naming, versioning (/api/v1) and pagination

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> Rules I follow when building REST APIs in Express:
- **Naming**: plural nouns, no verbs: `GET /users`, `GET /users/5`, `POST /users`. Nested:
  `GET /users/5/orders`. Lowercase, hyphens.
- **HTTP methods** = the action: GET read, POST create, PUT replace, PATCH partial update,
  DELETE remove.
- **Status codes**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized,
  403 Forbidden, 404 Not Found, 500 Server Error.
- **Versioning**: version in the URL (`/api/v1/users`) so old clients keep working when v2
  changes. In Express: `app.use('/api/v1', v1Router)`.
- **Pagination**: never return all rows.
  - Offset: `?page=2&limit=20` – simple, slow on big tables.
  - Cursor: `?cursor=abc&limit=20` – fast and stable for large / live data.
- **Filtering / sorting**: `?status=active&sort=-createdAt`.
- One consistent JSON error format.

```js
// GET /api/v1/users?page=2&limit=20
router.get('/users', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100); // cap the limit
  const users = await User.find().skip((page - 1) * limit).limit(limit);
  res.json({ data: users, page, limit });
});
app.use('/api/v1', router);
// Output: { "data": [ ...20 users ], "page": 2, "limit": 20 }
```

In short: nouns in URLs, verbs as HTTP methods, version in the path, always paginate.

---

69. What is a health check endpoint?

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A simple route (e.g. `GET /health`) that tells whether the Node service is up.
- Called by load balancers, Kubernetes probes, Docker `HEALTHCHECK` and monitoring tools.
- If it fails, traffic is stopped or the container is restarted.
- **Liveness**: is the process alive? **Readiness**: can it serve traffic (DB, Redis
  connected)?
- Keep it fast; no heavy logic. If the event loop is blocked, it won't answer – which is
  exactly what you want to detect.

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

In short: an endpoint that tells the infrastructure "I'm alive and ready".

---

70. What is API documentation (Swagger / OpenAPI)?

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> It is the "manual" of your Node.js API: which endpoints exist, what they take, what they return.
- **OpenAPI** = the spec file (YAML/JSON) that describes endpoints, params, request/response
  bodies, status codes and auth.
- **Swagger UI** = a web page built from that spec where you can read the docs and "Try it out".
- In Express:
  - `swagger-ui-express` serves the docs page.
  - `swagger-jsdoc` builds the spec from JSDoc comments above your routes.
- Why: frontend/QA know the contract, client code can be generated, new devs onboard faster.

```js
const swaggerUi = require('swagger-ui-express');
const spec = require('./openapi.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
// Open http://localhost:3000/api-docs -> interactive docs
```

In short: OpenAPI is the spec; Swagger UI turns it into interactive docs at `/api-docs`.

---

71. Is Node.js a programming language or a framework?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> Neither. Node.js is a **JavaScript runtime environment**.
- The language is **JavaScript**.
- Node.js = **V8** (runs the JS) + **libuv** (event loop, async I/O) + built-in modules (`fs`,
  `http`, `crypto`, ...).
- It lets JavaScript run **outside the browser**, e.g. on a server.
- Frameworks like **Express, NestJS, Fastify** are built on top of Node.js.

In short: JavaScript is the language, Node.js is the runtime, Express is a framework.

---

72. What is the REPL in Node.js?

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> **REPL = Read, Eval, Print, Loop** — the interactive Node shell.
- Start it by typing `node` with no file name.
- It reads a line, runs it, prints the result, and waits for the next line.
- Good for quickly testing a snippet or a core module (`require('os').cpus().length`).
- Handy: `_` (last result), `.help`, `.editor` (multi-line mode), `.exit` (or Ctrl+C twice).

```bash
$ node
> 2 + 3
5
> _ * 2
10
> .exit
```

In short: the REPL is Node's playground to run JavaScript line by line.

---

73. What are compression and morgan middleware?

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> Two popular third-party **Express middleware**:
- **compression**: gzip/deflate/brotli-compresses the response body → smaller responses, faster
  load, less bandwidth.
- **morgan**: **HTTP request logger** → one log line per request (method, URL, status, time).
- Add both with `app.use()` near the top, so they apply to every route.

```js
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
app.use(compression());   // compress responses
app.use(morgan('dev'));   // logs: GET /users 200 12.3 ms - 512
```

In short: compression makes responses smaller; morgan logs every HTTP request.

---

74. What is a memory leak in Node.js? Common causes and how do you detect it?

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A **memory leak** = memory you no longer need, but something still holds a reference to it, so
V8's garbage collector can't free it. Heap keeps growing → app slows down → crashes with
"JavaScript heap out of memory".

Common causes:
- Module-level arrays/maps/caches that only grow (no size limit or TTL).
- Event listeners added on every request and never removed.
- `setInterval` timers that are never cleared.
- Closures holding on to big objects.

How to detect:
- Watch `process.memoryUsage().heapUsed` — keeps going up under steady load = leak.
- `node --inspect app.js` → Chrome DevTools → take **heap snapshots** and compare them.
- Tools: clinic.js, APM (New Relic, Datadog), `pm2 monit`.

```js
const cache = {};                       // leak: grows forever
app.get('/user/:id', (req, res) => {
  cache[req.params.id] = new Array(1e5).fill('x');
  res.send('ok');
});
```

In short: leak = unused memory still referenced; find it with heap snapshots, fix it with bounded
caches, `off()`/`removeListener()` and `clearInterval()`.

---

75. What is heap memory, and how does garbage collection work in Node.js (V8)?

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> - **Stack**: function call frames and local values; small and fast, freed when a function
  returns.
- **Heap**: objects, arrays, functions, closures — anything created dynamically.
- V8 cleans the heap with **garbage collection (GC)**: anything not reachable from the roots
  (globals, current call stack) is freed.
- The heap is **generational**:
  - **Young generation (new space)**: new objects; cleaned often and fast (**Scavenge**). Most
    objects die young.
  - **Old generation (old space)**: objects that survived a couple of GCs; cleaned less often
    with **Mark-Sweep-Compact** (mark live objects, sweep the rest, compact the gaps).
- Raise the old-space limit if needed: `node --max-old-space-size=4096 app.js` (in MB).

```js
console.log(process.memoryUsage());
// Output (example): { rss: 30000000, heapTotal: 6000000, heapUsed: 4000000, ... }
```

In short: objects live in the heap, and V8's generational GC frees whatever is no longer
reachable.

---

76. How do you debug a Node.js application?

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> - `console.log` / `console.error` for quick checks.
- `node --inspect app.js` (or `--inspect-brk` to pause on the first line) → open
  `chrome://inspect` in Chrome → breakpoints, watch variables, call stack.
- **VS Code debugger**: launch config or the JavaScript Debug Terminal, breakpoints in the
  editor.
- A `debugger;` statement pauses execution there when a debugger is attached.
- In production: read stack traces and structured logs (winston/pino).
- Slow or memory problems: CPU profiles and heap snapshots via `--inspect`, or clinic.js.

```bash
node --inspect-brk app.js   # then open chrome://inspect
```

In short: use `--inspect` with Chrome DevTools or the VS Code debugger — breakpoints instead of
guessing with console.log.

---

77. Logging in Node.js: console vs winston / pino / morgan

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==>
```text
+---------+--------------------------------------------+----------------------------------+
| Tool    | What it is                                 | Use for                          |
+=========+============================================+==================================+
| console | Built-in, prints to stdout/stderr          | Quick local debugging            |
+---------+--------------------------------------------+----------------------------------+
| winston | Full-featured logger: levels, formats,     | App logs in production           |
|         | many transports (file, console, remote)    |                                  |
+---------+--------------------------------------------+----------------------------------+
| pino    | Very fast JSON logger, low overhead        | High-traffic production logs     |
+---------+--------------------------------------------+----------------------------------+
| morgan  | Express middleware for HTTP request logs   | One line per request             |
+---------+--------------------------------------------+----------------------------------+
```

Why not just `console` in production:
- No **log levels** to filter (info/warn/error), no JSON structure, no rotation.
- `console.log` can be **synchronous** (e.g. writing to files/terminals), so heavy logging can
  slow the event loop.
- Common setup: morgan (or pino-http) for request logs + winston/pino for app logs.

```js
const pino = require('pino');
const logger = pino({ level: 'info' });

logger.info({ userId: 42 }, 'user logged in');
// Output: {"level":30,"time":...,"userId":42,"msg":"user logged in"}
```

In short: console for development; winston or pino for structured production logs; morgan for
HTTP request logs.

---

78. How do async errors reach the Express error handler (Express 4 vs Express 5)?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> - The **error handler** is middleware with **4 arguments**: `(err, req, res, next)`.
- A sync `throw` inside a route is caught automatically in both versions.
- **Express 4**: an error inside an `async` handler (rejected promise) is NOT caught. You must
  `try/catch` and call `next(err)`, or use a wrapper like `express-async-handler`. Otherwise →
  unhandled rejection and the request hangs.
- **Express 5**: if an async handler rejects, Express calls `next(err)` for you.

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

// Express 5: just let it throw / reject
app.get('/user', async (req, res) => {
  const user = await User.findById(req.query.id);
  res.json(user);
});

// error handler (last, after all routes)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
```

In short: Express 4 needs `next(err)` for async errors; Express 5 forwards rejected promises
automatically.

---

79. What is util.promisify?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> - `util.promisify` turns a callback-style function (**error-first callback** `(err, result)`)
  into a function that **returns a Promise**.
- So you can use `async/await` instead of nested callbacks.
- Most core modules already have promise versions (`fs/promises`), so promisify is mainly for
  older libraries or your own callback functions.

```js
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

async function main() {
  const data = await readFile('a.txt', 'utf8');
  console.log(data);   // Output: contents of a.txt
}
main();
```

In short: promisify converts an error-first callback function into a promise-returning one.

---

80. What is the libuv thread pool? Which tasks use it, and what is its default size?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> - **libuv** is the C library behind Node's event loop and async I/O.
- Some work can't be done asynchronously by the OS, so libuv runs it on a small set of
  background threads: the **thread pool**.
- **Default size: 4 threads.** Change it with `UV_THREADPOOL_SIZE` (set before the pool is first
  used, max 1024).
- Uses the thread pool:
  - `fs` operations (`readFile`, `writeFile`, ...)
  - heavy `crypto` (`pbkdf2`, `scrypt`, async `randomBytes`)
  - `zlib` (compression)
  - `dns.lookup`
- Does NOT use it: **network I/O** (HTTP, TCP, DB sockets). The OS handles that asynchronously
  (epoll / kqueue / IOCP).

```js
const crypto = require('crypto');
const start = Date.now();
for (let i = 1; i <= 5; i++) {
  crypto.pbkdf2('pw', 'salt', 100000, 64, 'sha512', () =>
    console.log(i, Date.now() - start, 'ms'));
}
// Output (pool = 4): the first 4 finish together, the 5th takes about twice as long
```

```bash
UV_THREADPOOL_SIZE=8 node app.js
```

In short: 4 background threads by default for fs, crypto, zlib and dns.lookup; network I/O does
not use them.

---

81. What is backpressure in streams?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> - **Backpressure** = the reader produces data faster than the writer can consume it.
- If you ignore it, chunks pile up in memory and RAM usage shoots up.
- `writable.write(chunk)` returns **`false`** when its buffer is above **`highWaterMark`** →
  stop writing and wait for the **`'drain'`** event.
- `pipe()` and `pipeline()` handle this for you (pause the reader, resume on drain).

```js
readable.on('data', (chunk) => {
  const ok = writable.write(chunk);
  if (!ok) {
    readable.pause();                              // writer is full
    writable.once('drain', () => readable.resume()); // continue when it empties
  }
});
```

In short: backpressure = slowing the fast producer so the slow consumer isn't flooded;
pipe/pipeline do it for you.

---

82. pipe() vs pipeline() in streams

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==>
```text
+------------------+--------------------------------------+--------------------------------------+
|                  | pipe()                               | pipeline()                           |
+==================+======================================+======================================+
| Backpressure     | Handled                              | Handled                              |
+------------------+--------------------------------------+--------------------------------------+
| Error handling   | Errors are NOT forwarded; you need   | One callback / promise gets the      |
|                  | an `'error'` handler on every stream | error from any stream                |
+------------------+--------------------------------------+--------------------------------------+
| Cleanup on error | Streams not destroyed automatically  | Destroys all streams on error        |
|                  | (possible leaks / open files)        |                                      |
+------------------+--------------------------------------+--------------------------------------+
| Style            | Chain: `a.pipe(b).pipe(c)`           | `pipeline(a, b, c, cb)` or           |
|                  |                                      | `await pipeline(...)`                |
|                  |                                      | from `stream/promises`               |
+------------------+--------------------------------------+--------------------------------------+
```

```js
const { pipeline } = require('stream/promises');
const fs = require('fs');
const zlib = require('zlib');

async function gzipLog() {
  await pipeline(
    fs.createReadStream('big.log'),
    zlib.createGzip(),
    fs.createWriteStream('big.log.gz')
  );
  console.log('done');   // Output: done (or the error lands in catch)
}
```

In short: both handle backpressure, but pipeline() also handles errors and cleanup — prefer it.

---

83. Are EventEmitter listeners synchronous or asynchronous? (include output: `e.on('x', () =>
    console.log('1')); e.emit('x'); console.log('2');` → 1 2; also mention the two classic bugs:
    emitting 'error' with no listener crashes the process, and adding listeners per request leaks
    memory / MaxListenersExceededWarning)

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> **Synchronous.** `emit()` calls every listener right away, one by one, **in the order they were
added**, and only then returns.

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

- Want async work in a listener? Use `setImmediate()` / `process.nextTick()` inside it.

Two classic bugs:
1. **`'error'` with no listener**: `e.emit('error', err)` with no `'error'` handler → Node
   throws it and the **process crashes**. Always add `e.on('error', handler)`.
2. **Adding listeners per request**: each request adds one more, never removed → **memory
   leak**. With more than 10 listeners on one event Node prints
   **`MaxListenersExceededWarning`**. Fix: add listeners once, use `once()`, or remove them
   with `off()` / `removeListener()`.

In short: emit() is synchronous; always handle 'error', and never keep adding listeners per
request.

---

84. What is clustering in Node.js? Cluster vs worker threads

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> - Node runs your JS on one thread, so one process uses only **one CPU core**.
- **Cluster module**: the **primary** process forks several **worker processes** (usually one
  per core). They share the same port and incoming connections are spread across them. If a
  worker dies, the primary can fork a new one.
- Use `cluster.isPrimary` (`isMaster` is deprecated).

```js
const cluster = require('cluster');
const os = require('os');
const http = require('http');

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork());
  cluster.on('exit', () => cluster.fork());   // restart a dead worker
} else {
  http.createServer((req, res) => res.end(`pid ${process.pid}`)).listen(3000);
}
// Output: each request may answer with a different pid
```

```text
+---------------+-------------------------------------+--------------------------------------+
|               | Cluster                             | Worker threads                       |
+===============+=====================================+======================================+
| Runs as       | Separate processes                  | Threads inside one process           |
+---------------+-------------------------------------+--------------------------------------+
| Memory        | Each has its own memory             | Own JS heap, but can share memory    |
|               |                                     | (`SharedArrayBuffer`)                |
+---------------+-------------------------------------+--------------------------------------+
| Communication | IPC messages                        | `postMessage`, shared memory         |
+---------------+-------------------------------------+--------------------------------------+
| Best for      | Scaling an HTTP server over all     | CPU-heavy tasks (image processing,   |
|               | CPU cores                           | hashing) without blocking the event  |
|               |                                     | loop                                 |
+---------------+-------------------------------------+--------------------------------------+
```

In short: cluster = more processes to serve more requests; worker threads = offload CPU-heavy
work inside one process.

---

85. exec vs spawn in child_process

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==>
```text
+-------------+--------------------------------------+--------------------------------------+
|             | exec                                 | spawn                                |
+=============+======================================+======================================+
| Output      | **Buffers** the whole output, gives  | **Streams** output (`stdout` /       |
|             | it in a callback                     | `stderr` streams)                    |
+-------------+--------------------------------------+--------------------------------------+
| Shell       | Runs inside a shell (pipes, `&&`     | No shell by default (safer)          |
|             | work)                                |                                      |
+-------------+--------------------------------------+--------------------------------------+
| Output size | Limited by `maxBuffer` (1 MB by      | No limit; good for big or long       |
|             | default)                             | output                               |
+-------------+--------------------------------------+--------------------------------------+
| Use for     | Small, quick commands                | Long-running processes, big output   |
+-------------+--------------------------------------+--------------------------------------+
```

- Careful: `exec` with user input → **command injection** risk (it runs in a shell).
- Related: `execFile` (no shell, buffered) and `fork` (new Node process with an IPC channel).

```js
const { exec, spawn } = require('child_process');

exec('ls -l', (err, stdout) => console.log(stdout));   // all output at once

const ls = spawn('ls', ['-l']);
ls.stdout.on('data', (chunk) => console.log(chunk.toString())); // chunk by chunk
```

In short: exec buffers the output (small commands); spawn streams it (big or long-running
processes).

---

86. What is PM2?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> **PM2** is a **production process manager** for Node.js apps.
- **Auto-restart**: brings the app back if it crashes.
- **Cluster mode**: one instance per CPU core with load balancing (`-i max`), no code changes.
- **Zero-downtime reload**: `pm2 reload`.
- Logs and monitoring: `pm2 logs`, `pm2 monit`.
- Survives server reboot: `pm2 startup` + `pm2 save`.
- Config lives in `ecosystem.config.js`.

```bash
pm2 start app.js -i max --name api
pm2 logs api
pm2 reload api
```

In short: PM2 keeps Node apps running in production — restarts, clustering, logs and
zero-downtime reloads.

---

87. What is the process object? (process.argv, process.cwd(), process.memoryUsage(), process.exit
    codes)

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> `process` is a **global object** (no `require` needed) that describes and controls the running
Node process.
- `process.argv`: command-line args. `[0]` = node path, `[1]` = script path, rest = your args.
- `process.cwd()`: folder where `node` was started (current working directory).
- `process.memoryUsage()`: memory in bytes (`rss`, `heapTotal`, `heapUsed`, `external`).
- `process.exit(code)`: ends the process. **`0` = success**, **non-zero (usually `1`) = failure**.
- Also: `process.env`, `process.pid`, `process.platform`, `process.nextTick()`, and events like
  `'exit'`, `'uncaughtException'`, `'SIGTERM'`.

```js
// run: node app.js hello
console.log(process.argv[2]);                  // hello
console.log(process.cwd());                    // e.g. /home/me/project
console.log(process.memoryUsage().heapUsed);   // e.g. 4123456 (bytes)
process.exit(1);                               // exit with error code 1
```

In short: process is the global handle to the running Node process — args, env, memory, cwd,
exit and signals.

---

88. What is process.env, and how do you load a .env file (dotenv / node --env-file)?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> - `process.env` = object with the process's **environment variables** (PORT, DB_URL, secrets).
- Values are always **strings**: `process.env.PORT` is `"3000"`, so convert with `Number()`.
- A `.env` file holds these values for local development. Never commit it (add to
  `.gitignore`).
- Two ways to load it:
  1. **dotenv** package: `require('dotenv').config()` at the very top of the entry file.
  2. **Node 20.6+**: built-in flag `node --env-file=.env app.js` (no package needed).

```js
// .env
// PORT=3000
// DB_URL=mongodb://localhost/test

require('dotenv').config();
console.log(typeof process.env.PORT);           // Output: string
const port = Number(process.env.PORT) || 3000;  // 3000 as a number
```

In short: process.env holds config as strings; load .env with dotenv or `node --env-file=.env`.

---

89. What is graceful shutdown, and how do you implement it?

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==> **Graceful shutdown** = when the app is told to stop (deploy, scale down, Ctrl+C), it finishes
current requests and closes connections cleanly instead of dying mid-request.

Steps:
1. Listen for **`SIGTERM`** (sent by Docker / Kubernetes / PM2) and **`SIGINT`** (Ctrl+C).
2. Stop taking new connections: `server.close()`.
3. Let in-flight requests finish.
4. Close resources: DB, Redis, message queues.
5. `process.exit(0)` — plus a timeout that force-exits if cleanup hangs.

```js
const server = app.listen(3000);

function shutdown() {
  console.log('Shutting down...');
  server.close(async () => {          // runs after open requests finish
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

==> 1. **Sync**: `fs.readFileSync()` — blocks until the file is read.

2. **Callback**: `fs.readFile(path, cb)` — error-first callback.
3. **Promises**: `fs.promises.readFile()` / `require('fs/promises')` — use with `async/await`.

```js
const fs = require('fs');
const fsp = require('fs/promises');

const a = fs.readFileSync('a.txt', 'utf8');            // 1. sync (blocking)

fs.readFile('a.txt', 'utf8', (err, data) => {          // 2. callback
  if (err) return console.error(err);
  console.log(data);
});

async function read() {
  const b = await fsp.readFile('a.txt', 'utf8');       // 3. promises
  console.log(b);
}
```

Why not `readFileSync` in a server:
- It **blocks the event loop** (the single JS thread). While it reads, no other request is
  handled — every user waits.
- Fine at startup (load config once) or in CLI scripts.
- For very large files use **streams** (`fs.createReadStream`) instead of loading it all into
  memory.

In short: use the promise/callback versions in servers; sync blocks the event loop for every
user.

---

91. path.join vs path.resolve; why use __dirname instead of './'? (__dirname / __filename)

    *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
    revision PDF)*

==>
```text
+----------------+--------------------------------------+--------------------------------------+
|                | path.join                            | path.resolve                         |
+================+======================================+======================================+
| What it does   | Joins segments with the right        | Builds an **absolute** path          |
|                | separator and normalizes `..`        |                                      |
+----------------+--------------------------------------+--------------------------------------+
| Result         | Can be relative                      | Always absolute                      |
+----------------+--------------------------------------+--------------------------------------+
| Starting point | Only the given segments              | Goes right to left until it gets an  |
|                |                                      | absolute path; if none, starts from  |
|                |                                      | `process.cwd()`                      |
+----------------+--------------------------------------+--------------------------------------+
```

```js
const path = require('path');

path.join('a', 'b', '../c');     // 'a/c'
path.resolve('a', 'b');          // '/current/working/dir/a/b'
path.resolve('/x', 'y');         // '/x/y'
path.resolve('/x', '/y', 'z');   // '/y/z'  (restarts at the last absolute segment)

// __dirname  = folder of the current file
// __filename = full path of the current file
const file = path.join(__dirname, 'data', 'users.json');
```

Why `__dirname` instead of `'./'`:
- `'./'` in `fs` calls is relative to **`process.cwd()`** (where `node` was started), not to the
  file. Run `node src/app.js` from another folder and `'./data.json'` points to the wrong place.
- `__dirname` is always the current file's folder, so the path works from anywhere.
- `__dirname` / `__filename` exist only in **CommonJS**. In ES modules use
  `import.meta.dirname` / `import.meta.filename` (Node 20.11+) or `fileURLToPath(import.meta.url)`.

In short: join just combines paths, resolve gives an absolute path; use __dirname so file paths
don't depend on where node was started.

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
