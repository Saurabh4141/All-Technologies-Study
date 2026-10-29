# Kyndryl – L1 Interview

**Topics:** TypeScript, Node.js concurrency, S3 large-file upload, React state, Redux caching, CI/CD, testing, async/await

---

## TypeScript & Node.js

### 1. What is the difference between `unknown` and `any` in TypeScript?

**Answer:**
- `any`: disables type checking completely.
  - You can perform any operation without errors.
- `unknown`: safer alternative to `any`.
  - You must perform type checking before using the value.

**Example:**
```ts
let a: any = 10;
a.toUpperCase(); // No error

let b: unknown = 10;
b.toUpperCase(); // Error (must check type first)
```

=====================================================================================================================

### 2. How does Node.js handle concurrency despite being single-threaded?

**Answer:**
- Uses an event loop and non-blocking I/O.
- Delegates heavy operations to:
  - thread pool (via `libuv`)
  - OS kernel
- Executes callbacks asynchronously when tasks complete.

=====================================================================================================================

## Architecture

### 3. How would you design an architecture to upload large files (100MB–GB) to S3 and process them?

**Answer:**
**Recommended architecture:**
1. UI requests a pre-signed URL from backend.
2. File uploads directly to S3 (avoids backend load).
3. S3 triggers an event.
4. Event invokes AWS Lambda.
5. Lambda processes the file.
6. Result is stored in a database.

**Benefits:**
- Scalable
- Secure
- Efficient for large files

=====================================================================================================================

## React

### 4. In React, how do you share state between components without a common parent?

**Answer:**
Options include:
- React Context API
- State management libraries (`Redux`, `Zustand`)
- Event emitters (less common)

**Best practice:** use Context API or Redux.

=====================================================================================================================

### 5. How do you cache API responses in Redux?

**Answer:**
- Store API response in Redux state.
- Before making an API call, check if data already exists.
- Optionally:
  - add timestamps
  - implement cache invalidation logic

=====================================================================================================================

## CI/CD & Testing

### 6. What steps do you include in a CI/CD pipeline?

**Answer:**
Typical pipeline steps:
1. Code commit (Git)
2. Build
3. Linting & static analysis
4. Unit tests
5. Integration tests
6. Artifact creation
7. Deployment (staging → production)
8. Monitoring & rollback strategy

=====================================================================================================================

### 7. What is your testing approach? TDD or after coding?

**Answer:**
Two approaches:
- TDD (Test-Driven Development): write tests first, then code.
- Post-development testing: write code first, then tests.

**Preferred:** TDD for critical logic, otherwise a hybrid approach.

=====================================================================================================================

## Async/Await & Output

### 8. Can we use `try...catch` with `async/await`?

**Answer:**
✅ Yes, absolutely.

**Example:**
```ts
async function test() {
  try {
    const res = await fetchData();
  } catch (err) {
    console.error(err);
  }
}
```

=====================================================================================================================

### 9. What is the use of `async` and `await`?

**Answer:**
- Simplifies working with Promises.
- Makes asynchronous code look synchronous.
- Improves readability and error handling.

=====================================================================================================================

### 10. What will be the output of the following code?

```js
Promise.resolve(1)
  .then(val => {
    console.log(val);
    return val * 2;
  })
  .then(val => {
    console.log(val);
    throw new Error('oops');
  })
  .catch(err => {
    console.log(err.message);
    return 10;
  })
  .then(val => console.log(val));
```

**Answer:**
```
1
2
oops
10
```

**Explanation:**
- First `.then`: logs `1`, returns `2`
- Second `.then`: logs `2`, throws error
- `.catch`: logs `oops`, returns `10`
- Final `.then`: logs `10`

=====================================================================================================================
