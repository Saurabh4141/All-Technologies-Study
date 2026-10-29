# Algoworks – L1 Interview

**Topics:** Node.js, Promises, Microservices, AWS Lambda, SQS/SNS, SQL, TypeScript, JS output questions

---

## Node.js & JavaScript

### 1. What is Node.js?

**Answer:**
Node.js is an open-source, cross-platform JavaScript runtime environment built on the V8 engine (used in Chrome). It allows you to run JavaScript on the server.

**Key features:**
- Event-driven architecture
- Non-blocking I/O (asynchronous)
- Single-threaded but highly scalable
- Ideal for real-time applications (chat apps, streaming, APIs)

**Example:**
```js
const fs = require('fs');

fs.readFile('file.txt', (err, data) => {
  console.log(data.toString());
});
```

> This is non-blocking: Node handles other requests while reading the file.

=====================================================================================================================

### 2. What are Promises?

**Answer:**
A Promise represents a value that may be available now, later, or never.

**States:**
- Pending
- Fulfilled
- Rejected

**Example:**
```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done"), 1000);
});
```

**Benefits:**
- Avoid callback hell
- Better error handling using `.catch()`
- Works well with async/await

=====================================================================================================================

## Architecture & Deployment

### 3. Difference: Monolith vs Microservices vs Serverless

**Answer:**

| Feature      | Monolith         | Microservices     | Serverless          |
|--------------|------------------|-------------------|---------------------|
| Architecture | Single codebase  | Multiple services | Function-based      |
| Deployment   | One unit         | Independent       | Event-triggered     |
| Scaling      | Entire app       | Per service       | Automatic           |
| Complexity   | Low              | Medium            | High (infra hidden) |
| Example      | Traditional apps | Netflix           | AWS Lambda          |

=====================================================================================================================

### 4. How are you deploying Lambda functions?

**Answer:**
Common deployment methods:

1. **Using frameworks:**
   - Serverless Framework
   - AWS SAM
2. **CI/CD pipeline** (GitHub Actions / Jenkins):
   - Build code
   - Zip package
   - Deploy via AWS CLI
3. **Infrastructure as Code:**
   - CloudFormation / Terraform

**Example:**
```bash
aws lambda update-function-code \
  --function-name my-function \
  --zip-file fileb://function.zip
```

=====================================================================================================================

## Messaging & Microservices

### 5. How to communicate between microservices?

**Answer:**
1. **Synchronous:**
   - REST APIs (HTTP)
   - gRPC
2. **Asynchronous** (message queues):
   - Amazon SQS
   - Kafka
   - RabbitMQ
3. **Event-driven** (Publish/Subscribe):
   - SNS, Kafka topics

> Best practice: prefer async communication for scalability.

=====================================================================================================================

### 6. What is SQS? Short polling vs Long polling

**Answer:**
Amazon SQS is a fully managed message queue service.

- **Short polling:**
  - Immediate response
  - Might return empty even if messages exist
- **Long polling:**
  - Waits (up to 20 sec)
  - Reduces empty responses
  - More efficient

**Example:**
```
WaitTimeSeconds: 20
```

=====================================================================================================================

### 7. How Lambda handles concurrency? How to check limits?

**Answer:**
Lambda runs multiple instances in parallel. The default limit is 1000 per region (soft limit).

**Types:**
- Reserved concurrency
- Provisioned concurrency

**Monitoring:** use CloudWatch metrics:
- `ConcurrentExecutions`
- `Throttles`

> If the limit is exceeded, throttling occurs.

=====================================================================================================================

### 8. Cold vs Warm Lambda functions

**Answer:**

| Feature        | Cold Start | Warm Start |
|----------------|------------|------------|
| Startup time   | High       | Low        |
| Initialization | Yes        | No         |
| Frequency      | Rare       | Frequent   |

**Reduce cold starts:**
- Provisioned concurrency
- Keep functions warm

=====================================================================================================================

### 9. How to monitor production in serverless?

**Answer:**

**Tools:**
- CloudWatch Logs & Metrics
- AWS X-Ray (tracing)
- Alarms

**Best practices:**
- Structured logging (JSON)
- Distributed tracing
- Alerts on failures

=====================================================================================================================

### 10. What is SNS?

**Answer:**
Amazon SNS is a publish/subscribe messaging service.

**Features:**
- Push-based delivery
- Multiple subscribers (Lambda, email, SQS)

**Example:** order placed → notify multiple systems.

=====================================================================================================================

## Database

### 11. How to improve slow query performance?

**Answer:**

**Techniques:**
- Add indexes
- Optimize queries (avoid `SELECT *`)
- Use the `EXPLAIN` plan
- Caching (Redis)
- Normalize / denormalize
- Partitioning

=====================================================================================================================

### 12. Difference between SQL and NoSQL

**Answer:**

| Feature | SQL        | NoSQL                |
|---------|------------|----------------------|
| Schema  | Fixed      | Flexible             |
| Scaling | Vertical   | Horizontal           |
| Data    | Structured | Semi/Unstructured    |
| Example | MySQL      | MongoDB              |

=====================================================================================================================

## TypeScript & JS Basics

### 13. What is the use of TypeScript?

**Answer:**
TypeScript is a superset of JavaScript adding static typing.

**Benefits:**
- Type safety
- Better IDE support
- Early error detection
- Improved maintainability

=====================================================================================================================

### 14. What is the `any` data type?

**Answer:**
- Disables type checking
- Can hold any value

**Example:**
```ts
let x: any = 10;
x = "hello";
```

> Avoid in production: it removes the benefits of TypeScript.

=====================================================================================================================

### 15. Difference between `null` and `undefined`

**Answer:**

| Feature | `null`            | `undefined`  |
|---------|-------------------|--------------|
| Meaning | Intentional empty | Not assigned |
| Type    | `object`          | `undefined`  |

=====================================================================================================================

## Output Questions

### 16. Promise chain output

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => { throw new Error('My Error') })
  .catch(() => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch(console.error)
```

**Output:** `2`

**Step-by-step:** `1` → `2` → Error → catch returns `1` → `2` → print

**Explanation:** each `.then` adds 1, the thrown error skips to `.catch`, which returns `1`, and the last `.then` adds 1 and prints it.

=====================================================================================================================

### 17. What is the output?

```js
console.log([] == false);
```

**Output:** `true`

**Explanation:**
- `[]` → converted to `""`
- `"" == false` → `true`

=====================================================================================================================

### 18. What is the output?

```js
let variableName;
console.log(variableName > 0);
```

**Output:** `false`

**Explanation:**
- `undefined > 0` → `false`

=====================================================================================================================
