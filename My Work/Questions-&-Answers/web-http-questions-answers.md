# Web & HTTP – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is HTTP?
   *(Asked 1×: Technovert)*

==> HTTP (HyperText Transfer Protocol) is the set of rules a browser (client) and a server use to
    talk on the web.
    - The client sends a **request** (method like GET/POST, URL, headers, optional body).
    - The server sends back a **response** (status code like 200/404, headers, body).
    - It is **stateless**: each request is independent. We use cookies, sessions or tokens to
      remember the user.

    In short: HTTP = request/response language of the web.

---

2. Difference between HTTP and HTTPS
   *(Asked 1×: Interview, no company)*

==> HTTPS is HTTP sent inside an encrypted TLS connection.

    +--------------+--------------------------------------------+--------------------------------------------+
    |              | HTTP                                       | HTTPS                                      |
    +==============+============================================+============================================+
    | Security     | Plain text, anyone in the middle can       | Encrypted with TLS                         |
    |              | read/change it                             |                                            |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Default port | 80                                         | 443                                        |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Certificate  | Not needed                                 | Needs an SSL/TLS certificate (proves the   |
    |              |                                            | server's identity)                         |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Use          | Old / local testing                        | Everything in production (logins,          |
    |              |                                            | payments, SEO boost)                       |
    +--------------+--------------------------------------------+--------------------------------------------+

    In short: HTTPS = HTTP + encryption + server identity check.

---

3. What happens when you type google.com and press Enter? (cache, critical rendering path,
   render-blocking JS)
   *(Asked 1×: EZ Works)*

==> Step by step:
    1. **Cache check** – browser checks its own cache (and HSTS list) for the page and DNS record.
    2. **DNS lookup** – finds the IP address of google.com (browser cache → OS cache → DNS
       resolver).
    3. **TCP + TLS handshake** – connects to the server on port 443 and sets up encryption.
    4. **HTTP request** – browser sends `GET /`; server replies with HTML (may be a redirect,
       301/302).
    5. **Critical rendering path** (turning code into pixels):
        - Parse HTML → **DOM**
        - Parse CSS → **CSSOM**
        - DOM + CSSOM → **Render tree**
        - **Layout** (sizes/positions) → **Paint** → **Composite** on screen.
    6. **Render-blocking JS** – a normal `<script>` stops HTML parsing until it is downloaded and
       run. CSS also blocks rendering. Fix with `defer`/`async`, and keep critical CSS small.
    7. Extra resources (images, fonts, JS) load; the page becomes interactive.

    Interview tip: say "DNS → TCP/TLS → request → response → DOM/CSSOM → render tree → layout →
    paint".

---

4. Normal script vs async vs defer: how do scripts affect rendering?
   *(Asked 1×: EZ Works)*

==> The browser builds the page while reading HTML. Scripts can pause that.

    +------------------+---------------------------+--------------------------------------------+----------------------+-------------+
    |                  | Download                  | Runs when                                  | Blocks HTML parsing? | Order kept? |
    +==================+===========================+============================================+======================+=============+
    | `<script>`       | Stops parsing to download | Immediately after download                 | Yes                  | Yes         |
    +------------------+---------------------------+--------------------------------------------+----------------------+-------------+
    | `<script async>` | In parallel               | As soon as downloaded                      | Only while running   | No          |
    +------------------+---------------------------+--------------------------------------------+----------------------+-------------+
    | `<script defer>` | In parallel               | After HTML is fully parsed (before         | No                   | Yes         |
    |                  |                           | DOMContentLoaded)                          |                      |             |
    +------------------+---------------------------+--------------------------------------------+----------------------+-------------+

    - Use `defer` for your app scripts that need the DOM.
    - Use `async` for independent scripts like analytics.

---

5. Why do we use Nginx as a proxy server?
   *(Asked 1×: One97 Paytm)*

