# Databases & SQL – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

##### 1. How do you improve slow query performance? What tools or techniques do you use?

*(Asked 3×: Algoworks, Deloitte, Interview, no company)*

==> Two steps: first **find** the slow query, then **fix** it.

**Find it:**
- **Slow query log** – logs every query slower than a set time.
- **`EXPLAIN` / `EXPLAIN ANALYZE`** – shows the plan and the real time.
- **Monitoring tools** – show the top slow queries in production.

**Fix it:**
- Add the right **index** (columns used in `WHERE`, `JOIN`, `ORDER BY`).
- Select only the columns you need – no `SELECT *`.
- **Paginate** big results with `LIMIT`.
- Don't wrap an indexed column in a function: `WHERE YEAR(created_at) = 2024` can't use the
  index; `WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'` can.
- Fix **N+1 queries** (a query inside a loop) with one `JOIN` or `IN (...)`.
- **Cache** hot reads.
- Very big tables: **partitioning**, **read replicas**.

```sql
-- slow: full table scan (EXPLAIN shows no index used)
SELECT * FROM orders WHERE customer_id = 42;

-- fix: index + only needed columns + limit
CREATE INDEX idx_orders_customer ON orders(customer_id);
SELECT id, total, created_at FROM orders WHERE customer_id = 42 LIMIT 50;
-- EXPLAIN now shows an index lookup on idx_orders_customer
```

In short: measure with the slow log and EXPLAIN, then fix with indexes, leaner queries and caching.

---

##### 2. How do you identify if a query is taking a long time to execute?

*(Asked 1×: Deloitte)*

==> Four quick ways:
- **Slow query log** – turn it on and it records every query slower than N seconds.
- **Running-queries list** – the database's process/activity list shows queries running *right
  now* and how long they have been running.
- **`EXPLAIN ANALYZE`** – runs the query and shows **actual** time and rows per step.
- **App side** – log how long each query takes, or use a monitoring tool.

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;
-- shows each step with its actual time and row count
```

In short: slow query log for history, the running-queries list for now, EXPLAIN ANALYZE for the
why.

---

##### 3. A SQL statement performs poorly in production. How do you find the root cause and fix it?

*(Asked 1×: Tech Mahindra (YT))*

==> My step-by-step approach:
1. **Confirm** – find it in the slow query log / monitoring. How slow? How often does it run?
2. **Explain** – run `EXPLAIN ANALYZE`. Red flags: a full table scan, a huge rows estimate, an
   extra sort or a temporary table.
3. **Check the data** – did the table grow a lot? Are the table statistics stale? Is the query
   waiting on **locks** from other transactions?
4. **Fix** – add or adjust an index, rewrite the query (no `SELECT *`, no function on an indexed
   column, better `JOIN`), add pagination or caching.
5. **Test** – on staging with production-like data; compare plan and time before/after.
6. **Deploy and monitor** – make sure it stays fast.

In short: confirm → explain → check data and locks → fix → test → monitor.

---

##### 4. What is indexing in a database?

*(Asked 1×: Deloitte)*

==> An **index** is a separate sorted structure that lets the database find rows **without
reading the whole table** – like the index at the back of a book.
- No index → **full table scan** (reads every row).
- With index → jumps almost straight to the matching rows.
- Most indexes are **B-Trees** (sorted trees), so a lookup takes a few steps instead of a scan.
- Main types:
  - **Primary key** – created automatically on the primary key column.
  - **Unique** – also blocks duplicate values.
  - **Secondary** (normal) – on any column you search by.
  - **Composite** – on several columns, e.g. `(name, age)`.
  - **Full-text** – for word search in text.
- **Cost:** extra disk space and slower `INSERT` / `UPDATE` / `DELETE`, so don't index every column.

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name_age ON users(name, age);   -- composite
```

In short: an index trades some write speed and disk for much faster reads.

---

##### 5. A query uses three columns. Do you just add indexes to them, or what is your first step?

*(Asked 1×: Senior Node.js round (YT))*

==> No. My first step is to **run `EXPLAIN`** and understand the query.
1. Check the plan – is an index already used? How many rows are scanned?
2. See **how** each column is used: equality (`=`), range (`>`, `BETWEEN`), or `ORDER BY`, and how
   **selective** it is (many distinct values or few).
3. Usually **one composite index** beats three single-column ones. Order: **equality columns
   first, range column last** (columns after a range column in the index can't be used to
   narrow the search).
4. Check existing indexes to avoid duplicates – every index slows down writes.
5. Run `EXPLAIN` again to confirm the improvement.

