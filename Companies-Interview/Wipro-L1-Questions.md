# Wipro – L1 Interview

**Topics:** JWT middleware, TypeScript generics, rate limiting, error handling, AWS (HA, Secrets Manager, ECS/EKS, monitoring), streams, security

---

## Node.js: Authentication

### 1. Create a middleware to verify token

**Answer:**
Used to authenticate requests using JWT.

```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
```

=====================================================================================================================

## TypeScript

### 2. Type-safe APIs using generics and conditional types

**Answer:**
Generics allow reusable types, and conditional types add flexibility.

```typescript
type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type ErrorResponse<T> = T extends null
  ? { success: false; error: string }
  : ApiResponse<T>;

function createResponse<T>(data: T): ErrorResponse<T> {
  if (data === null) {
    return { success: false, error: 'No data' } as ErrorResponse<T>;
  }
  return { success: true, data } as ErrorResponse<T>;
}

// Usage
const res = createResponse<{ name: string }>({ name: "Vijay" });
```

=====================================================================================================================

### 3. Interface vs Type in TypeScript

**Answer:**

| Feature          | Interface          | Type                  |
|------------------|--------------------|----------------------|
| Extension       | extends           | & (intersection)    |
| Declaration merging | Yes              | No                  |
| Use case        | Object structure | Complex types       |

```typescript
interface User {
  name: string;
}

interface Admin extends User {
  role: string;
}

type Person = {
  name: string;
};

type Employee = Person & {
  salary: number;
};
```

Use:
- interface → for objects/classes
- type → unions, primitives, advanced cases

=====================================================================================================================

## Node.js: Express & Concurrency

### 4. Rate limiting in Express

**Answer:**
Prevents abuse (DDoS, brute force attacks)

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP
  message: 'Too many requests, please try later'
});

app.use('/api', limiter);
```

=====================================================================================================================

### 5. Handling high concurrency (non-blocking)

**Answer:**
Node.js uses event loop + async I/O.

Best practices:
- Avoid sync operations
- Use async/await
- Offload CPU work

```javascript
app.get('/users', async (req, res) => {
  const users = await getUsersFromDB(); // non-blocking
  res.json(users);
});
```

For CPU-heavy tasks:
```javascript
const { Worker } = require('worker_threads');
```

=====================================================================================================================

### 6. Centralized error handling

**Answer:**
Single middleware to handle all errors.

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
```

=====================================================================================================================

## AWS

### 7. Highly available AWS architecture

**Answer:**
Key components:
- ELB (Load Balancer)
- Auto Scaling Groups
- Multi-AZ deployment
- RDS with read replicas
- S3 + CloudFront
- Failover (Route 53)

Flow:
Client → Load Balancer → EC2 (Auto-scaled) → DB (Multi-AZ)

=====================================================================================================================

### 8. AWS Secrets Manager

**Answer:**
Improves security by:
- Storing secrets securely (DB passwords, API keys)
- Automatic rotation
- IAM-based access control
- Encryption using KMS

```javascript
// Example (AWS SDK v3)
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "ap-south-1" });
const secret = await client.send(
  new GetSecretValueCommand({ SecretId: "my-secret" })
);
```

=====================================================================================================================

### 9. ECS vs EKS

**Answer:**

| Feature    | ECS          | EKS              |
|------------|--------------|------------------|
| Type       | AWS native  | Kubernetes      |
| Complexity | Simple      | Complex         |
| Portability| Low         | High            |
| Use case   | Quick deployments | Enterprise / multi-cloud |

Summary:
- ECS → simpler, AWS-focused
- EKS → flexible, Kubernetes ecosystem

=====================================================================================================================

### 10. Monitoring AWS applications

**Answer:**
Tools:
- CloudWatch → logs, metrics
- X-Ray → tracing
- CloudTrail → API auditing
- Alarms → notifications

Example:
- CPU usage alert → triggers SNS → sends email

=====================================================================================================================

## Node.js: Streams, Database & Security

### 11. Streams in Node.js

**Answer:**
Streams process data in chunks instead of loading entire data.

Types:
- Readable
- Writable
- Duplex
- Transform

```javascript
const fs = require('fs');
const stream = fs.createReadStream('large-file.txt');
stream.on('data', chunk => {
  console.log(chunk.toString());
});
```

When to use:
- Large files
- File uploads/downloads
- Video streaming
- Real-time processing

=====================================================================================================================

### 12. Database operations in Node.js

**Answer:**
Approaches:
- ORM (Prisma, Sequelize)
- Native drivers (MongoDB, pg)

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUsers() {
  return await prisma.user.findMany();
}
```

Best practices:
- Connection pooling
- Transactions
- Indexing

=====================================================================================================================

### 13. Security best practices in Node.js

**Answer:**
Key practices:
- Use HTTPS
- Validate & sanitize inputs
- Use helmet
- Implement rate limiting
- Store secrets securely
- Use JWT/OAuth
- Prevent XSS, CSRF, SQL injection

```javascript
const helmet = require('helmet');
app.use(helmet());
```

=====================================================================================================================
