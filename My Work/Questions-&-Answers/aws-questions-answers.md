# AWS – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is a cold start? How can you tackle it?

   *(Asked 2×: TCS, TechM)*

==> A **cold start** in **AWS Lambda** is the extra delay when Lambda has no ready instance and
must create a new one before running your handler.

What happens during a cold start:
1. Lambda creates a new **execution environment** (micro-VM).
2. Downloads your code (zip or container image).
3. Starts the runtime (e.g. Node.js).
4. Runs your **init code** (everything outside the handler).

When it happens: the first call, after the function sat idle, or when traffic spikes and Lambda
needs more instances.

How to reduce it:
- **Provisioned Concurrency** – keeps N instances already initialized (no cold start for them).
- **SnapStart** (Java, Python, .NET) – Lambda restores a snapshot of an initialized instance.
- **Small package** – bundle with esbuild, use only the AWS SDK v3 clients you need.
- **Create clients outside the handler** (DB, SDK) so warm calls reuse them.
- **More memory** – Lambda gives CPU in proportion to memory, so init runs faster.

```js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const db = new DynamoDBClient({}); // init code: runs once per cold start

export const handler = async (event) => {
  // runs on every call, reuses `db` when the instance is warm
};
```

In short: cold start = time to set up a new Lambda instance; fix it with provisioned concurrency,
SnapStart, a small package and a light init.

---

2. What is a Lambda function?

   *(Asked 1×: TechM)*

==> **AWS Lambda** is a **serverless** compute service: you upload a function and AWS runs it
when an **event** triggers it.
- **No servers** to manage; Lambda scales instances up and down automatically.
- **Triggers**: API Gateway / Function URL (HTTP), S3 upload, SQS message, EventBridge schedule,
  DynamoDB Streams, SNS.
- **Pay per use**: number of requests + duration (GB-seconds). Idle costs nothing.
- **Limits to remember**: max **15 minutes** per call, memory 128 MB – 10 GB, 6 MB payload for
  sync calls.

In short: Lambda = run code on events, no servers, pay only while it runs.

---

3. Write a simple Lambda function

   *(Asked 1×: TechM)*

==> A Node.js handler that returns an HTTP response through **API Gateway**:

```js
// index.mjs
export const handler = async (event) => {
  const name = event.queryStringParameters?.name || "World";
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `Hello ${name} from Lambda!` }),
  };
};
```

Calling `GET /hello?name=Saurabh` returns:

```text
{"message":"Hello Saurabh from Lambda!"}
```

- `handler` is the **entry point** Lambda calls (configured as `index.handler`).
- `event` is the input (here the API Gateway request); the returned object becomes the HTTP
  response.
- `body` must be a **string**, so use `JSON.stringify`.

---

4. How are you deploying Lambda functions?

   *(Asked 1×: Algoworks)*

==> Sample answer: "We deploy with **Infrastructure as Code** through a **CI/CD pipeline**."
- Push to Git → **GitHub Actions** (or **CodePipeline**) runs tests → deploys to the stage.
- IaC tool: **AWS SAM**, **Serverless Framework**, **AWS CDK** or **Terraform**.
- Separate **stages** (dev, staging, prod), and Lambda **versions + aliases** so we can roll
  back by pointing the alias at the previous version.
- For a quick manual code update, the **AWS CLI** works.

```bash
# AWS SAM
sam build && sam deploy --stack-name my-api --guided

# Serverless Framework
serverless deploy --stage prod

# AWS CLI (update only the code)
aws lambda update-function-code --function-name myFunction --zip-file fileb://function.zip
```

In short: Git → CI/CD → SAM/Serverless/CDK deploy, with stages and aliases for safe rollback.

---

5. How many parameters can we pass to a Lambda function?

   *(Asked 1×: TechM)*

==> A Node.js Lambda handler gets **up to 3 parameters**: `event`, `context`, `callback`.
- **`event`** – the input data. Put all your values inside this one object.
- **`context`** – info about the current run: `awsRequestId`, `functionName`,
  `getRemainingTimeInMillis()`.
- **`callback`** – the old way to return a result. With `async` handlers you just `return`
  (newer Node.js runtimes support only async handlers).
- Python handlers take only `event` and `context`.

```js
export const handler = async (event, context) => {
  console.log(context.functionName, context.getRemainingTimeInMillis());
  return { ok: true, input: event };
};
// invoke with {"id": 1}  →  returns {"ok":true,"input":{"id":1}}
```

