# TechM – L1 Interview

**Topics:** AWS Lambda, cold start, X-Ray, distributed systems, Step Functions, database horizontal scaling, event loop output

---

## AWS Lambda

### 1. What is a Lambda function?

**Answer:**
A Lambda function is a serverless compute service provided by AWS Lambda that allows you to run code without provisioning or managing servers. It executes code in response to events and automatically scales.

=====================================================================================================================

### 2. What is a cold start? How can you tackle it?

**Answer:**
A cold start occurs when a Lambda function is invoked after being idle, causing a delay because a new execution environment must be initialized.

**Ways to reduce it:**
- Use Provisioned Concurrency
- Keep functions "warm" (scheduled invocations)
- Reduce package size and dependencies
- Choose faster runtimes (e.g., Node.js, Python)
- Optimize initialization code

=====================================================================================================================

### 3. What is X-Ray tracing?

**Answer:**
AWS X-Ray is a service that helps you analyze and debug distributed applications by tracing requests as they travel through different services.

=====================================================================================================================

### 4. What is a distributed environment?

**Answer:**
A distributed environment is a system where components are located on multiple networked machines but work together as a single system.

**Example:** Microservices architecture deployed across cloud servers.

=====================================================================================================================

### 5. Write a simple Lambda function code

**Answer:**
```js
exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify("Hello from Lambda!")
    };
};
```

=====================================================================================================================

### 6. How many parameters can we pass to a Lambda function?

**Answer:**
In AWS Lambda, the handler typically receives 3 parameters:
- `event` → input data
- `context` → runtime info
- `callback` → (optional, for non-async handling)

=====================================================================================================================

### 7. How to call one Lambda function from another?

**Answer:**
You can call another Lambda using the AWS SDK:

```js
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

await lambda.invoke({
    FunctionName: 'targetLambda',
    Payload: JSON.stringify({ key: "value" })
}).promise();
```

=====================================================================================================================

## AWS Step Functions

### 8. What is Step Function?

**Answer:**
AWS Step Functions is a service used to orchestrate multiple AWS services into workflows using state machines.

=====================================================================================================================

### 9. Write a simple Step Function configuration to call 2 Lambda functions sequentially

**Answer:**
```json
{
  "StartAt": "FirstLambda",
  "States": {
    "FirstLambda": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:region:account-id:function:firstFunction",
      "Next": "SecondLambda"
    },
    "SecondLambda": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:region:account-id:function:secondFunction",
      "End": true
    }
  }
}
```

=====================================================================================================================

## Database

### 10. How to do horizontal scaling in a database?

**Answer:**
Horizontal scaling means adding more machines instead of increasing the power of a single machine.

**Techniques:**
- Sharding (split data across nodes)
- Read replicas
- Partitioning
- Use distributed databases (e.g., NoSQL systems)

=====================================================================================================================

## Output Questions

### 11. What will be the output of the code snippet?

```js
console.log("A");

Promise.resolve().then(() => {
  console.log("E");
}).then(() => {
  console.log("F");
});

setTimeout(() => {
    console.log("B");
}, 0);

Promise.resolve().then(() => {
    console.log("C");
});

console.log("D");
```

**Output:**
```
A
D
E
C
F
B
```

**Explanation:**
- Synchronous code runs first → A, D
- Microtasks (Promises) → E, C, F
- Macrotasks (setTimeout) → B

=====================================================================================================================
