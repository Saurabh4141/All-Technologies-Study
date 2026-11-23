# AWS – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is a cold start? How can you tackle it?
   *(Asked 2×: TCS, TechM)*

==> A cold start is the extra delay when Lambda has no ready instance and must create a new one.
    - It happens on the first call, after the function was idle, or when traffic suddenly grows.
    - During a cold start AWS downloads your code, starts the runtime (Node.js) and runs your init
      code (outside the handler).
    How to reduce it:
    - Use **Provisioned Concurrency** (keeps instances warm).
    - Keep the package small (bundle with esbuild, remove unused libraries).
    - Create DB / SDK clients outside the handler so warm calls reuse them.
    - Give more memory (more memory = more CPU = faster init).
    - Avoid putting Lambda in a VPC unless needed; use a fast runtime like Node.js.

    In short: cold start = new instance setup time; fix it with provisioned concurrency and a small,
    fast init.

---

2. What is a Lambda function?
   *(Asked 1×: TechM)*

==> AWS Lambda is a serverless service: you upload a function and AWS runs it when an event happens.
    - No servers to manage; AWS scales it up and down automatically.
    - Triggers: API Gateway (HTTP), S3 upload, SQS message, schedule (EventBridge), DynamoDB stream,
      etc.
    - You pay only for the number of requests and the run time.
    - Max run time is 15 minutes per call.

---

3. Write a simple Lambda function
   *(Asked 1×: TechM)*