In short: 3 parameters (2 in modern async code), but any amount of data fits in `event`, up to
the **6 MB** payload limit for sync calls.

---

6. How do you call one Lambda function from another?

   *(Asked 1×: TechM)*

==> Use the AWS SDK **`Invoke`** API from the first Lambda. Its execution role needs the
**`lambda:InvokeFunction`** permission.
- `InvocationType: "RequestResponse"` – wait for the result (**sync**).
- `InvocationType: "Event"` – fire and forget (**async**, Lambda queues it and retries on error).

```js
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
const client = new LambdaClient({});

export const handler = async () => {
  const res = await client.send(new InvokeCommand({
    FunctionName: "targetLambda",
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({ userId: 1 }),
  }));
  return JSON.parse(Buffer.from(res.Payload).toString()); // targetLambda's return value
};
```

Interview tip: direct Lambda-to-Lambda calls make you pay for both while one waits. For chains
prefer **Step Functions**; for decoupling use **SQS**, **SNS** or **EventBridge**.

In short: SDK `InvokeCommand` + IAM permission; sync or async via `InvocationType`.

---

7. Cold vs warm Lambda functions

   *(Asked 1×: Algoworks)*

==> Comparison:

```text
+-----------+---------------------------------------+----------------------------------+
| Feature   | Cold start                            | Warm start                       |
+===========+=======================================+==================================+
| Instance  | New one is created                    | Existing one is reused           |
+-----------+---------------------------------------+----------------------------------+
| Init code | Runs (code outside the handler)       | Skipped                          |
+-----------+---------------------------------------+----------------------------------+
| Speed     | Slower (extra ~100 ms to seconds)     | Fast                             |
+-----------+---------------------------------------+----------------------------------+
| When      | First call, after idle, traffic spike | Calls soon after a previous call |
+-----------+---------------------------------------+----------------------------------+
```

```js
let count = 0; // init code: reset only on a cold start

export const handler = async () => {
  count++;
  return { count };
};
// 1st call (cold) → {"count":1}
// 2nd call (warm, same instance) → {"count":2}
```