==> A **reverse proxy** is a server that sits in front of one or more backend app servers: it
    receives client requests and forwards them to the right backend. Nginx is a popular choice for
    this with any backend (Node.js, PHP-FPM, Python, Java ...).
    - **Load balancing** – spreads traffic across many app instances/servers.
    - **SSL/HTTPS termination** – handles certificates so the app does not have to.
    - **Serves static files** (images, JS, CSS) very fast.
    - **Caching and gzip compression**.
    - **Security** – hides the app server, rate limiting, request size limits.
    - Handles thousands of connections with little memory.

    Node.js example: the Node app listens on port 3000 and Nginx forwards public traffic to it
    (and can balance across several Node processes).

    ```nginx
    server {
      listen 80;
      location / {
        proxy_pass http://localhost:3000;
      }
    }
    ```

---

6. Nginx server vs Apache server
   *(Asked 1×: Interview, no company)*

==>
    +-----------------------+--------------------------------------------+-----------------------------------------+
    |                       | Nginx                                      | Apache                                  |
    +=======================+============================================+=========================================+
    | Architecture          | Event-driven, async (few workers handle    | Process/thread per connection (classic) |
    |                       | many connections)                          |                                         |
    +-----------------------+--------------------------------------------+-----------------------------------------+
    | Static files          | Very fast                                  | Slower                                  |
    +-----------------------+--------------------------------------------+-----------------------------------------+
    | Many connections      | Low memory, scales well                    | Uses more memory                        |
    +-----------------------+--------------------------------------------+-----------------------------------------+
    | Config                | Central config only                        | Supports per-folder `.htaccess` files   |
    +-----------------------+--------------------------------------------+-----------------------------------------+
    | Dynamic content (PHP) | Passes to PHP-FPM                          | Can run PHP inside (mod_php)            |
    +-----------------------+--------------------------------------------+-----------------------------------------+
    | Common use            | Reverse proxy, load balancer               | Shared hosting, PHP apps                |
    +-----------------------+--------------------------------------------+-----------------------------------------+

    In short: Nginx is better for high traffic and proxying; Apache is flexible with `.htaccess`.
    Often Nginx is put in front of Apache or Node.

---

7. Difference between span and div
   *(Asked 1×: Interview, no company)*

==>
    +--------+----------------------------------------+--------------------------------------------+
    |        | `<div>`                                | `<span>`                                   |
    +========+========================================+============================================+
    | Type   | Block element                          | Inline element                             |
    +--------+----------------------------------------+--------------------------------------------+
    | Layout | Starts on a new line, takes full width | Stays in the same line, takes only needed  |
    |        |                                        | width                                      |
    +--------+----------------------------------------+--------------------------------------------+
    | Use    | Group big sections/layout              | Style a small part of text                 |
    +--------+----------------------------------------+--------------------------------------------+

    ```html
    <div>Box on its own line</div>
    <p>Hello <span style="color:red">red word</span> here</p>
    ```

---

8. What is a pseudo-class in CSS?
   *(Asked 1×: Interview, no company)*

==> A pseudo-class styles an element in a **special state**, without adding a class in HTML. It
    starts with one colon `:`.
    - `:hover` – mouse is over it
    - `:focus` – input is selected
    - `:first-child`, `:nth-child(2)` – position in parent
    - `:checked`, `:disabled` – form states

    ```css
    button:hover { background: blue; }
    li:nth-child(odd) { background: #eee; }
    ```

    Note: pseudo-**elements** use two colons (`::before`, `::after`) and style a part of an element.

---

9. What are 401, 402, 403 and 502? Common status codes you use
   *(Asked 1×: UST)*