==> A Node.js handler that returns an HTTP response (for API Gateway):

    ```js
    // index.mjs
    export const handler = async (event) => {
      const name = event.queryStringParameters?.name || "World";
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello ${name} from Lambda!` }),
      };
    };
    ```

    - `handler` is the entry point AWS calls.
    - `event` holds the input data; the returned object is the response.

---

4. How are you deploying Lambda functions?
   *(Asked 1×: Algoworks)*

==> Sample answer: "We deploy with Infrastructure as Code through a CI/CD pipeline."
    - Code is pushed to Git → GitHub Actions (or CodePipeline) runs tests → deploys.
    - Tools: **Serverless Framework**, **AWS SAM**, AWS CDK or Terraform.
    - For quick manual updates you can use the AWS CLI.

    ```bash
    # Serverless Framework
    serverless deploy --stage prod

    # AWS CLI (update only the code)
    aws lambda update-function-code --function-name myFunction --zip-file fileb://function.zip
    ```

    Interview tip: say you use separate stages (dev, staging, prod) and versions/aliases for safe
    rollback.

---

5. How many parameters can we pass to a Lambda function?
   *(Asked 1×: TechM)*

==> The handler receives **3 parameters**: `event`, `context`, `callback`.
    - `event` – the input data (you put all your values inside this one object).
    - `context` – info about the run (request id, remaining time, function name).
    - `callback` – old style to return a result; with `async` handlers you just `return` instead.

    ```js
    export const handler = async (event, context) => {
      console.log(context.awsRequestId, context.getRemainingTimeInMillis());
      return { ok: true, input: event };
    };
    ```

    In short: 3 parameters, but any amount of data can go inside `event` (payload limit is 6 MB for
    sync calls).

---

6. How do you call one Lambda function from another?
   *(Asked 1×: TechM)*

==> Use the AWS SDK `Invoke` API from the first Lambda (it needs `lambda:InvokeFunction`
    permission).
    - `InvocationType: "RequestResponse"` = wait for the result (sync).
    - `InvocationType: "Event"` = fire and forget (async).

    ```js
    import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
    const client = new LambdaClient({});

    export const handler = async (event) => {
      const res = await client.send(new InvokeCommand({
        FunctionName: "targetLambda",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ userId: 1 }),
      }));
      return JSON.parse(Buffer.from(res.Payload).toString());
    };
    ```

    Interview tip: for long chains, prefer Step Functions, SQS or SNS instead of direct
    Lambda-to-Lambda calls.

---

7. Cold vs warm Lambda functions
   *(Asked 1×: Algoworks)*

==> Comparison:

    +-----------+---------------------------------------+----------------------------------+
    | Feature   | Cold start                            | Warm start                       |
    +===========+=======================================+==================================+
    | Instance  | New one is created                    | Existing one is reused           |
    +-----------+---------------------------------------+----------------------------------+
    | Init code | Runs again                            | Skipped                          |
    +-----------+---------------------------------------+----------------------------------+
    | Speed     | Slower (extra 100 ms – few seconds)   | Fast                             |
    +-----------+---------------------------------------+----------------------------------+
    | When      | First call, after idle, traffic spike | Calls soon after a previous call |
    +-----------+---------------------------------------+----------------------------------+

    Reduce cold starts: provisioned concurrency, small package, init clients outside the handler.

---

8. What is a Step Function?
   *(Asked 1×: TechM)*

==> AWS Step Functions is a service to build a **workflow** of steps (a state machine).
    - Each step (state) can call a Lambda or another AWS service.
    - It handles order, if/else (Choice), parallel steps, retries, waits and errors for you.
    - The workflow is written in JSON called **Amazon States Language (ASL)**.
    - Example use: order flow → validate → charge payment → send email.

---

9. Write a Step Function config that calls 2 Lambda functions in sequence
   *(Asked 1×: TechM)*

==> In ASL, the first state uses `Next` to point to the second; the last one has `End: true`.

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

---

10. In a Step Function, how is the second function called?
   *(Asked 1×: UST)*

==> Step Functions calls it for you, not the first Lambda.
    - When the first state finishes, the state machine reads its `"Next"` field and moves to that
      state.
    - The **output of the first Lambda becomes the input (`event`) of the second Lambda**.
    - You can shape the data with `InputPath`, `ResultPath` and `OutputPath`.
    - If the first step fails, `Retry` / `Catch` decide what happens instead.

    In short: `"Next": "SecondLambda"` + output of step 1 is passed as input to step 2.

---

11. How do you monitor production in serverless?
   *(Asked 1×: Algoworks)*

==>
    - **CloudWatch Logs** – all `console.log` output of Lambda goes here.
    - **CloudWatch Metrics** – invocations, errors, duration, throttles, concurrent executions.
    - **CloudWatch Alarms** – send alert (SNS → email/Slack) when errors or duration go high.
    - **AWS X-Ray** – trace a request across API Gateway, Lambda, DynamoDB to find slow parts.
    - **Dead-letter queue (DLQ)** – failed async events are kept in SQS to check later.
    - Use structured JSON logs with a request id so logs are easy to search.

---

12. What is X-Ray tracing?
   *(Asked 1×: TechM)*

==> AWS X-Ray follows one request as it moves through many services and shows it as a map with
    timings.
    - Example: API Gateway → Lambda → DynamoDB → S3; X-Ray shows how long each part took.
    - Helps find slow calls, errors and bottlenecks in distributed / microservice apps.
    - In Lambda you just turn on "Active tracing"; use the X-Ray SDK to trace your own calls.

---

13. How do you monitor AWS applications?
   *(Asked 1×: Wipro)*

==>
    - **CloudWatch** – logs, metrics, dashboards and alarms (main tool).
    - **X-Ray** – request tracing across services.
    - **CloudTrail** – audit log of who did what in the AWS account (API calls).
    - **Health checks** – load balancer / Route 53 health checks.
    - Alerts via **SNS** to email, Slack or PagerDuty.
    - Optional third-party tools: Datadog, New Relic, Grafana.

---

14. How do you design a highly available AWS architecture?
   *(Asked 1×: Wipro)*

==> Highly available = the app keeps working even if one server or one data center fails.
    1. Run servers in **multiple Availability Zones (Multi-AZ)**.
    2. Put an **Application Load Balancer** in front to spread traffic and skip unhealthy servers.
    3. Use **Auto Scaling** to add/replace servers automatically.
    4. Use a **Multi-AZ database** (RDS Multi-AZ) or DynamoDB.
    5. Store files in **S3**, serve static content with **CloudFront**.
    6. Use **Route 53** health checks; for disaster recovery, keep backups in another region.

    ```
    Users → Route 53 → CloudFront → ALB
                                     ├── EC2/ECS (AZ-1) ─┐
                                     └── EC2/ECS (AZ-2) ─┴→ RDS Multi-AZ (primary + standby)
    ```

---

15. What is AWS Secrets Manager?
   *(Asked 1×: Wipro)*

==> A service to store secrets (DB passwords, API keys, tokens) safely instead of putting them in
    code or `.env`.
    - Secrets are encrypted with KMS.
    - Access is controlled with IAM.
    - Can **rotate** secrets automatically (e.g. RDS password).

    ```js
    import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
    const client = new SecretsManagerClient({});

    const res = await client.send(new GetSecretValueCommand({ SecretId: "prod/db" }));
    const { username, password } = JSON.parse(res.SecretString);
    ```

---

16. ECS vs EKS
   *(Asked 1×: Wipro)*

==> Both run Docker containers on AWS.

    +-------------+-----------------------------+-----------------------------------------+
    | Feature     | ECS                         | EKS                                     |
    +=============+=============================+=========================================+
    | What        | AWS's own container service | Managed Kubernetes                      |
    +-------------+-----------------------------+-----------------------------------------+
    | Ease        | Simple, less to learn       | More complex (Kubernetes knowledge)     |
    +-------------+-----------------------------+-----------------------------------------+
    | Portability | AWS only                    | Works like any Kubernetes (multi-cloud) |
    +-------------+-----------------------------+-----------------------------------------+
    | Cost        | No control-plane fee        | Pays per cluster per hour               |
    +-------------+-----------------------------+-----------------------------------------+
    | Best for    | Simple AWS-only apps        | Teams already using Kubernetes          |
    +-------------+-----------------------------+-----------------------------------------+

    Both can run on EC2 or on **Fargate** (serverless containers, no servers to manage).

---

17. How does Lambda handle concurrency? How do you check the limits?
   *(Asked 1×: Algoworks)*

==> Concurrency = number of requests a function is handling at the same moment.
    - Each instance handles **one request at a time**; for more parallel requests Lambda creates
      more instances.
    - Default account limit: **1000 concurrent executions per region** (soft limit, can be raised).
    - Above the limit, requests are **throttled** (429 error; async events are retried).
    - **Reserved concurrency** – sets a max (and guaranteed share) for one function.
    - **Provisioned concurrency** – keeps instances pre-warmed.
    How to check: Lambda console → Configuration → Concurrency, Service Quotas console, CloudWatch
    `ConcurrentExecutions` / `Throttles` metrics, or:

    ```bash
    aws lambda get-account-settings
    ```

---

18. What is Provisioned Concurrency?
   *(Asked 1×: TCS)*

==> Provisioned Concurrency keeps a fixed number of Lambda instances already started and ready.
    - Example: set it to 5 → AWS keeps 5 warm instances, so the first 5 parallel requests have no
      cold start.
    - Extra traffic above 5 still scales normally (those may get cold starts).
    - It costs extra because instances are kept ready all the time.
    - Use it for latency-sensitive APIs; can be scheduled with Application Auto Scaling.

---

19. What is SQS? Short polling vs long polling
   *(Asked 1×: Algoworks)*

==> Amazon SQS is a fully managed **message queue**: one service puts messages, another reads and
    processes them later.
    - Decouples services and handles traffic spikes.
    - Types: **Standard** (very high throughput, at-least-once, order not guaranteed) and **FIFO**
      (exact order, exactly-once processing).

    +-----------------+--------------------------------+--------------------------------+
    | Feature         | Short polling                  | Long polling                   |
    +=================+================================+================================+
    | How             | Returns at once, even if empty | Waits up to 20 s for a message |
    +-----------------+--------------------------------+--------------------------------+
    | Empty responses | Many                           | Few                            |
    +-----------------+--------------------------------+--------------------------------+
    | Cost            | Higher (more API calls)        | Lower                          |
    +-----------------+--------------------------------+--------------------------------+
    | Setting         | `WaitTimeSeconds = 0`          | `WaitTimeSeconds` 1–20         |
    +-----------------+--------------------------------+--------------------------------+

    Interview tip: long polling is usually preferred.

---

20. What is SNS?
   *(Asked 1×: Algoworks)*

==> Amazon SNS is a **publish/subscribe (pub/sub)** service: publish one message to a topic, and all
    subscribers get it.
    - Subscribers: Lambda, SQS, email, SMS, HTTP endpoints, mobile push.
    - Push based (SNS sends to subscribers), while SQS is pull based (consumer polls).
    - Common pattern **fan-out**: SNS topic → many SQS queues, each service processes the same
      event.

---

21. What are keys in DynamoDB?
   *(Asked 1×: Hitachi)*

==> Keys uniquely identify each item (row) in a DynamoDB table.
    - **Partition key** (simple primary key) – one attribute, e.g. `userId`. Must be unique.
      DynamoDB hashes it to choose the storage partition.
    - **Partition key + Sort key** (composite primary key) – e.g. `userId` + `orderDate`. The pair
      must be unique; items with the same partition key are sorted by the sort key, so you can query
      ranges.
    - **Secondary indexes** let you query by other attributes:
    - GSI (Global Secondary Index) – different partition and sort key, can be added anytime.
    - LSI (Local Secondary Index) – same partition key, different sort key, created with the table.

---

22. Design an architecture to upload large files (100 MB–GB) to S3 and process them
   *(Asked 1×: Kyndryl)*

==>
    1. Client asks the backend for upload permission.
    2. Backend returns **pre-signed URLs** (for big files use **multipart upload**: file split into
       parts, uploaded in parallel, retry only failed parts).
    3. Client uploads **directly to S3** (file does not pass through our server).
    4. S3 sends an **event** when the upload completes.
    5. Event goes to **SQS** (buffer + retries) → **Lambda** processes it (or ECS/Fargate / Step
       Functions if it takes over 15 min).
    6. Save result/status in DB and notify the user (SNS / WebSocket).

    ```
    Client ──(1) get pre-signed URL──> API (Node.js)
    Client ──(2) multipart upload────> S3 bucket
    S3 ──(3) ObjectCreated event──> SQS ──> Lambda / Fargate ──> DB + notify
    ```

    In short: pre-signed multipart upload direct to S3, then event-driven processing.

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
