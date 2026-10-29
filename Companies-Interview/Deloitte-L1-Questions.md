# Deloitte – L1 Interview

**Topics:** Node.js performance, async handling, Promise methods, query optimization, indexing, query cost

---

## Node.js

### 1. How can you improve Node.js application performance?

**Answer:**

- Use Asynchronous Programming to avoid blocking the event loop.
- Implement Clustering to utilize multi-core CPUs.
- Use Caching (Redis or in-memory cache) to reduce database load.
- Optimize database queries and avoid unnecessary joins.
- Use Streams for handling large files instead of loading them fully into memory.
- Enable Gzip Compression to reduce response payload size.
- Use a process manager like PM2 for load balancing and monitoring.
- Monitor performance using profiling tools and logging.

=====================================================================================================================

### 2. How do you handle asynchronous operations in Node.js?

**Answer:**

- Callbacks – Basic async handling method.
- Promises – Provides better readability and error handling.
- Async/Await – Built on top of Promises; cleaner and more readable.
- Event Emitters – Used for handling custom events.
- Streams – For processing large data efficiently.

=====================================================================================================================

### 3. What is the difference between Promise methods?

**Answer:**

- **Promise.all()** – Runs multiple promises in parallel. Fails if any one promise fails.
- **Promise.allSettled()** – Waits for all promises to complete (success or failure).
- **Promise.race()** – Returns the result of the first settled promise.
- **Promise.any()** – Returns the first fulfilled promise. Fails only if all fail.
- **Promise.resolve()** – Returns a resolved promise.
- **Promise.reject()** – Returns a rejected promise.

=====================================================================================================================

## Database

### 4. How do you identify if a query is taking a long time to execute?

**Answer:**

- Use EXPLAIN or EXPLAIN ANALYZE to check execution plans.
- Enable Slow Query Log in the database.
- Monitor query execution time through logs.
- Use profiling and monitoring tools.
- Check if proper indexing is used.

=====================================================================================================================

### 5. How do you improve query performance?

**Answer:**

- Add proper Indexes on frequently searched columns.
- Avoid using SELECT *; fetch only required columns.
- Use Pagination (LIMIT) to restrict result size.
- Optimize joins and avoid unnecessary subqueries.
- Normalize or denormalize tables as required.
- Use caching mechanisms.
- Analyze the query execution plan.

=====================================================================================================================

### 6. What is Indexing in a Database?

**Answer:**

- Indexing is a technique used to improve the speed of data retrieval operations.
- It works like an index in a book.
- Instead of scanning the entire table, the database searches through the index.
- Types: Primary Index, Secondary Index, Composite Index, Unique Index.
- Advantage: Faster SELECT queries.
- Disadvantage: Slightly slower INSERT and UPDATE operations due to index maintenance.

=====================================================================================================================

### 7. How do you calculate query cost?

**Answer:**

- Query cost is estimated by the database optimizer based on:
  - Number of rows scanned
  - Index usage
  - Join complexity
  - Disk I/O operations
  - CPU usage
- Lower cost generally indicates better performance.

=====================================================================================================================