```sql
SELECT * FROM users WHERE city = 'Pune' AND status = 'active' AND age > 25;

-- one composite index: equality first, range last
CREATE INDEX idx_city_status_age ON users(city, status, age);
```

In short: EXPLAIN first, then usually one well-ordered composite index.

---

##### 6. id is the primary key but you search by name or age. Will the primary index help?

*(Asked 1×: Senior Node.js round (YT))*

==> **No.** The primary key index is sorted by `id`, so it only helps lookups on `id`.
- `WHERE name = 'Ravi'` → **full table scan** unless `name` has its own index.
- Add a **secondary index** on the column you search (`name`, `age`, or a composite).
```sql
CREATE INDEX idx_users_name ON users(name);
EXPLAIN SELECT * FROM users WHERE name = 'Ravi';
-- before: full table scan, no index used
-- after:  index lookup using idx_users_name
```

In short: an index only helps the columns it is built on.

---

##### 7. How do you calculate query cost?

*(Asked 1×: Deloitte)*

==> You don't calculate it by hand – the **query optimizer estimates** it from rows to read,
index use, disk I/O, CPU, joins and sorting. You can read the number:
- **`EXPLAIN`** → the plan shows the **estimated cost** of each step and of the whole query.
- **`EXPLAIN ANALYZE`** → estimated cost plus **actual** time and rows.
- The cost is a relative number – lower is cheaper. Use it to **compare** two versions of a query.

```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
-- plan output includes an estimated cost, e.g. cost = 1.20
```

In short: the optimizer gives the cost; EXPLAIN shows it so you can compare queries.

---

##### 8. What is the query execution plan?

*(Asked 1×: Senior Node.js round (YT))*

==> The **execution plan** is the step-by-step route the database picks to run your query: which
table first, which index, how to join, and how many rows it expects.
- See it with `EXPLAIN <query>` (or `EXPLAIN ANALYZE` for real timings).
- What to look for:
  - **Access type** → full table scan (bad) or index lookup / index range (good).
  - **Index used** → the index the database actually picked.
  - **Rows** → estimated rows to read.
  - **Extra work** → an extra sort or temporary table is costly; reading only from the index
    (covering index) is best.

```sql
EXPLAIN SELECT name FROM users WHERE email = 'a@b.com';
-- plan: index lookup on users using idx_users_email, estimated rows = 1
```

In short: the plan tells you whether the database uses an index or scans everything.

---

##### 9. What is the difference between SQL and NoSQL?

*(Asked 1×: Algoworks)*

==>
```text
+--------------+------------------------------------+------------------------------------+
|              | SQL                                | NoSQL                              |
+==============+====================================+====================================+
| Data shape   | Tables, rows, fixed schema         | Documents, key-value, graph;       |
|              |                                    | flexible schema                    |
+--------------+------------------------------------+------------------------------------+
| Relations    | JOINs, foreign keys                | Embed data; few or no joins        |
+--------------+------------------------------------+------------------------------------+
| Transactions | Strong ACID                        | Often eventual consistency         |
+--------------+------------------------------------+------------------------------------+
| Query        | SQL language                       | DB-specific API                    |
+--------------+------------------------------------+------------------------------------+
| Scaling      | Mostly vertical; read replicas     | Built for horizontal scaling       |
|              |                                    | (sharding)                         |
+--------------+------------------------------------+------------------------------------+
```

Same data, two shapes:

```sql
-- SQL: two tables + JOIN
SELECT u.name, o.total FROM users u JOIN orders o ON o.user_id = u.id;
```

```js
// NoSQL (document database): one document with orders embedded
{ _id: 1, name: 'Ravi', orders: [{ total: 500 }, { total: 250 }] }
```

In short: SQL = structure and consistency; NoSQL = flexibility and easy scale-out.

---

##### 10. How do you do horizontal scaling in a database?

*(Asked 1×: TechM)*

==> Horizontal scaling = add **more database servers** instead of a bigger one.
- **Read replicas** – one **primary** takes writes, **replicas** copy it and serve reads. Good
  when reads ≫ writes. Replicas can lag a little behind.
- **Sharding** – split rows across servers by a **shard key** (e.g. `user_id % 4` decides the
  server). Each shard holds part of the data, so writes scale too.

In short: replicas scale reads, sharding scales reads and writes.

---

##### 11. Delete duplicate records from a table

*(Asked 1×: Interview, no company)*

==> Keep one row per duplicate group (the smallest `id`) and delete the rest.

Sample data:

