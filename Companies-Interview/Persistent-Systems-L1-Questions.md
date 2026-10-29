# Persistent Systems – L1 Interview

**Topics:** Event loop, libuv, Express, MongoDB, middleware, API security, Helmet, JWT, React hooks and performance

---

## 🟢 Node.js

### 1. Event Loop in Node.js

**Question:** What is the Event Loop? Explain how it works and how it manages asynchronous operations.

**Answer:** The Event Loop is the core mechanism that allows Node.js to perform non-blocking asynchronous operations despite being single-threaded.

#### How it Works:

Node.js executes code in the following phases:

- Call Stack – Executes synchronous code.
- Callback Queue (Macrotask Queue) – Stores callbacks from setTimeout, setInterval, etc.
- Microtask Queue – Stores Promise callbacks.
- Event Loop – Moves tasks from queues to the call stack when it is empty.

#### Execution Order:

1. Execute synchronous code.
2. Run microtasks (Promises).
3. Run macrotasks (setTimeout, setImmediate).

This makes Node.js highly efficient for I/O-heavy applications.

=====================================================================================================================

### 2. Libuv

**Question:** What is Libuv and what role does it play in Node.js?

**Answer:** libuv is a C library that provides asynchronous I/O operations.

#### Role in Node.js:

Handles:
- File system operations
- DNS lookups
- Network operations

Manages:
- Thread pool
- Event loop

Enables non-blocking I/O.

libuv is the backbone of Node.js asynchronous behavior.

=====================================================================================================================

### 3. Creating an Express Server

**Question:** Write code to create a basic Express server and implement a simple API endpoint.

**Answer:** Using Express.js:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/api/user', (req, res) => {
  res.json({ name: "John", role: "Developer" });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

=====================================================================================================================

### 4. Database Connection

**Question:** Write sample code to connect a Node.js application to a database.

**Answer (MongoDB Example):** Using MongoDB with Mongoose:

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testDB')
  .then(() => console.log('Database Connected'))
  .catch(err => console.log(err));
```

=====================================================================================================================

### 5. Middleware in Node.js

**Question:** What is middleware? Write an example of a custom middleware function.

**Answer:** Middleware is a function that executes during the request-response cycle.

#### Example:
```javascript
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);
```

Middleware can:
- Modify request/response
- End request
- Call next middleware

=====================================================================================================================

### 6. Securing a Node.js API

**Question:** How can you secure a Node.js API? What best practices should be followed?

**Answer:**

#### Best Practices:
- Use HTTPS
- Validate input (Joi / express-validator)
- Use authentication (JWT)
- Implement rate limiting
- Use secure headers
- Hash passwords (bcrypt)
- Store secrets in environment variables

=====================================================================================================================

### 7. API Security Using HTTP Headers

**Question:** Explain how HTTP headers can be used to enhance API security.

**Answer:** Security-related HTTP headers:

- Content-Security-Policy
- X-Content-Type-Options
- Strict-Transport-Security
- X-Frame-Options

These headers:
- Prevent XSS
- Prevent clickjacking
- Enforce HTTPS
- Protect MIME-type sniffing

=====================================================================================================================

### 8. Helmet

**Question:** What is Helmet? Explain its role in securing Node.js applications.

**Answer:** Helmet is a middleware for Express that helps secure apps by setting HTTP security headers.

#### Usage:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

It protects against:
- XSS
- Clickjacking
- MIME sniffing attacks

=====================================================================================================================

### 9. JWT (JSON Web Token)

**Question:** What is JWT? Explain how it is used for authentication and authorization.

**Answer:** JSON Web Token is a compact, URL-safe token format used for secure data exchange.

#### Structure:
- Header
- Payload
- Signature

#### Flow:
1. User logs in.
2. Server generates JWT.
3. Client stores token.
4. Client sends token in Authorization header.
5. Server verifies signature.

Used for stateless authentication.

=====================================================================================================================

## 🔵 React.js

### 10. Handling User Input in React

**Question:** Write a simple React example that:
- Accepts user input
- Stores value on submission
- Displays submitted value

**Answer:** Using React:

```jsx
import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(input);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Submitted Value: {submitted}</h3>
    </div>
  );
}

export default App;
```

=====================================================================================================================

### 11. React Hooks

**Question:** What hooks are available in React? Explain their use cases.

**Answer:** Common hooks in React:

- useState → Manage state
- useEffect → Side effects (API calls)
- useContext → Access context
- useReducer → Complex state logic
- useRef → Access DOM elements
- useMemo → Memoize computed values
- useCallback → Memoize functions

=====================================================================================================================

### 12. Performance Optimization in React

**Question:** How can you improve the performance of a React.js application?

**Answer:**

#### Techniques:
- Use React.memo() to prevent unnecessary re-renders
- Use useMemo and useCallback
- Code splitting (React.lazy)
- Avoid inline functions in JSX
- Use key props properly
- Virtualize large lists (React Window)
- Optimize state structure

=====================================================================================================================