That's why you reuse DB clients across warm calls, and why you **never keep user state** in
global variables (another instance won't have it).

In short: cold = new instance + init; warm = reused instance, init skipped.

---

8. What is a Step Function?

   *(Asked 1×: TechM)*

==> **AWS Step Functions** lets you build a **workflow (state machine)** out of steps.
- Each step is a **state**: `Task` (call a Lambda or AWS service), `Choice` (if/else),
  `Parallel`, `Map` (loop), `Wait`, `Succeed` / `Fail`.
- Step Functions handles the order, **retries**, error catching and waiting for you, so your
  Lambdas stay small.
- The workflow is written in JSON called **Amazon States Language (ASL)**.
- Two types: **Standard** (long-running, up to 1 year, exactly-once) and **Express** (high
  volume, up to 5 minutes).
- Example: order flow → validate order → charge payment → send email.

In short: Step Functions = a visual, retry-aware workflow that wires Lambdas and AWS services
together.

---

9. Write a Step Function config that calls 2 Lambda functions in sequence

   *(Asked 1×: TechM)*

==> In ASL, the first state points to the second with **`Next`**; the last state has
**`End: true`**.

```json
{
  "Comment": "Call two Lambdas one after another",
  "StartAt": "FirstLambda",
  "States": {
    "FirstLambda": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:firstFunction",
      "Next": "SecondLambda"
    },
    "SecondLambda": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:secondFunction",
      "End": true
    }
  }
}
```

If `firstFunction` returns `{ "orderId": 7 }`, `secondFunction` receives `{ "orderId": 7 }` as
its `event`.

---

10. In a Step Function, how is the second function called?

    *(Asked 1×: UST)*

==> **Step Functions calls it**, not the first Lambda.
- When the first state finishes, the state machine reads its **`"Next"`** field and moves to that
  state.
- The **output of the first Lambda becomes the input (`event`) of the second**.
- You can reshape the data with **`InputPath`**, **`ResultPath`** and **`OutputPath`** (or
  JSONata expressions in newer state machines).
- If the first step fails, its **`Retry`** / **`Catch`** rules decide what happens next.

```text
Lambda 1 returns {"userId": 1}  →  Step Functions  →  Lambda 2 event = {"userId": 1}
```

In short: `"Next": "SecondLambda"` + step 1's output is passed as step 2's input.

---

11. How do you monitor production in serverless?

    *(Asked 1×: Algoworks)*

==> On AWS there are no servers to watch, so I monitor **logs, metrics, traces and failed
events**:
- **CloudWatch Logs** – every `console.log` from Lambda lands here.
- **CloudWatch Metrics** – `Invocations`, `Errors`, `Duration`, `Throttles`,
  `ConcurrentExecutions`.
- **CloudWatch Alarms** – alert through **SNS** (email / Slack) when errors or duration go up.
- **AWS X-Ray** – trace one request across API Gateway → Lambda → DynamoDB to find the slow part.
- **Dead-letter queue (DLQ)** or **on-failure destination** – failed async events go to SQS so
  nothing is lost.
- **Structured JSON logs** with the request id, so **CloudWatch Logs Insights** can search them.

```js
console.log(JSON.stringify({ level: "error", requestId: context.awsRequestId, msg: "DB timeout" }));
```

In short: CloudWatch (logs, metrics, alarms) + X-Ray (tracing) + DLQ (failed events).

---

12. What is X-Ray tracing?

    *(Asked 1×: TechM)*

==> **AWS X-Ray** follows one request as it moves through several AWS services and shows it as a
**service map** with timings.
- Example: API Gateway → Lambda → DynamoDB → S3; X-Ray shows how many ms each hop took.
- Helps find **slow calls, errors and bottlenecks** in microservice / serverless apps.
- Each request gets a **trace ID**; each hop is a **segment** (sub-calls are **subsegments**).
- In Lambda you just turn on **Active tracing**; wrap SDK clients with the X-Ray SDK (or use
  OpenTelemetry / ADOT) to trace your own calls.

In short: X-Ray = end-to-end request tracing across AWS services, to find where time is spent.

---

13. How do you monitor AWS applications?

    *(Asked 1×: Wipro)*

==>
- **CloudWatch** – logs, metrics, dashboards and alarms (the main tool).
- **X-Ray** – request tracing across services.
- **CloudTrail** – audit log of **who did what** in the AWS account (every API call).
- **Health checks** – ALB target health checks and **Route 53** health checks.
- **Alerts** via **SNS** to email, Slack or PagerDuty.
- Optional third-party tools: Datadog, New Relic, Grafana.

In short: CloudWatch for "how is it running", X-Ray for "where is it slow", CloudTrail for "who
changed what".

---

14. How do you design a highly available AWS architecture?

    *(Asked 1×: Wipro)*

==> **Highly available** = the app keeps working even if one server or one data center
(**Availability Zone**) fails.
1. Run servers in **multiple Availability Zones (Multi-AZ)**.
2. Put an **Application Load Balancer (ALB)** in front; it spreads traffic and skips unhealthy
   targets.
3. Use an **Auto Scaling group** (or ECS service) to add and replace servers automatically.
4. Use **RDS Multi-AZ** (standby in another AZ, automatic failover) or **DynamoDB** (multi-AZ by
   default).
5. Keep servers **stateless**: files in **S3**, sessions in **ElastiCache**, static content via
   **CloudFront**.
6. Use **Route 53** health checks; for disaster recovery keep backups / a replica in another
   **region**.

```text
Users → Route 53 → CloudFront → ALB
                                 ├── EC2/ECS (AZ-1) ─┐
                                 └── EC2/ECS (AZ-2) ─┴→ RDS Multi-AZ (primary + standby)
```

In short: no single point of failure — spread across AZs, load balance, auto scale, Multi-AZ DB.

---

15. What is AWS Secrets Manager?

    *(Asked 1×: Wipro)*

==> **AWS Secrets Manager** stores secrets (DB passwords, API keys, tokens) safely, so they are
not in your code or `.env` file.
- Secrets are **encrypted with KMS**.
- Who can read them is controlled with **IAM**.
- It can **rotate** secrets automatically (e.g. RDS passwords) using a rotation Lambda.
- Cheaper option for plain config: **SSM Parameter Store** (SecureString), but it has no built-in
  rotation.

```js
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
const client = new SecretsManagerClient({});

const res = await client.send(new GetSecretValueCommand({ SecretId: "prod/db" }));
const { username, password } = JSON.parse(res.SecretString);
// username → "admin"
```

Tip: in Lambda, fetch it **outside the handler** (or cache it) so you don't call the API on every
request.

In short: encrypted, IAM-controlled, auto-rotated secrets instead of hard-coded passwords.

---

16. ECS vs EKS

    *(Asked 1×: Wipro)*

==> Both run **Docker containers** on AWS.

```text
+-------------+-----------------------------+-----------------------------------------+
| Feature     | ECS                         | EKS                                     |
+=============+=============================+=========================================+
| What        | AWS's own container service | Managed Kubernetes                      |
+-------------+-----------------------------+-----------------------------------------+
| Ease        | Simple, less to learn       | More complex (needs Kubernetes skills)  |
+-------------+-----------------------------+-----------------------------------------+
| Portability | AWS only                    | Standard Kubernetes (multi-cloud)       |
+-------------+-----------------------------+-----------------------------------------+
| Cost        | No control-plane fee        | Fee per cluster per hour                |
+-------------+-----------------------------+-----------------------------------------+
| Config      | Task definitions, services  | Pods, deployments, YAML manifests       |
+-------------+-----------------------------+-----------------------------------------+
| Best for    | Simple AWS-only apps        | Teams already using Kubernetes          |
+-------------+-----------------------------+-----------------------------------------+
```

Both can run on **EC2** (you manage the instances) or **Fargate** (serverless containers, no
servers to manage). Images usually come from **ECR**.

In short: ECS = simple and AWS-native; EKS = Kubernetes on AWS, more power and more work.

---

17. How does Lambda handle concurrency? How do you check the limits?

    *(Asked 1×: Algoworks)*

==> **Concurrency** = how many requests a function is handling at the same moment.
- Each Lambda instance handles **one request at a time**. For more parallel requests Lambda
  creates more instances.
- Default account limit: **1,000 concurrent executions per region** (a soft quota; you can ask
  to raise it).
- Above the limit, calls are **throttled**: sync calls get **429 `TooManyRequestsException`**,
  async events are retried automatically.
- **Reserved concurrency** – caps one function (and guarantees it that share of the pool).
  Setting it to 0 stops the function.
- **Provisioned concurrency** – keeps instances pre-warmed (no cold starts).

How to check: Lambda console → Configuration → Concurrency, the **Service Quotas** console,
CloudWatch `ConcurrentExecutions` / `Throttles` metrics, or the CLI:

```bash
aws lambda get-account-settings
# "AccountLimit": { "ConcurrentExecutions": 1000, "UnreservedConcurrentExecutions": 1000, ... }

aws lambda put-function-concurrency --function-name myFn --reserved-concurrent-executions 50
```

In short: one request per instance, 1,000 per region by default, throttled above that; control
it with reserved and provisioned concurrency.

---

18. What is Provisioned Concurrency?

    *(Asked 1×: TCS)*

==> **Provisioned Concurrency** keeps a fixed number of Lambda instances **already initialized**
and ready to answer.
- Example: set it to 5 → 5 warm instances, so up to 5 parallel requests never see a cold start.
- Traffic above 5 still scales normally with on-demand instances (those can get cold starts).
- It **costs extra**, because the instances are kept ready all the time.
- It is set on a **version or alias**, not on `$LATEST`.
- Use it for latency-sensitive APIs; schedule it with **Application Auto Scaling** (e.g. more
  during office hours).

```bash
aws lambda put-provisioned-concurrency-config --function-name myFn \
  --qualifier prod --provisioned-concurrent-executions 5
```

In short: pay to keep N instances warm, so there are no cold starts for the first N requests.

---

19. What is SQS? Short polling vs long polling

    *(Asked 1×: Algoworks)*

==> **Amazon SQS** is a fully managed **message queue**: one service puts messages in, another
reads and processes them later.
- **Decouples** services and absorbs traffic spikes (messages wait in the queue).
- **Standard queue** – nearly unlimited throughput, **at-least-once** delivery, order not
  guaranteed.
- **FIFO queue** – strict order, **exactly-once processing** (deduplication), lower throughput.
- **Visibility timeout** – a received message is hidden while it's processed; if it isn't deleted
  in time, it shows up again. After too many failures it goes to a **DLQ**.

```text
+-----------------+--------------------------------+--------------------------------+
| Feature         | Short polling                  | Long polling                   |
+=================+================================+================================+
| How             | Returns at once, even if empty | Waits up to 20 s for a message |
+-----------------+--------------------------------+--------------------------------+
| Empty responses | Many                           | Few                            |
+-----------------+--------------------------------+--------------------------------+
| Cost            | Higher (more API calls)        | Lower                          |
+-----------------+--------------------------------+--------------------------------+
| Setting         | WaitTimeSeconds = 0            | WaitTimeSeconds 1-20           |
+-----------------+--------------------------------+--------------------------------+
```

```js
const res = await sqs.send(new ReceiveMessageCommand({
  QueueUrl: url,
  WaitTimeSeconds: 20,      // long polling
  MaxNumberOfMessages: 10,
}));
```

Interview tip: **long polling** is usually preferred — fewer empty calls, lower cost.

In short: SQS = managed queue; long polling waits for messages instead of asking again and again.

---

20. What is SNS?

    *(Asked 1×: Algoworks)*

==> **Amazon SNS** is a **publish/subscribe (pub/sub)** service: you publish one message to a
**topic**, and every subscriber gets a copy.
- Subscribers: **Lambda, SQS**, email, SMS, HTTP endpoints, mobile push.
- **Push based** (SNS sends to subscribers), while **SQS is pull based** (the consumer polls).
- **Fan-out** pattern: SNS topic → several SQS queues, so each service processes the same event
  on its own.
- **Message filtering** lets a subscriber get only the events it cares about.

```text
"OrderPlaced" → SNS topic ─┬→ SQS (email service)
                           ├→ SQS (inventory service)
                           └→ Lambda (analytics)
```

In short: SNS = one message, many subscribers, pushed instantly.

---

21. What are keys in DynamoDB?

    *(Asked 1×: Hitachi)*

==> Keys uniquely identify each **item** (row) in a **DynamoDB** table.
- **Partition key** (simple primary key) – one attribute, e.g. `userId`; must be unique.
  DynamoDB **hashes** it to decide which partition stores the item.
- **Partition key + Sort key** (composite primary key) – e.g. `userId` + `orderDate`. The pair
  must be unique. Items with the same partition key are stored **sorted** by the sort key, so you
  can query ranges.
- **Secondary indexes** let you query by other attributes:
  - **GSI** (Global Secondary Index) – a different partition and sort key; can be added any time.
  - **LSI** (Local Secondary Index) – same partition key, different sort key; only at table
    creation.

```js
// all orders of user 1 in 2025 (partition key + sort key range)
await doc.send(new QueryCommand({
  TableName: "Orders",
  KeyConditionExpression: "userId = :u AND begins_with(orderDate, :y)",
  ExpressionAttributeValues: { ":u": "1", ":y": "2025" },
}));
```

Tip: pick a partition key with **many distinct values** so traffic spreads evenly (avoid **hot
partitions**).

In short: partition key decides where the item lives; sort key orders items inside it; GSI/LSI
add other query patterns.

---

22. Design an architecture to upload large files (100 MB–GB) to S3 and process them

    *(Asked 1×: Kyndryl)*

==>
1. Client asks the backend for upload permission.
2. Backend returns **pre-signed URLs**. For big files use **S3 multipart upload**: the file is
   split into parts, uploaded in parallel, and only failed parts are retried (required above
   5 GB, recommended above ~100 MB).
3. Client uploads **directly to S3**, so the file never passes through our server.
4. On completion, S3 sends an **`ObjectCreated` event**.
5. The event goes to **SQS** (buffer + retries) → **Lambda** processes it (or **ECS/Fargate** /
   **Step Functions** if it takes over 15 minutes).
6. Save the result/status in the DB and notify the user (SNS / WebSocket).

```text
Client ──(1) get pre-signed URL──> API (Node.js)
Client ──(2) multipart upload────> S3 bucket
S3 ──(3) ObjectCreated event──> SQS ──> Lambda / Fargate ──> DB + notify
```

```js
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: "uploads", Key: "a.mp4" }),
  { expiresIn: 900 }); // client PUTs the file to this URL for 15 minutes
```

Also: add an **S3 lifecycle rule** to abort incomplete multipart uploads (they cost storage).

In short: pre-signed multipart upload straight to S3, then event-driven processing through SQS.

======================================================================================================================================

## What to study first

```
Lambda basics          (what it is, handler, event/context, deploy)
   ↓
Cold start & concurrency   (warm vs cold, reserved/provisioned concurrency)
   ↓
SQS & SNS              (queues and pub/sub to connect services)
   ↓
Step Functions         (chain Lambdas into workflows)
   ↓
S3, DynamoDB, Secrets Manager   (storage, keys, secrets)
   ↓
Monitoring & high availability  (CloudWatch, X-Ray, Multi-AZ, ECS/EKS)
```

Lambda basics are the foundation: cold start, concurrency and deployment all build on how a Lambda
instance runs. SQS/SNS and Step Functions connect Lambdas together, and S3/DynamoDB are what they
read and write. Monitoring and high-availability design come last because they cover the whole
system.