```text
+----+-------------+
| id | email       |
+====+=============+
| 1  | a@x.com     |
| 2  | b@x.com     |
| 3  | a@x.com     |   <- duplicate, delete
+----+-------------+
```

```sql
-- 1) find duplicates first
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
-- a@x.com | 2

-- 2) number the rows in each email group and delete all but the first
DELETE FROM users
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
  ) t
  WHERE rn > 1
);                           -- deletes id 3, keeps id 1
```

In short: find with GROUP BY + HAVING, then delete every row except the first in each group.

---

##### 12. Write a stored procedure

*(Asked 1×: Interview, no company)*

==> A **stored procedure** is named SQL code saved **inside the database**. You run it with `CALL`
(MySQL). It can take **IN**, **OUT** and **INOUT** parameters.

```sql
DELIMITER //   -- so the ; inside the body doesn't end the CREATE statement

CREATE PROCEDURE GetOrdersByCustomer(IN p_customer_id INT, OUT p_total DECIMAL(10,2))
BEGIN
  SELECT id, amount, created_at
  FROM orders
  WHERE customer_id = p_customer_id;

  SELECT COALESCE(SUM(amount), 0) INTO p_total
  FROM orders
  WHERE customer_id = p_customer_id;
END //

DELIMITER ;

CALL GetOrdersByCustomer(42, @total);   -- returns the customer's orders
SELECT @total;                          -- e.g. 1250.00
```

In short: saved, parameterised SQL you run with CALL.

---

##### 13. MongoDB aggregation and $lookup

*(Asked 1×: Capsitech)*

==> **Aggregation** = a **pipeline of stages**; each stage takes documents, changes them, and
passes them on. Think of it as SQL `WHERE` → `JOIN` → `GROUP BY` → `ORDER BY`.
- **`$match`** → filter (like `WHERE`)
- **`$lookup`** → join another collection (like `LEFT JOIN`); result is an **array**
- **`$unwind`** → turn that array into one document per element
- **`$group`** → group and `$sum` / `$avg` / `$count` (like `GROUP BY`)
- **`$project`** → pick or rename fields; **`$sort`**, **`$limit`**

```js
db.orders.aggregate([
  { $match: { status: 'paid' } },
  { $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
  } },
  { $unwind: '$user' },
  { $group: { _id: '$user.name', totalSpent: { $sum: '$amount' } } },
  { $sort: { totalSpent: -1 } }
]);
// Output:
// [ { _id: 'Ravi', totalSpent: 4200 }, { _id: 'Asha', totalSpent: 1800 } ]
```

In short: aggregation is a stage-by-stage pipeline; $lookup is MongoDB's LEFT JOIN.

---

##### 14. Why do we use Redis?

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> **Redis** is an **in-memory key-value store** – data lives in RAM, so reads/writes take well
under a millisecond.

Common uses:
- **Caching** DB/API results to take load off the main database.
- **Sessions**, refresh tokens, token blacklist (with **TTL** so keys expire on their own).
- **Rate limiting** – counters shared by all app servers (`INCR` + `EXPIRE`).
- **Pub/Sub** and **queues**, **leaderboards** with sorted sets.

```js
const { createClient } = require('redis');
const redis = createClient();
await redis.connect();

async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);              // cache hit – no DB call

  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  await redis.set(`user:${id}`, JSON.stringify(user), { EX: 3600 }); // expire in 1 hour
  return user;
}
```

In short: Redis = super-fast shared memory for caching, sessions, rate limits and queues.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

##### 15. What is the N+1 query problem and how do you fix it?

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> You run **1 query** to get a list, then **1 more query for each item**. 100 posts = 101
queries – slow because of all the round trips.
- Very common with ORMs, when related data is loaded inside a loop.

```js
// N+1: 1 query for posts + 1 query per post
const posts = await db.query('SELECT * FROM posts');
for (const p of posts) {
  p.author = await db.query('SELECT * FROM users WHERE id = ?', [p.user_id]);
}
```

Fixes:
1. **Eager loading / JOIN** – load posts and authors in one query with a `JOIN`.
2. **Batch** – collect the ids, run one `WHERE id IN (...)`, then map results back.

```sql
-- what the fix runs instead of 101 queries
SELECT p.*, u.name FROM posts p JOIN users u ON u.id = p.user_id;
```

In short: replace many small queries with one JOIN or one batched IN query.

---

##### 16. Redis vs in-memory cache; what is the cache-aside pattern and cache invalidation?

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF, Ajeet Yadav Node.js revision PDF)*

==> Both keep hot data in RAM so you hit the database less. The difference is **where** that
memory lives.

