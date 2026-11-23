# Databases & SQL – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. How do you improve slow query performance? What tools or techniques do you use?
   *(Asked 3×: Algoworks, Deloitte, Interview, no company)*

==> First **find** the slow query, then **fix** it.
    - **Find:** MySQL slow query log, `EXPLAIN` / `EXPLAIN ANALYZE`, APM tools (New Relic, Datadog),
      Performance Schema.
    - **Fix:**
    - Add the right **indexes** (columns in WHERE, JOIN, ORDER BY).
    - Select only needed columns (no `SELECT *`).
    - Use **pagination** (`LIMIT`) for big results.
    - Avoid functions on indexed columns in WHERE (e.g. `WHERE YEAR(created_at) = 2024` can't use
      the index).
    - Fix N+1 queries (one query in a loop) with a JOIN or `IN (...)`.
    - **Cache** frequent reads in Redis.
    - Big data: partitioning, read replicas.

    ```sql
    -- slow: full table scan
    SELECT * FROM orders WHERE customer_id = 42;

    -- fix
    CREATE INDEX idx_orders_customer ON orders(customer_id);
    SELECT id, total, created_at FROM orders WHERE customer_id = 42 LIMIT 50;
    ```

---

2. How do you identify if a query is taking a long time to execute?
   *(Asked 1×: Deloitte)*

==> 
    - Turn on the **slow query log** (logs queries slower than N seconds).
    - Run **`EXPLAIN`** / **`EXPLAIN ANALYZE`** to see the plan and real time.
    - Log query time in the app (e.g. Sequelize `benchmark: true`) or use APM tools.
    - Check `SHOW PROCESSLIST` for queries running right now.

    ```sql
    SET GLOBAL slow_query_log = 'ON';
    SET GLOBAL long_query_time = 1;   -- log queries slower than 1 second

    SHOW FULL PROCESSLIST;            -- what is running now
    ```

---

3. A SQL statement performs poorly in production. How do you find the root cause and fix it?
   *(Asked 1×: Tech Mahindra (YT))*

==> 
    1. **Confirm:** find it in the slow query log / APM and note how slow and how often.
    2. **Explain:** run `EXPLAIN ANALYZE` on it. Look for `type: ALL` (full scan), large `rows`,
       `Using filesort`, `Using temporary`.
    3. **Check the data:** did the table grow? Are stats old (`ANALYZE TABLE`)? Is it locked by
       other queries?
    4. **Fix:** add/adjust an index, rewrite the query (no `SELECT *`, no function on indexed
       column, better JOIN), add pagination or caching.
    5. **Test** on staging with similar data, compare the plan and time.
    6. **Deploy and monitor** to make sure it stays fast.

---

4. What is indexing in a database?
   *(Asked 1×: Deloitte)*

==> An **index** is a separate sorted structure (a B-Tree in MySQL) that helps the DB find rows
    fast, like the index at the back of a book.
    - Without index → DB reads every row (full table scan).
    - With index → DB jumps almost directly to the matching rows.
    - Types: **Primary** (clustered in InnoDB), **Unique**, **Secondary/normal**, **Composite**
      (many columns), **Full-text**.
    - Cost: uses disk space and makes INSERT/UPDATE/DELETE a bit slower, so don't index everything.

    ```sql
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_name_age ON users(name, age);   -- composite
    ```

---

5. A query uses three columns. Do you just add indexes to them, or what is your first step?
   *(Asked 1×: Senior Node.js round (YT))*

==> No. First step: **run `EXPLAIN`** and understand the query.
    1. Check the plan: is it already using an index? How many rows does it scan?
    2. See how the columns are used (equality `=`, range `>`, `ORDER BY`) and how selective they are
       (many unique values or few).
    3. Usually one **composite index** is better than three separate indexes. Put equality columns
       first, range column last.
    4. Check existing indexes so you don't make duplicates; remember indexes slow down writes.
    5. Run `EXPLAIN` again to confirm it improved.

    ```sql
    -- query
    SELECT * FROM users WHERE city = 'Pune' AND status = 'active' AND age > 25;

    -- one composite index (equality columns first, range last)
    CREATE INDEX idx_city_status_age ON users(city, status, age);
    ```

---

6. id is the primary key but you search by name or age. Will the primary index help?
   *(Asked 1×: Senior Node.js round (YT))*

==> **No.** The primary key index is sorted by `id`, so it only helps searches on `id`.
    - `WHERE name = 'Ravi'` → full table scan unless you add an index on `name`.
    - Add a **secondary index** on the column you search (`name`, `age`, or a composite one).
    - In InnoDB, the secondary index stores the primary key, then it looks up the full row by id.

    ```sql
    CREATE INDEX idx_users_name ON users(name);
    EXPLAIN SELECT * FROM users WHERE name = 'Ravi';  -- now uses idx_users_name
    ```

---

7. How do you calculate query cost?
   *(Asked 1×: Deloitte)*