==>
    - **401 Unauthorized** – you are not logged in / token missing or invalid (authentication
      failed).
    - **402 Payment Required** – reserved for payment; rarely used (some APIs use it when a
      plan/payment is needed).
    - **403 Forbidden** – you are logged in, but you do not have permission.
    - **502 Bad Gateway** – a proxy/gateway (like Nginx) got a bad or no response from the upstream
      server (e.g. the Node app crashed).

    Common codes:

    +---------------------------+-------------------------------------+
    | Code                      | Meaning                             |
    +===========================+=====================================+
    | 200 OK                    | Success                             |
    +---------------------------+-------------------------------------+
    | 201 Created               | New resource created (POST)         |
    +---------------------------+-------------------------------------+
    | 204 No Content            | Success, nothing to return (DELETE) |
    +---------------------------+-------------------------------------+
    | 301 / 302                 | Permanent / temporary redirect      |
    +---------------------------+-------------------------------------+
    | 304 Not Modified          | Use cached copy                     |
    +---------------------------+-------------------------------------+
    | 400 Bad Request           | Invalid input                       |
    +---------------------------+-------------------------------------+
    | 404 Not Found             | Resource does not exist             |
    +---------------------------+-------------------------------------+
    | 409 Conflict              | Duplicate / conflicting data        |
    +---------------------------+-------------------------------------+
    | 422 Unprocessable Entity  | Validation error                    |
    +---------------------------+-------------------------------------+
    | 429 Too Many Requests     | Rate limit hit                      |
    +---------------------------+-------------------------------------+
    | 500 Internal Server Error | Bug on the server                   |
    +---------------------------+-------------------------------------+
    | 503 Service Unavailable   | Server down / overloaded            |
    +---------------------------+-------------------------------------+
    | 504 Gateway Timeout       | Upstream took too long              |
    +---------------------------+-------------------------------------+

    Interview tip: 401 = "who are you?", 403 = "I know you, but no".

---

10. Performance tools (React Profiler, Lighthouse, GTmetrix) and metrics FCP, LCP, CLS
    *(Asked 1×: EZ Works)*

==> Tools:
    - **React Profiler** (React DevTools) – shows which components re-render and how long they take.
    - **Lighthouse** (Chrome DevTools) – gives scores for performance, SEO, accessibility with fix
      suggestions.
    - **GTmetrix** – online test of page speed, waterfall of all requests, history.

    Metrics (Core Web Vitals and friends):

    +--------------------------------+--------------------------------------------+------------+
    | Metric                         | Meaning                                    | Good value |
    +================================+============================================+============+
    | FCP – First Contentful Paint   | Time until the first text/image appears    | < 1.8 s    |
    +--------------------------------+--------------------------------------------+------------+
    | LCP – Largest Contentful Paint | Time until the biggest element (hero       | < 2.5 s    |
    |                                | image/heading) appears                     |            |
    +--------------------------------+--------------------------------------------+------------+
    | CLS – Cumulative Layout Shift  | How much the page jumps around while       | < 0.1      |
    |                                | loading                                    |            |
    +--------------------------------+--------------------------------------------+------------+

    Fixes: compress/lazy-load images, set image width/height (helps CLS), code splitting, CDN,
    caching, `defer` scripts.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

11. What is a CDN, and what are its benefits?
   *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A CDN (Content Delivery Network) is a network of servers spread around the world (edge servers)
    that keep cached copies of your content. A user gets the content from the nearest edge server
    instead of your main (origin) server.
    - Typically used for static files: images, CSS, JS, videos, fonts. Can also cache some API
      responses.
    - Examples: Cloudflare, AWS CloudFront, Akamai.
    Benefits:
    - Faster load times (lower latency, content is closer to the user).
    - Less load and bandwidth on your origin server.
    - Better availability: if one edge goes down, others serve.
    - Security: DDoS protection, HTTPS/TLS at the edge, WAF.
    - Caching is controlled with headers like `Cache-Control`; use versioned file names
      (`app.3f2a.js`) so new deploys are picked up.

    In short: A CDN serves cached content from servers near the user - faster, cheaper and more
    reliable.

======================================================================================================================================

## What to study first

```
HTTP basics            (requests, responses, HTTP vs HTTPS)
   ↓
HTTP status codes      (what the server answers)
   ↓
HTML & CSS             (span/div, pseudo-classes)
   ↓
Browser & page loading (google.com flow, async/defer)
   ↓
Web performance        (Lighthouse, FCP, LCP, CLS)
   ↓
Web servers            (Nginx as proxy, Nginx vs Apache)
```

HTTP basics and status codes are the foundation; every other topic uses them.
Browser & page loading explains how HTML/CSS/JS become a page, and Web performance builds on that to
measure and speed it up.
Web servers (Nginx/Apache) come last: they sit in front of your app in production.
