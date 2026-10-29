# TCS – L1 Interview

**Topics:** find vs filter, hoisting, TDZ, closure, currying, Promise.all, Node http server, JS programs, AWS Lambda cold start, provisioned concurrency, production issues

---

## JavaScript & Node.js

### 1. Difference between `find()` and `filter()`

**Answer:**

**`find()`**
- Returns first matching element
- Stops once condition is satisfied
- Returns `undefined` if no match

**`filter()`**
- Returns all matching elements as an array
- Checks entire array
- Returns empty array `[]` if no match

**Example:**
```js
const arr = [1, 2, 3, 4];

arr.find(x => x > 2);    // 3
arr.filter(x => x > 2);  // [3, 4]
```

=====================================================================================================================

### 2. What is Hoisting?

**Answer:**
Hoisting is JavaScript's behavior of moving declarations to the top of their scope during compilation.

- `var` is hoisted and initialized as `undefined`
- `let` and `const` are hoisted but not initialized

**Example:**
```js
console.log(a); // undefined
var a = 5;
```

=====================================================================================================================

### 3. What is TDZ (Temporal Dead Zone)?

**Answer:**
TDZ is the time between variable hoisting and initialization where accessing the variable causes an error.

- Applies to `let` and `const`
- Prevents usage before declaration

**Example:**
```js
console.log(a); // ❌ ReferenceError
let a = 10;
```

=====================================================================================================================

### 4. What is Closure and its use?

**Answer:**
A closure is when a function remembers variables from its outer scope, even after the outer function has finished executing.

**Example:**
```js
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const fn = outer();
fn(); // 1
fn(); // 2
```

**Uses:**
- Data encapsulation (private variables)
- Function factories
- Maintaining state (like counters)

=====================================================================================================================

### 5. What is Function Currying?

**Answer:**
Currying is transforming a function with multiple arguments into a series of functions each taking one argument.

**Example:**
```js
function add(a) {
  return function(b) {
    return a + b;
  };
}

add(2)(3); // 5
```

**Benefits:**
- Reusability
- Partial application
- Cleaner functional programming

=====================================================================================================================

### 6. How to call multiple APIs simultaneously?

**Answer:**
Use `Promise.all()`:

```js
Promise.all([
  fetch('api1'),
  fetch('api2'),
  fetch('api3')
])
.then(responses => Promise.all(responses.map(r => r.json())))
.then(data => console.log(data))
.catch(err => console.error(err));
```

- Runs all requests in parallel
- Fails fast if one fails

> Alternative: `Promise.allSettled()` → handles all results even if some fail.

=====================================================================================================================

### 7. Types of Promises

**Answer:**
Promises have 3 states:
- **Pending** – initial state
- **Fulfilled** – resolved successfully
- **Rejected** – failed

**Example:**
```js
const p = new Promise((resolve, reject) => {
  resolve("success");
});
```

=====================================================================================================================

### 8. Create a Node.js server using `http`

**Answer:**
```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

- Uses built-in `http` module
- Listens on port 3000

=====================================================================================================================

## Coding Programs

### 9. Write a program to reverse all words from array in JS

**Question understanding:**
If the array contains words like `["hello", "world"]`, the output should be `["olleh", "dlrow"]`.

**Answer:**
```js
const words = ["hello", "world", "javascript"];

const reversedWords = words.map(word => {
    return word.split("").reverse().join("");
});

console.log(reversedWords);
```

**Output:**
```
["olleh", "dlrow", "tpircsavaj"]
```

**Explanation:**
- `split("")` → converts string into array of characters
- `reverse()` → reverses characters
- `join("")` → converts array back to string
- `map()` → applies logic to every array element

=====================================================================================================================

### 10. Write a program to compare two objects in JS

**Answer:**
```js
const obj1 = { name: "John", age: 25 };
const obj2 = { name: "John", age: 25 };

function compareObjects(obj1, obj2) {

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

console.log(compareObjects(obj1, obj2));
```

=====================================================================================================================

## AWS Lambda

### 11. What is cold start in AWS Lambda?

**Answer:**
A cold start happens when Amazon Web Services (AWS) Lambda receives a request and has to create a new execution environment because no existing instance is available. This adds extra latency before the function executes.

**Why cold start happens:**
- First invocation of Lambda
- Lambda was idle for some time
- Sudden traffic spike requiring new instances

**What happens during cold start:**
- Allocate container
- Initialize runtime
- Load function code
- Initialize dependencies

**How to reduce cold start:**
- Use Provisioned Concurrency
- Keep deployment package small
- Reduce heavy dependencies
- Choose faster runtimes

=====================================================================================================================

### 12. What is Provisioned Concurrency?

**Answer:**
Provisioned Concurrency in AWS Lambda keeps a predefined number of Lambda instances initialized and ready to serve requests. This helps eliminate cold starts.

**Example:** if provisioned concurrency is set to 5:
- AWS keeps 5 Lambda instances warm
- Requests are served immediately with low latency

**Benefits:**
- Better performance
- Predictable response time
- Useful for APIs and real-time applications

**Trade-off:** additional cost because resources stay active.

=====================================================================================================================

## Production Experience

### 13. Did you handle any production issues?

**Sample interview answer:**
Yes, I have handled production issues related to APIs, deployments, and performance bottlenecks.

One issue I handled was:
- Users were experiencing slow API responses during peak traffic.
- I investigated logs using monitoring tools and found a database query causing high response times.
- I optimized the query, added indexing, and implemented caching.
- After deployment, response time reduced significantly and the issue was resolved.

Another example:
- A deployment caused a service failure due to incorrect environment variables.
- I quickly rolled back the deployment, fixed the configuration, and redeployed safely.

=====================================================================================================================
