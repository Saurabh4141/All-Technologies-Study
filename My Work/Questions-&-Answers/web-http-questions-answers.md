# Web & HTTP – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is HTTP?

   *(Asked 1×: Technovert)*

==> **HTTP** (HyperText Transfer Protocol) is how a browser (client) and a server talk on the web.
- Client sends a **request**: method (`GET`, `POST`...), URL, **headers**, optional **body**.
- Server sends a **response**: **status code** (`200`, `404`...), headers, body.
- It is **stateless**: each request stands alone. To remember the user we add **cookies**,
  **sessions** or **tokens** (JWT).

```http
GET /api/users/1 HTTP/1.1
Host: example.com
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json

{"id":1,"name":"Saurabh"}
```

In short: HTTP = the stateless request/response language of the web.

---

2. Difference between HTTP and HTTPS

   *(Asked 1×: Interview, no company)*

==> **HTTPS = HTTP inside an encrypted TLS connection.**

```text
+--------------+-------------------------------------+-------------------------------------+
|              | HTTP                                | HTTPS                               |
+==============+=====================================+=====================================+
| Data         | Plain text - anyone in the middle   | Encrypted with TLS                  |
|              | can read or change it               |                                     |
+--------------+-------------------------------------+-------------------------------------+
| Default port | 80                                  | 443                                 |
+--------------+-------------------------------------+-------------------------------------+
| Certificate  | Not needed                          | TLS certificate proves the server's |
|              |                                     | identity                            |
+--------------+-------------------------------------+-------------------------------------+
| Use          | Local testing only                  | Everything in production (logins,   |
|              |                                     | payments, SEO, HTTP/2 in browsers)  |
+--------------+-------------------------------------+-------------------------------------+
```

HTTPS gives 3 things: **encryption** (no one can read it), **integrity** (no one can change it),
**authentication** (you are really talking to that server).

In short: HTTPS = HTTP + encryption + server identity check.

---

3. What happens when you type google.com and press Enter? (cache, critical rendering path,
   render-blocking JS)

   *(Asked 1×: EZ Works)*

==> Step by step:
1. **Cache check** – browser checks its cache (and **HSTS** list, so it goes straight to HTTPS).
2. **DNS lookup** – finds google.com's IP (browser cache → OS cache → DNS resolver).
3. **TCP + TLS handshake** – connects on port 443 and sets up encryption.
4. **HTTP request** – browser sends `GET /`; server replies with HTML (maybe a `301` redirect
   first).
5. **Critical rendering path** (code → pixels):
   - HTML → **DOM**
   - CSS → **CSSOM**
   - DOM + CSSOM → **render tree**
   - **Layout** (sizes/positions) → **Paint** → **Composite** on screen.
6. **Render-blocking resources** – a normal `<script>` pauses HTML parsing until it downloads
   and runs; CSS blocks rendering until the CSSOM is ready. Fix: `defer`/`async`, small critical
   CSS.
7. Images, fonts and other JS load; the page becomes interactive.

Interview tip: say "DNS → TCP/TLS → request → response → DOM/CSSOM → render tree → layout →
paint".

In short: find the server, connect securely, get HTML, then turn HTML + CSS into pixels.

---

4. Normal script vs async vs defer: how do scripts affect rendering?

   *(Asked 1×: EZ Works)*

==> The browser builds the page while reading HTML. A script can pause that.

```text
+----------------+-------------------+-----------------------------+---------------+--------+
| Tag            | Download          | Runs when                   | Blocks parse? | Order  |
+================+===================+=============================+===============+========+
| <script>       | Stops parsing     | Right after download        | Yes           | Kept   |
+----------------+-------------------+-----------------------------+---------------+--------+
| <script async> | In parallel       | As soon as downloaded       | While running | Not    |
|                |                   |                             |               | kept   |
+----------------+-------------------+-----------------------------+---------------+--------+
| <script defer> | In parallel       | After HTML is parsed,       | No            | Kept   |
|                |                   | before DOMContentLoaded     |               |        |
+----------------+-------------------+-----------------------------+---------------+--------+
```