```text
+-----------------------+------------------------------------+------------------------------------+
| Point                 | In-memory                          | Redis                              |
+=======================+====================================+====================================+
| Where                 | Inside the app process             | Separate server                    |
+-----------------------+------------------------------------+------------------------------------+
| Speed                 | Fastest (no network)               | Very fast (small network hop)      |
+-----------------------+------------------------------------+------------------------------------+
| Shared across servers | No - each instance has its own     | Yes - all instances share it       |
+-----------------------+------------------------------------+------------------------------------+
| Survives restart      | No                                 | Can (RDB / AOF persistence)        |
+-----------------------+------------------------------------+------------------------------------+
| Extras                | None                               | TTL, data structures, pub/sub      |
+-----------------------+------------------------------------+------------------------------------+
```

**Cache-aside** (lazy loading) – the app manages the cache:
1. Read from cache.
2. **Hit** → return it.
3. **Miss** → read from DB, save to cache with a **TTL**, return it.

```js
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);                     // hit

  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]); // miss -> DB
  await redis.set(`user:${id}`, JSON.stringify(user), { EX: 300 }); // 5 min TTL
  return user;
}
```

**Cache invalidation** (keep cache in sync with DB):
- **TTL** – stale data expires on its own.
- **Delete on write** – on update/delete, remove the key (`await redis.del('user:1')`) so the next
  read reloads fresh data.

In short: in-memory for one instance, Redis for many; cache-aside = cache → else DB → fill cache;
invalidate with TTL plus delete-on-write.

---

##### 17. MongoDB: when do you embed and when do you reference? (populate)

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> **Embed** = put related data inside the same document. **Reference** = store only the other
document's `_id` and look it up when needed.
- **Embed** when data is read together, it's **one-to-few** (e.g. a user's addresses), and it
  won't grow without limit.
- **Reference** when it's **one-to-many / many-to-many** with large or growing data (user →
  orders, post → thousands of comments), shared by many documents, or updated on its own.
- A MongoDB document has a **16 MB limit**, so never embed an unbounded array.
- Mongoose **`populate()`** swaps a referenced `_id` for the real document (it runs an extra
  query behind the scenes).

```js
const postSchema = new mongoose.Schema({
  title: String,
  tags: [String],                                                // embedded
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // reference
});

const post = await Post.findById(id).populate('author', 'name email');
// Output: { title: 'Hello', tags: ['db'], author: { _id: ..., name: 'Ravi', email: 'r@x.com' } }
```

In short: embed small data you read together; reference big, growing or shared data and populate it.

---

##### 18. What is Mongoose? (schema, model, validation)

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> **Mongoose** is an **ODM** (Object Data Modeling) library for using MongoDB from Node.js.
MongoDB itself is schema-less; Mongoose adds structure on top.
- **Schema** – defines fields, types, defaults and rules.
- **Model** – a class built from a schema; you use it for CRUD (`User.find()`, `User.create()`).
- **Validation** – built-in `required`, `min`, `max`, `enum`, `match`, plus custom validators.
  Note: `unique` is **not** a validator – it creates a unique **index** in MongoDB.
- **Extras** – middleware/hooks (`pre('save')`), virtuals, `populate`, timestamps, type casting.

```js
const userSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age:   { type: Number, min: 18 },
  role:  { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

await User.create({ name: 'Saurabh', email: 'S@x.com', age: 25 });
// saved as email: 's@x.com', role: 'user', plus createdAt / updatedAt

await User.create({ name: 'Kid', email: 'k@x.com', age: 12 });
// ValidationError: Path `age` (12) is less than minimum allowed value (18).
```

Validation runs on `save()` / `create()` by default; for `updateOne` /
`findOneAndUpdate` pass `{ runValidators: true }`.

In short: Mongoose gives MongoDB schemas, models, validation and helpers like populate and hooks.

======================================================================================================================================

## What to study first

```
SQL vs NoSQL                     (know which database fits which job)
   ↓
Indexing                         (the #1 tool for speed)
   ↓
Query execution plan & cost      (EXPLAIN shows if indexes are used)
   ↓
Query optimization               (find slow queries and fix them)
   ↓
Writing SQL                      (duplicates, stored procedures)
   ↓
MongoDB aggregation, Redis       (NoSQL joins and caching)
   ↓
Scaling, replication & partitioning
```

Indexing and the execution plan are the foundation: almost every "slow query" answer is "run
EXPLAIN, then fix the index".
Query optimization builds on both. Redis caching and horizontal scaling are the next step when one
well-tuned database is not enough.