==> You don't calculate it by hand; the **query optimizer estimates it** (based on rows to read,
    index use, disk I/O, CPU, joins and sorting). You read it with:
    - `EXPLAIN FORMAT=JSON` → shows `query_cost`.
    - `EXPLAIN ANALYZE` → shows estimated cost and **actual** time and rows.
    - `SHOW STATUS LIKE 'Last_query_cost';` right after running the query.
    - Lower cost = cheaper query. Use it to compare two versions of a query.

    ```sql
    EXPLAIN FORMAT=JSON SELECT * FROM orders WHERE customer_id = 42;
    -- "cost_info": { "query_cost": "1.20" }
    ```

---

8. What is the query execution plan?
   *(Asked 1×: Senior Node.js round (YT))*

==> The **execution plan** is the step-by-step plan the database chooses to run your query: which
    table first, which index, how to join, how many rows it expects.
    - See it with `EXPLAIN <query>`.
    - Important columns in MySQL:
    - `type` → `ALL` = full scan (bad), `ref`/`range`/`const` = using index (good)
    - `key` → index actually used
    - `rows` → estimated rows to read
    - `Extra` → `Using filesort` / `Using temporary` = extra work

    ```sql
    EXPLAIN SELECT name FROM users WHERE email = 'a@b.com';
    ```

---

9. What is the difference between SQL and NoSQL?
   *(Asked 1×: Algoworks)*

==>
    +--------------+--------------------------------------------+--------------------------------------------+
    |              | SQL (MySQL, PostgreSQL)                    | NoSQL (MongoDB, Redis, DynamoDB)           |
    +==============+============================================+============================================+
    | Data shape   | Tables, rows, fixed schema                 | Documents, key-value, graph; flexible      |
    |              |                                            | schema                                     |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Relations    | JOINs, foreign keys                        | Usually embed data / few joins             |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Transactions | Strong ACID                                | Often eventual consistency (MongoDB does   |
    |              |                                            | support transactions)                      |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Scaling      | Mostly vertical (bigger server); replicas  | Built for horizontal scaling (sharding)    |
    |              | for reads                                  |                                            |
    +--------------+--------------------------------------------+--------------------------------------------+
    | Best for     | Banking, orders, structured data           | Big/fast-changing data, logs, catalogs,    |
    |              |                                            | real-time apps                             |
    +--------------+--------------------------------------------+--------------------------------------------+

    In short: SQL = structure and consistency; NoSQL = flexibility and easy scale-out.

---

10. How do you do horizontal scaling in a database?
   *(Asked 1×: TechM)*

==> Horizontal scaling = add **more servers** instead of a bigger one.
    - **Read replicas:** one primary for writes, many replicas for reads (MySQL replication).
    - **Sharding:** split data across servers by a shard key (e.g. users 1–1M on DB1, rest on DB2).
    - **Partitioning** inside one server helps big tables (not real scale-out, but often paired with
      it).
    - Use distributed DBs that do it for you: MongoDB sharding, Cassandra, DynamoDB, Aurora, Vitess
      for MySQL.
    - Add **caching** (Redis) to reduce DB load.

---

11. Delete duplicate records from a table
   *(Asked 1×: Interview, no company)*

==> Keep one row (smallest `id`) per duplicate group and delete the rest.

    ```sql
    -- Way 1: self join (MySQL)
    DELETE u1
    FROM users u1
    JOIN users u2
      ON u1.email = u2.email
     AND u1.id > u2.id;

    -- Way 2: ROW_NUMBER (MySQL 8+)
    DELETE FROM users
    WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
        FROM users
      ) t
      WHERE rn > 1
    );

    -- find duplicates first
    SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
    ```

    Interview tip: after cleaning, add `UNIQUE(email)` so duplicates can't come back.

---

12. Write a stored procedure
   *(Asked 1×: Interview, no company)*

==> A **stored procedure** is saved SQL code in the database that you run with `CALL`. It can take
    IN/OUT parameters.

    ```sql
    DELIMITER //

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

    CALL GetOrdersByCustomer(42, @total);
    SELECT @total;
    ```

    Benefits: reusable logic, fewer round trips, can grant permission to run it without table
    access.

---

13. MongoDB aggregation and $lookup
   *(Asked 1×: Capsitech)*

==> **Aggregation** = a pipeline of stages that filter, join, group and reshape data (like SQL
    `WHERE`, `JOIN`, `GROUP BY`).
    - `$match` → filter (WHERE)
    - `$lookup` → join another collection (LEFT JOIN)
    - `$unwind` → turn an array into separate documents
    - `$group` → group and sum/count (GROUP BY)
    - `$project` → choose fields, `$sort`, `$limit`

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
    ```

    Interview tip: put `$match` early so fewer documents go through `$lookup`.

---

14. Why do we use Redis?
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> **Redis** is an in-memory key-value store, so it is very fast (sub-millisecond).
    Uses:
    - **Caching** DB/API results to reduce DB load.
    - **Sessions** and refresh tokens / token blacklist.
    - **Rate limiting** counters shared across servers.
    - **Pub/Sub** and queues (BullMQ), leaderboards (sorted sets).

    ```js
    const { createClient } = require('redis');
    const redis = createClient();
    await redis.connect();

    async function getUser(id) {
      const cached = await redis.get(`user:${id}`);
      if (cached) return JSON.parse(cached);              // cache hit

      const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      await redis.set(`user:${id}`, JSON.stringify(user), { EX: 3600 }); // 1 hour
      return user;
    }
    ```

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
