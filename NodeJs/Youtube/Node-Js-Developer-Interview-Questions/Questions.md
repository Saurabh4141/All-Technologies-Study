# 1] Senior Node.js Interview Questions (5+ Years Experience) – Real Backend Round

Source: https://www.youtube.com/watch?v=j8wc5qXfJmE

Questions are written as the interviewer asked them (lightly cleaned up for readability), in order.

---

## Introduction

1. Tell me about your total experience and the technology skill sets you are currently working on.
2. Any experience with AWS and databases like SQL and NoSQL DBs?

## API Security / JWT

3. In Node.js, in order to protect your APIs from unauthorized access, what are you using currently?
4. In JWT, when we create the token — how do we decrypt the token back to check whether the token is correct or not?
5. For verifying the user token, what is the method in JWT (`jsonwebtoken`) to verify or decrypt it?
6. JWT has one more method, `jwt.decode`. Do you know the difference between `jwt.decode` and `jwt.verify`?
7. Scenario: A user logs in with email ID and password and you generate a JWT token. In subsequent APIs the caller sends that token in the header of each request. Somebody copies that JWT token, and inside the token the user ID was `123`. The attacker updates it to `456` and sends that token. How will JWT secure this?
8. What is the structure of a JWT token? What are all the things inside a JWT token?

## Node.js Core

9. In Node.js, do you know what a **circuit breaker** is?
10. In Node.js, what are the **phases of the event loop**?

## Performance / Optimization

11. Scenario: You developed a Node.js API, and we found that the API has latency — it is taking 10 seconds to respond. We want the result within 2–3 seconds. What steps will you take to figure out how to optimize it?
12. Follow-up: Inside the API you are making a DB query, and the query uses three columns. Will you just go to the DB and attach indexes to those three columns, or what will be your first step?
13. Follow-up: Let's say `id` is your primary key, but the query is not on the `id` column — I'm searching data on the basis of `name` or `age`. Will the primary index help here?
14. What is the **query execution plan** in databases?

## JavaScript

15. What is the difference between `Promise.all` and `Promise.allSettled`?

## Node.js Modules & Globals

16. In Node.js, what is a **circular dependency**?
17. In Node.js, what are the **globals**?

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 2] Deloitte – First Round, Node.js + React (5 Years Experience) – YouTube Short

Source: https://www.youtube.com/shorts/NJD0smSDex8

Questions as the person says Deloitte asked them, in order.

1. Make a functional component in React.js which prints numbers from 1 to 10.
2. What are **Higher Order Components** in React?
3. How do you do **authentication** in React?
4. How do you **store the token** in React after retrieving it from the server? *(Asked to write the program in Notepad.)*
5. What is the difference between **React** and **React Native**?
6. What is the **React component lifecycle**?
7. What is the difference between **Node** and **Node.js**?

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
2. Which Node.js framework have you worked on? (Express / NestJS)
3. Any particular projects you have done with React? How much React experience should I consider?
4. Which databases have you worked on with Node.js? What is your experience with MongoDB?
5. Other than JavaScript / TypeScript, have you worked on any other programming language? (Golang)

## JavaScript – Async

6. What is the difference between a **Promise** and a **callback function**?
7. Follow-up: Nesting multiple callbacks makes code hard to maintain. What do we call that problem?
8. What is **callback hell**?
9. Does `async` work **synchronously or asynchronously**? *(Follow-up: "Are you sure it works synchronously?")*

## Redis / Real-time

10. Have you worked on Redis? **Why do we use Redis?**
11. Have you worked on **Socket.io**?
12. What is the difference between an **HTTP connection** and a **socket connection**?

## Architecture

13. What are **microservices** and why do we prefer them? *(Short answer)*
14. What is a **middleware**?
15. Have you worked on **Docker / Kubernetes**? Explain.
16. Have you worked on **Kafka** and **MQ**? Explain Kafka.

## Security & Code Quality

17. If you have to create an application from scratch, how will you make it **secure**? *(Small points, not a long explanation)*
18. If you have to create only the **back end**, what will be your approach to make it a **secure back end**?
19. Other than JWT, which other module would you use? *(Passport. Follow-up: Passport for what?)*
20. Are you talking about securing the servers with firewalls, or code-level security?
21. What do you understand by **code reusability**?
22. What do you understand by **MVC architecture**?

## Coding Round

23. Share your screen and open any compiler (local or online). I'm going to give you some questions to solve. *(The video ends here.)*

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 5] Node.js Developer Interview with Tech Mahindra – Technical Round

Source: https://www.youtube.com/watch?v=8Kpj3ADMU3k

Questions as the interviewers asked them (lightly cleaned up), in order. There are three interviewers: a manager (HR-style questions), a Node.js interviewer, and a Java / Spring Boot interviewer. The client project is CVS / Caremark member-facing websites.

## Node.js Round