```html
<script src="app.js" defer></script>        <!-- needs the DOM, keeps order -->
<script src="analytics.js" async></script>  <!-- independent, order doesn't matter -->
```

- `defer` → your app scripts that touch the DOM.
- `async` → independent scripts like analytics or ads.
- `type="module"` scripts are deferred by default.

In short: plain script blocks, async runs ASAP, defer runs after parsing in order.

---

5. Why do we use Nginx as a proxy server?

   *(Asked 1×: One97 Paytm)*

==> Nginx sits **in front of your app** as a **reverse proxy**: it takes client requests and
forwards them to the backend (Node, PHP-FPM, Python...).
- **Load balancing** – spreads traffic across many app instances.
- **SSL/TLS termination** – Nginx handles HTTPS, the app speaks plain HTTP inside.
- **Static files** – serves images/JS/CSS very fast, without touching the app.
- **Caching + gzip** compression.
- **Security** – hides the app server, rate limiting, request size limits.
- **Event-driven**, so it holds thousands of connections with little memory.

```nginx
upstream app {
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;          # load-balanced across two app processes
}

server {
  listen 80;
  location / {
    proxy_pass http://app;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

In short: Nginx is the fast front door – HTTPS, static files, load balancing – and the app just
handles business logic.

---

6. Nginx server vs Apache server

   *(Asked 1×: Interview, no company)*

==>
```text
+------------------+--------------------------------------+-----------------------------------+
|                  | Nginx                                | Apache                            |
+==================+======================================+===================================+
| Architecture     | Event-driven, async: few workers     | Process/thread per connection     |
|                  | handle many connections              | (prefork/worker; event MPM newer) |
+------------------+--------------------------------------+-----------------------------------+
| Static files     | Very fast                            | Slower                            |
+------------------+--------------------------------------+-----------------------------------+
| Memory at high   | Low, scales well                     | Grows with connections            |
| traffic          |                                      |                                   |
+------------------+--------------------------------------+-----------------------------------+
| Config           | Central config only                  | Per-folder .htaccess files        |
+------------------+--------------------------------------+-----------------------------------+
| PHP              | Passes to PHP-FPM                    | Can run PHP inside (mod_php)      |
+------------------+--------------------------------------+-----------------------------------+
| Common use       | Reverse proxy, load balancer         | Shared hosting, classic PHP apps  |
+------------------+--------------------------------------+-----------------------------------+
```

In short: Nginx wins for high traffic and proxying; Apache is flexible with `.htaccess`. Often
Nginx sits in front of Apache or Node.

---

7. Difference between span and div

   *(Asked 1×: Interview, no company)*

==>
```text
+--------+----------------------------------------+--------------------------------------------+
|        | <div>                                  | <span>                                     |
+========+========================================+============================================+
| Type   | Block element                          | Inline element                             |
+--------+----------------------------------------+--------------------------------------------+
| Layout | Starts on a new line, takes full width | Stays in the line, takes only the width it |
|        |                                        | needs                                      |
+--------+----------------------------------------+--------------------------------------------+
| Use    | Group big sections / layout            | Style a small piece of text                |
+--------+----------------------------------------+--------------------------------------------+
```

```html
<div>Box on its own line</div>
<p>Hello <span style="color:red">red word</span> here</p>
```

Output: the div sits on its own full-width line; "red word" turns red but stays inside the
sentence.

Both have no meaning of their own – prefer semantic tags (`<section>`, `<nav>`, `<strong>`) when
they fit.

In short: div = block box, span = inline piece of text.

---

8. What is a pseudo-class in CSS?

   *(Asked 1×: Interview, no company)*

==> A **pseudo-class** styles an element in a **special state** – no extra class in HTML needed.
Starts with **one colon** `:`.
- `:hover` – mouse is over it
- `:focus` – input is selected
- `:first-child`, `:nth-child(2)` – position inside the parent
- `:checked`, `:disabled` – form states

```css
button:hover { background: blue; }
li:nth-child(odd) { background: #eee; }   /* rows 1, 3, 5... get grey */
```

Don't mix up: **pseudo-elements** use **two colons** (`::before`, `::after`) and style a *part*
of an element, not a state.

In short: `:state` = pseudo-class, `::part` = pseudo-element.

---

9. What are 401, 402, 403 and 502? Common status codes you use

   *(Asked 1×: UST)*

==>
- **401 Unauthorized** – not logged in: token missing, expired or invalid (authentication
  failed).
- **402 Payment Required** – reserved; rarely used (some APIs return it when a plan/payment is
  needed).
- **403 Forbidden** – logged in, but **no permission** for this resource.
- **502 Bad Gateway** – a proxy (like Nginx) got a bad or no response from the app behind it
  (e.g. the app crashed).

Common codes:

```text
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
| 304 Not Modified          | Use your cached copy                |
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
| 504 Gateway Timeout       | Proxy waited too long for the app   |
+---------------------------+-------------------------------------+
```

Easy grouping: **2xx** success, **3xx** redirect, **4xx** client's mistake, **5xx** server's
mistake.

Interview tip: 401 = "who are you?", 403 = "I know you, but no".

---

10. Performance tools (React Profiler, Lighthouse, GTmetrix) and metrics FCP, LCP, CLS

    *(Asked 1×: EZ Works)*

==> Tools:
- **React Profiler** (React DevTools) – which components re-render, and how long each render
  takes.
- **Lighthouse** (Chrome DevTools) – scores for performance, SEO, accessibility, with fix
  suggestions.
- **GTmetrix** – online page-speed test with a **waterfall** of every request and history.

Metrics:

```text
+--------------------------------+--------------------------------------------+------------+
| Metric                         | Meaning                                    | Good value |
+================================+============================================+============+
| FCP - First Contentful Paint   | Time until the first text/image appears    | < 1.8 s    |
+--------------------------------+--------------------------------------------+------------+
| LCP - Largest Contentful Paint | Time until the biggest element (hero       | < 2.5 s    |
|                                | image / heading) appears                   |            |
+--------------------------------+--------------------------------------------+------------+
| CLS - Cumulative Layout Shift  | How much the page jumps while loading      | < 0.1      |
+--------------------------------+--------------------------------------------+------------+
| INP - Interaction to Next      | How fast the page reacts to clicks/typing  | < 200 ms   |
| Paint                          |                                            |            |
+--------------------------------+--------------------------------------------+------------+
```

The **Core Web Vitals** are **LCP, CLS and INP** (INP replaced FID in 2024). FCP is a helpful
extra metric.

Fixes:
- LCP → compress / preload the hero image, CDN, caching.
- CLS → set image `width`/`height`, reserve space for ads/fonts.
- INP / FCP → code splitting, `defer` scripts, less JS on the main thread.

In short: Profiler finds slow React renders; Lighthouse/GTmetrix measure the page; aim for LCP <
2.5 s, CLS < 0.1, INP < 200 ms.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

11. What is a CDN, and what are its benefits?

    *(Not asked in a real interview yet · From: Ajeet Yadav Node.js revision PDF)*

==> A **CDN** (Content Delivery Network) is a set of **edge servers** around the world that keep
**cached copies** of your files. Users get them from the **nearest edge** instead of your
**origin** server.
- Used for static files: images, CSS, JS, videos, fonts (sometimes cacheable API responses).
- Examples: **Cloudflare**, **AWS CloudFront**, **Akamai**.

Benefits:
- **Faster** – lower latency, content is close to the user.
- **Less load** and bandwidth on your origin.
- **Availability** – if one edge goes down, others serve.
- **Security** – DDoS protection, TLS at the edge, WAF.

Caching is controlled with headers; use **versioned file names** so a new deploy is picked up:

```http
Cache-Control: public, max-age=31536000, immutable    (for app.3f2a.js)
```

In short: a CDN serves cached files from a server near the user – faster, cheaper, more reliable.

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
