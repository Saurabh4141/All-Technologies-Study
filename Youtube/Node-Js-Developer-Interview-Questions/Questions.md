# 1] Senior Node.js Interview Questions (5+ Years Experience) – Real Backend Round

Source: https://www.youtube.com/watch?v=j8wc5qXfJmE

Questions are written as the interviewer asked them (lightly cleaned up for readability), in order.

---

## Introduction

1. Tell me about your total experience and the technology skill sets you are currently working on.

## API Security / JWT

2. In Node.js, in order to protect your APIs from unauthorized access, what are you using currently?
3. In JWT, when we create the token — how do we decrypt the token back to check whether the token is correct or not?
   > **Correction:** JWTs are **signed, not encrypted**. Anyone can decode a JWT, because the payload is only Base64URL-encoded. `jwt.verify` checks the **signature** with the secret or public key.
4. For verifying the user token, what is the method in JWT (`jsonwebtoken`) to verify or decrypt it?
5. JWT has one more method, `jwt.decode`. Do you know the difference between `jwt.decode` and `jwt.verify`?
6. Scenario: A user logs in with email ID and password and you generate a JWT token. In subsequent APIs the caller sends that token in the header of each request. Somebody copies that JWT token, and inside the token the user ID was `123`. The attacker updates it to `456` and sends that token. How will JWT secure this?
7. What is the structure of a JWT token? What are all the things inside a JWT token?

## Node.js Core

8. In Node.js, do you know what a **circuit breaker** is?
9. In Node.js, what are the **phases of the event loop**?

## Performance / Optimization

10. Scenario: You developed a Node.js API, and we found that the API has latency — it is taking 10 seconds to respond. We want the result within 2–3 seconds. What steps will you take to figure out how to optimize it?
11. Follow-up: Inside the API you are making a DB query, and the query uses three columns. Will you just go to the DB and attach indexes to those three columns, or what will be your first step?
12. Follow-up: Let's say `id` is your primary key, but the query is not on the `id` column — I'm searching data on the basis of `name` or `age`. Will the primary index help here?
13. What is the **query execution plan** in databases?

## JavaScript

14. What is the difference between `Promise.all` and `Promise.allSettled`?

## Node.js Modules & Globals

15. In Node.js, what is a **circular dependency**?
16. In Node.js, what are the **globals**?

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 2] Deloitte – First Round, Node.js + React (5 Years Experience) – YouTube Short

Source: https://www.youtube.com/shorts/NJD0smSDex8

Questions as the person says Deloitte asked them. Only the Node.js question is kept here.

1. What is the difference between **Node** and **Node.js**?
   > **Note:** They are the same thing. "Node" is just the short name for Node.js. A one-line answer is enough.

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 3] Node.js: process.nextTick() vs setImmediate() – YouTube Short

Source: https://www.youtube.com/shorts/6lThWNiCEls

Said to be commonly asked at TCS, Infosys and Accenture (for both freshers and experienced).

1. What is the difference between **`process.nextTick()`** and **`setImmediate()`**? Which one executes first?
2. Follow-up: **Why** does `process.nextTick()` run before `setImmediate()`?

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 4] 5 Years Node.js Interview | Express, NestJS, React, Kafka, Docker, Auth, Microservices (EarlyCoder)

Source: https://www.youtube.com/watch?v=nsJcaDppVRU

Questions as the interviewer asked them (lightly cleaned up), in order. The video ends when the coding round starts.

## Introduction / Experience

1. What is your experience in Node.js?

## JavaScript – Async

2. What is the difference between a **Promise** and a **callback function**?
3. Follow-up: Nesting multiple callbacks makes code hard to maintain. What do we call that problem?
4. What is **callback hell**?
5. Does `async` work **synchronously or asynchronously**? *(Follow-up: "Are you sure it works synchronously?")*

## Redis / Real-time

6. Have you worked on Redis? **Why do we use Redis?**
7. Have you worked on **Socket.io**?
8. What is the difference between an **HTTP connection** and a **socket connection**?

## Architecture

9. What are **microservices** and why do we prefer them? *(Short answer)*
10. What is a **middleware**?
11. Have you worked on **Docker**? Explain.

## Security & Code Quality

12. If you have to create an application from scratch, how will you make it **secure**? *(Small points, not a long explanation)*
13. If you have to create only the **back end**, what will be your approach to make it a **secure back end**?
14. Other than JWT, which other module would you use? *(Passport. Follow-up: Passport for what?)*
15. What do you understand by **code reusability**?
16. What do you understand by **MVC architecture**?

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 5] Node.js Developer Interview with Tech Mahindra – Technical Round