4. Do you have any experience with Node.js?
5. So you created microservices? Which **framework** have you used for Node.js in your previous projects?
6. You said Express.js. **How do you create a server in Express.js?**
7. What is the difference between **`setImmediate`** and **`setTimeout`**?
8. *(Code snippet pasted in chat)* What would be the **output** of this snippet? *(`console.log('first')`, a `setTimeout` that logs `'second'`, then `console.log('third')`)*
9. Do you know what a **callback** is?
10. Why do you think Node.js is **able to handle many requests**?
11. Follow-up: So you're saying Node.js is **multi-threaded**, right?
12. Which **npm modules** have you used in your Node.js microservices? Tell me your commonly used npm modules.
13. How do you get an **error object in a callback**?
14. How do you handle **unexpected exceptions**?
15. Have you used any **unit testing frameworks** in Node.js?
16. How do you **deploy** your applications / microservices?
17. Were you involved in deployment yourself, or did you request a deployment team to deploy?
18. Are you deploying to **on-prem servers or cloud** environments?
19. Do you configure **CI/CD pipelines**, and do you deploy using any **container-based** deployment mechanism?
20. What is the difference between **`module.exports`** and **`exports`**?
21. How do you implement **asynchronous programming** in Node.js?

## Java / Spring Boot Round

22. When you're writing code, how do you ensure your **code quality** (no bugs)?
23. How do you ensure your code is **secure** (no security flaws)? Anything else?
24. Have you written **Spring Boot services that are multi-threaded**?
25. Name some ways you could **initiate threads** in Java or Spring Boot.
26. You have a Spring Boot service and want to **invoke another RESTful service**. Name a few ways you can do that.
27. *(Production problem)* You have a **poorly performing SQL statement**. What steps would you take to find the root cause and fix the performance issue?
28. When would you use a **stream vs a parallel stream** (Java 8)?
29. *(Code on screen with try / catch / finally)* What will the **result** be after the main method executes? What does the final print line show?

## Coding Round

30. Go to the given URL, read the instructions and write the code. *(A Java problem about a collection of numbers, like adding the number 1 to the front and summing the members. The candidate didn't finish it.)*

## Candidate's Questions to the Interviewers

- What kind of engineer are you looking for? What product will this role work on, and what is the team structure? *(Back-end team working on Node + Spring Boot for the CVS / Caremark member-facing websites, using SAFe Agile.)*
- Is there GCP work for this team? *(Yes, services are deployed in multiple places, including GCP.)*

------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------

# 6] Senior Node.js Interview Experience | Kafka, JWT, CSRF, Socket.io | Episode 32

Source: https://www.youtube.com/watch?v=ZQz2zSClDgY

Questions as the interviewer asked them (lightly cleaned up), in order. The video starts mid-interview and ends when the coding round starts.

## Kafka / Message Queues

1. How do you **broadcast a message to multiple queues in Kafka**? Can you explain?
2. Follow-up: After creating the topic, which technique or **exchange** would you use so the message is broadcast to all the other queues?
3. *(Scenario)* You're building a **payment gateway**. When a `payment initiated` event is produced, multiple actions get triggered: a fraud check, a ledger update and a notification service. How would you ensure the event is **not processed more than once by any consumer, even in the case of retries or restarts**? *(For example, the user retries the payment by reloading the page. The ledger must update only once.)*
4. Follow-up: If you have **multiple queues** (the fraud check in one queue, the ledger update in another), how will you ensure this in your queues?
5. Do you have any hands-on experience with **RabbitMQ**?

## Real-time / Socket.io

6. Have you worked on **real-time applications**? Was it just for learning, or have you integrated it in an application?
7. How can we **authenticate a socket connection**?
8. Follow-up: How exactly do we do it with **JWT tokens**? How will we pass the token?
9. Follow-up: Does the socket connection get established **from back end to front end, or front end to back end**? Where does the handshake begin?
10. Follow-up: Then how will we validate the token, since there is no middleware on the front end?
11. Follow-up: If you pass the token directly in the payload, do you think that's **good for security**?
12. Follow-up: When we establish a socket connection, there are some **objects where we can pass that token**. Do you know them?

## JWT / Auth

13. *(Scenario)* Our application uses **JWT tokens that expire every 20 minutes**, so users get logged out and must log in again. How can you improve the user experience so users **stay logged in** even when the token expires?
14. Follow-up: How will the **front end know the token has expired** and that the refresh token needs to regenerate the access token? Will you create a separate API for the refresh token?
15. Follow-up: You said the front end will call it "after a certain period of time". What period? *(The interviewer points out that calling it every 5 minutes on an interval is an unnecessary API call.)*
16. Where should we **store the token on the front end**? Which token, the access token or the refresh token? Why?
17. Follow-up: If you store the access token in a **cookie**, won't the cookie be sent with **every request from the browser**, even from another domain? How do we handle that?
18. Why do we set the **access token's expiry shorter than the refresh token's**? Why not 8–9 hours instead of 15–20 minutes?
19. Follow-up: **How would a token get stolen**?

## Security

20. What is an **XSS attack**?
21. How can we **prevent XSS attacks**?
22. If you store the token in cookies, it gets sent with every request, including to another domain. How can we **prevent our cookies from being attached to requests from another domain**? *(Not CORS. The interviewer was looking for a **CSRF token**.)*
23. Have you implemented **CSRF tokens**?

## Coding Round

24. Can you please share your screen? *(The video ends here.)*