Source: https://www.youtube.com/watch?v=8Kpj3ADMU3k

Questions as the interviewers asked them (lightly cleaned up), in order. The client project is CVS / Caremark member-facing websites.

## Node.js Round

1. Do you have any experience with Node.js?
2. So you created microservices? Which **framework** have you used for Node.js in your previous projects?
3. You said Express.js. **How do you create a server in Express.js?**
4. What is the difference between **`setImmediate`** and **`setTimeout`**?
5. *(Code snippet pasted in chat)* What would be the **output** of this snippet? *(`console.log('first')`, a `setTimeout` that logs `'second'`, then `console.log('third')`)*
6. Do you know what a **callback** is?
7. Why do you think Node.js is **able to handle many requests**?
8. Follow-up: So you're saying Node.js is **multi-threaded**, right?
9. Which **npm modules** have you used in your Node.js microservices? Tell me your commonly used npm modules.
10. How do you get an **error object in a callback**?
11. How do you handle **unexpected exceptions**?
12. Have you used any **unit testing frameworks** in Node.js?
13. How do you **deploy** your applications / microservices?
14. Were you involved in deployment yourself, or did you request a deployment team to deploy?
15. Do you configure **CI/CD pipelines**?
16. What is the difference between **`module.exports`** and **`exports`**?
17. How do you implement **asynchronous programming** in Node.js?

## General (from the second interviewer)

18. When you're writing code, how do you ensure your **code quality** (no bugs)?
19. How do you ensure your code is **secure** (no security flaws)? Anything else?
20. *(Production problem)* You have a **poorly performing SQL statement**. What steps would you take to find the root cause and fix the performance issue?

## Candidate's Questions to the Interviewers

- What kind of engineer are you looking for? What product will this role work on, and what is the team structure? *(Back-end team working on Node + Spring Boot for the CVS / Caremark member-facing websites, using SAFe Agile.)*
- Is there GCP work for this team? *(Yes, services are deployed in multiple places, including GCP.)*

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 6] Senior Node.js Interview Experience | Kafka, JWT, CSRF, Socket.io | Episode 32

Source: https://www.youtube.com/watch?v=ZQz2zSClDgY

Questions as the interviewer asked them (lightly cleaned up), in order. The video starts mid-interview and ends when the coding round starts.

## Real-time / Socket.io

1. Have you worked on **real-time applications**? Was it just for learning, or have you integrated it in an application?
2. How can we **authenticate a socket connection**?
3. Follow-up: How exactly do we do it with **JWT tokens**? How will we pass the token?
4. Follow-up: Does the socket connection get established **from back end to front end, or front end to back end**? Where does the handshake begin?
5. Follow-up: Then how will we validate the token, since there is no middleware on the front end?
6. Follow-up: If you pass the token directly in the payload, do you think that's **good for security**?
7. Follow-up: When we establish a socket connection, there are some **objects where we can pass that token**. Do you know them?

## JWT / Auth

8. *(Scenario)* Our application uses **JWT tokens that expire every 20 minutes**, so users get logged out and must log in again. How can you improve the user experience so users **stay logged in** even when the token expires?
9. Follow-up: How will the **front end know the token has expired** and that the refresh token needs to regenerate the access token? Will you create a separate API for the refresh token?
10. Follow-up: You said the front end will call it "after a certain period of time". What period? *(The interviewer points out that calling it every 5 minutes on an interval is an unnecessary API call.)*
11. Where should we **store the token on the front end**? Which token, the access token or the refresh token? Why?
12. Follow-up: If you store the access token in a **cookie**, won't the cookie be sent with **every request from the browser**, even from another domain? How do we handle that?
   > **Correction:** In the video the interviewer says cookies have no protective flag. That's wrong. The **`SameSite`** attribute (`Strict` / `Lax`) stops the browser from sending the cookie on cross-site requests. Use it with **`HttpOnly`** (JavaScript can't read the cookie, which limits XSS theft) and **`Secure`** (HTTPS only).
13. Why do we set the **access token's expiry shorter than the refresh token's**? Why not 8–9 hours instead of 15–20 minutes?
14. Follow-up: **How would a token get stolen**?

## Security

15. What is an **XSS attack**?
16. How can we **prevent XSS attacks**?
17. If you store the token in cookies, it gets sent with every request, including to another domain. How can we **prevent our cookies from being attached to requests from another domain**? *(Not CORS. The interviewer was looking for a **CSRF token**.)*
   > **Note:** Give both answers. **`SameSite` cookies** are the modern first line of defence, and **CSRF tokens** are the classic one. Mentioning both shows depth.
18. Have you implemented **CSRF tokens**?
