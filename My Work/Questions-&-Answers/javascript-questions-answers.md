# JavaScript – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What are Promises? What is the use of async and await?
   *(Asked 5×: Algoworks, TCS (online), Hyland Software, Kyndryl, Capsitech)*

==> A **Promise** is an object for a value that will come later (or fail). It is like a token: "I
    will give you the result when it is ready."
    - It has 3 states: pending, fulfilled, rejected.
    - You read the result with `.then()` and handle errors with `.catch()`.
    - **async/await** is a cleaner way to use Promises. `async` makes a function return a Promise.
      `await` pauses inside that function until the Promise settles, so async code reads like normal
      top-to-bottom code.

    ```js
    // Promise style
    fetchUser().then(user => console.log(user)).catch(err => console.error(err));

    // async/await style
    async function show() {
      try {
        const user = await fetchUser();
        console.log(user);
      } catch (err) {
        console.error(err);
      }
    }
    ```

    In short: Promises avoid callback hell; async/await makes Promise code easy to read.

---

2. Output: Promise.resolve(1) .then(+1) .then(throw) .catch(() => 1) .then(+1) .then(log)
   *(Asked 2×: Algoworks, Irpgrammer Solutions)*

==> Code (from the interview):

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

    Why:
    - `1` → first `.then` gives `2`.
    - Next `.then` throws, so the chain jumps to `.catch`.
    - `.catch` returns `1`, so the chain is "fixed" and continues with `1`.
    - `1 + 1 = 2` → printed. The last `.catch` never runs.

---

3. What is the difference between var, let and const?
   *(Asked 2×: TCS (online), Capsitech)*

==>
    +----------------------------------+-------------------------+---------------------------------------+-----------------+
    |                                  | `var`                   | `let`                                 | `const`         |
    +==================================+=========================+=======================================+=================+
    | Scope                            | Function                | Block `{}`                            | Block `{}`      |
    +----------------------------------+-------------------------+---------------------------------------+-----------------+
    | Re-declare in same scope         | Yes                     | No                                    | No              |
    +----------------------------------+-------------------------+---------------------------------------+-----------------+
    | Re-assign                        | Yes                     | Yes                                   | No              |
    +----------------------------------+-------------------------+---------------------------------------+-----------------+
    | Hoisted                          | Yes, set to `undefined` | Yes, but in TDZ (error if used early) | Yes, but in TDZ |
    +----------------------------------+-------------------------+---------------------------------------+-----------------+
    | Must give a value at declaration | No                      | No                                    | Yes             |
    +----------------------------------+-------------------------+---------------------------------------+-----------------+

    ```js
    if (true) { var a = 1; let b = 2; }
    console.log(a); // 1
    console.log(b); // ReferenceError

    const obj = { x: 1 };
    obj.x = 2;      // allowed (object content can change)
    // obj = {};    // TypeError (cannot re-assign)
    ```

    Interview tip: use `const` by default, `let` when the value changes, avoid `var`.

---

4. What are the different types of functions in JavaScript?
   *(Asked 2×: Fundwave, Capsitech)*

==>
    - **Function declaration**: `function add(a, b) { return a + b; }` (hoisted, can call before it
      is written).
    - **Function expression**: `const add = function (a, b) { return a + b; };` (not hoisted).
    - **Arrow function**: `const add = (a, b) => a + b;` (short; no own `this` or `arguments`).
    - **Anonymous function**: a function with no name, e.g. passed as a callback.
    - **IIFE** (Immediately Invoked Function Expression): runs right away: `(function () { ...
      })();`
    - **Callback function**: a function passed to another function to call later.
    - **Higher-order function**: takes or returns a function (e.g. `map`, `filter`).
    - **Constructor function**: used with `new` to create objects.
    - **Async function**: `async function f() {}` returns a Promise.
    - **Generator function**: `function* gen() { yield 1; }` can pause and resume.

---

5. What is a closure and what is it used for?
   *(Asked 2×: TCS, Hyland Software)*

==> A **closure** is when an inner function remembers the variables of its outer function, even
    after the outer function has finished running.

    ```js
    function counter() {
      let count = 0;
      return function () {
        count++;
        return count;
      };
    }
    const next = counter();
    next(); // 1
    next(); // 2  (count is remembered)
    ```

    Uses:
    - Data privacy (private variables, like `count` above).
    - Function factories and currying.
    - Keeping state in callbacks, event handlers, `setTimeout`.
    - Memoization (caching results).

---

6. What are the types / states of a Promise?
   *(Asked 1×: TCS)*

==> A Promise has 3 states:
    - **Pending**: the starting state, still working.
    - **Fulfilled**: finished successfully (`resolve` was called).
    - **Rejected**: failed (`reject` was called or an error was thrown).

    Once a Promise is fulfilled or rejected, it is **settled** and its state never changes again.

    ```js
    const p = new Promise((resolve, reject) => {
      resolve("success"); // pending -> fulfilled
    });
    ```

---

7. Can we use try...catch with async/await?
   *(Asked 1×: Kyndryl)*

==> Yes. With `await`, a rejected Promise throws an error, so a normal `try...catch` catches it.
    This is the usual way to handle errors in async/await.

    ```js
    async function getData() {
      try {
        const res = await fetch('/api/data');
        return await res.json();
      } catch (err) {
        console.error('Failed:', err.message);
      }
    }
    ```

    Note: `try...catch` only catches errors from Promises you `await`. A Promise you don't await
    won't be caught.

---

8. Does an async function work synchronously or asynchronously?
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> Both, in a way:
    - The code inside an async function runs **synchronously until the first `await`**.
    - At `await`, the function pauses and gives control back to the caller. The rest runs later
      (asynchronously), as a microtask.
    - An async function **always returns a Promise**.

    ```js
    async function demo() {
      console.log('A');
      await null;
      console.log('C');
    }
    demo();
    console.log('B');
    // A, B, C
    ```

    In short: async functions are asynchronous, but they don't block the thread; the part before the
    first `await` runs right away.

---

9. How have you used promises in your backend?
   *(Asked 1×: Web3Dev)*

==> Sample answer: "In my Node.js/Express backend almost everything async uses Promises with
    async/await:"
    - Database queries (Mongoose / MySQL / Sequelize return Promises).
    - Calling other APIs with `axios` or `fetch`.
    - Running independent calls in parallel with `Promise.all` (e.g. load user, orders and settings
      together).
    - Using `Promise.allSettled` when some calls may fail but I still want the others.
    - File reading with `fs.promises`.
    - Error handling with `try...catch` and a central error middleware.

    ```js
    app.get('/dashboard/:id', async (req, res, next) => {
      try {
        const [user, orders] = await Promise.all([
          User.findById(req.params.id),
          Order.find({ userId: req.params.id }),
        ]);
        res.json({ user, orders });
      } catch (err) {
        next(err);
      }
    });
    ```

---

10. Output: Promise chain that logs, throws, catches and returns 10
   *(Asked 1×: Kyndryl)*

==> Code (from the interview):

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

    **Output:**
    ```
    1
    2
    oops
    10
    ```

    Why:
    - First `.then` logs `1` and returns `2`.
    - Second `.then` logs `2` and throws.
    - `.catch` logs `oops` and returns `10`.
    - Last `.then` gets `10` and logs it.

---

11. Output: async function that awaits a rejected promise inside try/catch, then
    .then(console.log(5))
   *(Asked 1×: Irpgrammer Solutions)*

==> Code (from the interview):

    ```js
    async function processData() {
      try {
        return await Promise.reject("Error occurred");
      } catch (err) {
        console.log("Caught:", err);
      }
    }
    processData().then(console.log(5))
    ```

    **Output:**
    ```
    5
    Caught: Error occurred
    ```

    Why:
    - `processData()` starts, hits `await` and pauses.
    - `.then(console.log(5))` – `console.log(5)` is **called immediately** (it is not wrapped in a
      function), so `5` prints first.
    - Then the awaited rejection is caught → `Caught: Error occurred`.
    - Trap: to log after the Promise, write `.then(() => console.log(5))`.

---

12. What is hoisting?
   *(Asked 1×: TCS)*

==> **Hoisting** means JavaScript moves declarations to the top of their scope before running the
    code.
    - `var` is hoisted and set to `undefined`.
    - `let` and `const` are hoisted but not initialized (they are in the TDZ), so using them early
      gives an error.
    - Function declarations are hoisted fully, so you can call them before they are written.

    ```js
    console.log(a); // undefined
    var a = 5;

    sayHi();        // "Hi" works
    function sayHi() { console.log("Hi"); }

    console.log(b); // ReferenceError
    let b = 10;
    ```

---

13. What is the TDZ (Temporal Dead Zone)?
   *(Asked 1×: TCS)*

==> The **TDZ** is the time between the start of a block and the line where a `let`/`const` variable
    is declared. In that time the variable exists but you cannot use it; touching it throws a
    `ReferenceError`.

    ```js
    {
      // TDZ for x starts here
      console.log(x); // ReferenceError
      let x = 5;      // TDZ ends here
      console.log(x); // 5
    }
    ```

    In short: TDZ stops you from using `let`/`const` before they are declared.

---

14. What is the difference between find() and filter()?
   *(Asked 1×: TCS)*

==>
    +--------------------+----------------------------+--------------------------------------+
    |                    | `find()`                   | `filter()`                           |
    +====================+============================+======================================+
    | Returns            | The first matching element | A new array of all matching elements |
    +--------------------+----------------------------+--------------------------------------+
    | If nothing matches | `undefined`                | `[]` (empty array)                   |
    +--------------------+----------------------------+--------------------------------------+
    | Stops early        | Yes, at first match        | No, checks every element             |
    +--------------------+----------------------------+--------------------------------------+

    ```js
    const nums = [1, 5, 8, 12];
    nums.find(n => n > 4);   // 5
    nums.filter(n => n > 4); // [5, 8, 12]
    ```

---

15. What is the difference between map, filter and reduce?
   *(Asked 1×: EZ Works)*

==>
    +----------+--------------------------------------+------------------------------------------+
    | Method   | What it does                         | Returns                                  |
    +==========+======================================+==========================================+
    | `map`    | Changes every element                | New array, same length                   |
    +----------+--------------------------------------+------------------------------------------+
    | `filter` | Keeps elements that pass a test      | New array, same or shorter               |
    +----------+--------------------------------------+------------------------------------------+
    | `reduce` | Combines all elements into one value | Any single value (number, object, array) |
    +----------+--------------------------------------+------------------------------------------+

    ```js
    const nums = [1, 2, 3, 4];
    nums.map(n => n * 2);              // [2, 4, 6, 8]
    nums.filter(n => n % 2 === 0);     // [2, 4]
    nums.reduce((sum, n) => sum + n, 0); // 10
    ```

---

16. Do map, filter and reduce mutate the original array?
   *(Asked 1×: EZ Works)*

==> No. They return a new value and leave the original array unchanged.
    - But if the array holds **objects** and your callback changes those objects (e.g. `item.price =
      0`), the original objects change, because objects are shared by reference.

    ```js
    const nums = [1, 2, 3];
    const doubled = nums.map(n => n * 2);
    console.log(nums);    // [1, 2, 3]  (unchanged)
    console.log(doubled); // [2, 4, 6]
    ```

    Interview tip: methods that DO mutate include `push`, `pop`, `splice`, `sort`, `reverse`.

---

17. Practical use cases of map, filter and reduce
   *(Asked 1×: EZ Works)*

==>
    - **map**: turn API data into what the UI needs, e.g. get only names: `users.map(u => u.name)`;
      render a list in React.
    - **filter**: show only active users, search results, remove an item: `todos.filter(t => t.id
      !== id)`.
    - **reduce**: cart total, count items, group by category.

    ```js
    const cart = [
      { name: 'pen', price: 10, qty: 2 },
      { name: 'book', price: 100, qty: 1 },
    ];
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0); // 120

    const byCategory = products.reduce((acc, p) => {
      (acc[p.category] ||= []).push(p);
      return acc;
    }, {});
    ```

---

18. What is the difference between null and undefined?
   *(Asked 1×: Algoworks)*

==>
    +-------------+----------------------+----------------------------+
    |             | `undefined`          | `null`                     |
    +=============+======================+============================+
    | Meaning     | Value not set yet    | "Empty on purpose"         |
    +-------------+----------------------+----------------------------+
    | Who sets it | JavaScript (default) | The developer              |
    +-------------+----------------------+----------------------------+
    | `typeof`    | `"undefined"`        | `"object"` (an old JS bug) |
    +-------------+----------------------+----------------------------+

    ```js
    let a;          // undefined
    let b = null;   // null
    null == undefined;  // true
    null === undefined; // false
    ```

---

19. Output: [] == false
   *(Asked 1×: Algoworks)*

==> Code (from the interview):

    ```js
    console.log([] == false);
    ```

    **Output:** `true`

    Why:
    - `==` converts both sides to numbers.
    - `false` → `0`.
    - `[]` → `""` (empty string) → `0`.
    - `0 == 0` → `true`. (Use `===` to avoid this: `[] === false` is `false`.)

---

20. Output: undefined > 0
   *(Asked 1×: Algoworks)*

==> Code (from the interview):

    ```js
    let variableName;
    console.log(variableName > 0);
    ```

    **Output:** `false`

    Why:
    - `variableName` is `undefined`.
    - For `>`, JavaScript converts `undefined` to a number → `NaN`.
    - Any comparison with `NaN` is `false`.

---

21. JavaScript data types and how values are stored
   *(Asked 1×: Fundwave)*

==> JavaScript has 2 groups of types:
    - **Primitive** (7): `string`, `number`, `boolean`, `undefined`, `null`, `bigint`, `symbol`.
    - **Non-primitive (reference)**: `object` (includes arrays, functions, Date, Map, etc.).

    How they are stored:
    - **Primitives** are stored by **value** (simple values, usually kept on the stack). Copying
      makes a real copy.
    - **Objects** are stored in the **heap**; a variable holds a **reference** (address) to it.
      Copying copies only the reference.

    ```js
    let a = 10; let b = a; b = 20;
    console.log(a); // 10 (separate copy)

    let o1 = { x: 1 }; let o2 = o1; o2.x = 99;
    console.log(o1.x); // 99 (same object)
    ```

---

22. What is the difference between the Promise methods (all, allSettled, race, any)?
   *(Asked 1×: Deloitte)*

==>
    +----------------------+--------------------------------------------+-------------------------------+
    | Method               | Resolves when                              | Rejects when                  |
    +======================+============================================+===============================+
    | `Promise.all`        | All succeed → array of results             | Any one fails (fails fast)    |
    +----------------------+--------------------------------------------+-------------------------------+
    | `Promise.allSettled` | All finish (success or fail) → array of    | Never                         |
    |                      | `{status, value/reason}`                   |                               |
    +----------------------+--------------------------------------------+-------------------------------+
    | `Promise.race`       | The first one to finish succeeds           | The first one to finish fails |
    +----------------------+--------------------------------------------+-------------------------------+
    | `Promise.any`        | The first one to succeed                   | All fail (`AggregateError`)   |
    +----------------------+--------------------------------------------+-------------------------------+

    ```js
    const results = await Promise.allSettled([p1, p2]);
    // [{ status: 'fulfilled', value: ... }, { status: 'rejected', reason: ... }]
    ```

---

23. How do you call multiple APIs simultaneously (Promise.all)?
   *(Asked 1×: TCS)*

==> Start all requests at once and wait for all with `Promise.all`. They run in parallel, so total
    time ≈ time of the slowest one.

    ```js
    async function loadAll() {
      try {
        const responses = await Promise.all([
          fetch('/api/users'),
          fetch('/api/orders'),
          fetch('/api/products'),
        ]);
        const [users, orders, products] = await Promise.all(responses.map(r => r.json()));
        console.log(users, orders, products);
      } catch (err) {
        console.error('One request failed:', err);
      }
    }
    ```

    Note: if one fails, `Promise.all` rejects. Use `Promise.allSettled` if you still want the
    others.

---

24. What is the difference between Promise.all and Promise.allSettled?
   *(Asked 1×: Senior Node.js round (YT))*

==>
    +--------------+----------------------------------+--------------------------------------------+
    |              | `Promise.all`                    | `Promise.allSettled`                       |
    +==============+==================================+============================================+
    | If one fails | Rejects immediately (fail fast)  | Waits for all                              |
    +--------------+----------------------------------+--------------------------------------------+
    | Result       | Array of values                  | Array of `{ status, value }` or `{ status, |
    |              |                                  | reason }`                                  |
    +--------------+----------------------------------+--------------------------------------------+
    | Use when     | You need all results to continue | You want every result, even if some fail   |
    +--------------+----------------------------------+--------------------------------------------+

    ```js
    await Promise.all([ok(), fail()]);        // throws
    await Promise.allSettled([ok(), fail()]); // [{status:'fulfilled',...},{status:'rejected',...}]
    ```

---

25. What is a callback function?
   *(Asked 1×: Tech Mahindra (YT))*

==> A **callback** is a function you pass to another function, so it can be called later (for
    example when a task is done).

    ```js
    function greet(name, done) {
      console.log('Hi ' + name);
      done();
    }
    greet('Ravi', () => console.log('Finished'));

    // Node style: error-first callback
    fs.readFile('a.txt', 'utf8', (err, data) => {
      if (err) return console.error(err);
      console.log(data);
    });
    ```

---

26. What is callback hell? (what do we call the problem of nesting many callbacks?)
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> **Callback hell** (also called the "pyramid of doom") is when many async callbacks are nested
    inside each other. The code moves to the right, is hard to read, and error handling is repeated
    everywhere.

    ```js
    getUser(id, (err, user) => {
      getOrders(user, (err, orders) => {
        getDetails(orders, (err, details) => {
          // ...more nesting
        });
      });
    });
    ```

    Fix: use Promises or async/await, or split code into small named functions.

    ```js
    const user = await getUser(id);
    const orders = await getOrders(user);
    const details = await getDetails(orders);
    ```

---

27. What is the difference between a Promise and a callback?
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==>
    +-----------------------+---------------------------------------+-------------------------------------+
    |                       | Callback                              | Promise                             |
    +=======================+=======================================+=====================================+
    | What it is            | A function passed in, called later    | An object for a future value        |
    +-----------------------+---------------------------------------+-------------------------------------+
    | Readability           | Nesting → callback hell               | Flat `.then()` chain or async/await |
    +-----------------------+---------------------------------------+-------------------------------------+
    | Error handling        | Check `err` in every callback         | One `.catch()` or `try...catch`     |
    +-----------------------+---------------------------------------+-------------------------------------+
    | Run many in parallel  | Hard                                  | Easy with `Promise.all`             |
    +-----------------------+---------------------------------------+-------------------------------------+
    | Called how many times | Could be called many times by mistake | Settles only once                   |
    +-----------------------+---------------------------------------+-------------------------------------+

    In short: Promises are a cleaner, safer way to handle async results than raw callbacks.

---

28. Output: obj.greet assigned to a variable and called (this binding lost)
   *(Asked 1×: Hitachi)*

==> Code (from the interview):

    ```js
    const obj = {
      name: "John",
      greet: function() {
        console.log(this.name);
      }
    };

    const greet = obj.greet;
    greet();
    ```

    **Output:** `undefined` (in Node.js, non-strict mode)

    Why:
    - `this` depends on **how** a function is called, not where it is written.
    - `greet()` is called alone (no `obj.` in front), so `this` is the global object, not `obj`.
    - The global object has no `name`, so it prints `undefined`. (In strict mode `this` is
      `undefined` → TypeError. In a browser `window.name` is `""`, so an empty line prints.)

    Fix:

    ```js
    const greet = obj.greet.bind(obj);
    greet(); // John
    ```

---

29. Write any one AJAX method
   *(Asked 1×: Bajaj Finserv)*

==> **AJAX** = getting data from the server without reloading the page. The modern way is `fetch`:

    ```js
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
    ```

    Other ways: `XMLHttpRequest` (old), jQuery `$.ajax()`, and `axios`.

    ```js
    $.ajax({
      url: '/api/users',
      method: 'GET',
      success: data => console.log(data),
      error: err => console.error(err),
    });
    ```

---

30. Making HTTP requests with async/await in Node.js / Express
   *(Asked 1×: Capsitech)*

==> Use `fetch` (built into Node 18+) or `axios` inside an `async` route, with `try...catch` for
    errors.

    ```js
    const express = require('express');
    const axios = require('axios');
    const app = express();

    app.get('/users', async (req, res) => {
      try {
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
        res.json(data);
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users' });
      }
    });

    app.listen(3000);
    ```

---

31. Fetch an API so that it completes within 3 seconds (timeout)
   *(Asked 1×: Capsitech)*

==> Use `AbortController`: start a 3-second timer that aborts the request if it is still running.

    ```js
    async function fetchWithTimeout(url, ms = 3000) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ms);
      try {
        const res = await fetch(url, { signal: controller.signal });
        return await res.json();
      } catch (err) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 3s');
        throw err;
      } finally {
        clearTimeout(timer);
      }
    }
    ```

    Shorter (modern): `fetch(url, { signal: AbortSignal.timeout(3000) })`.
    Other way: `Promise.race([fetch(url), timeoutPromise])` (but this doesn't cancel the request).

---

32. What is function currying? (e.g. multi(4)(5))
   *(Asked 1×: TCS)*

==> **Currying** turns a function that takes many arguments into a chain of functions that each take
    one argument. It works because of closures.

    ```js
    function multi(a) {
      return function (b) {
        return a * b;
      };
    }
    multi(4)(5); // 20

    const multiArrow = a => b => a * b;
    const double = multiArrow(2); // reuse with one argument fixed
    double(7); // 14
    ```

    Uses: reuse (partial application), cleaner function composition.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

33. Sequential vs parallel await: what is wrong with `await` inside a loop, and when should you use
   Promise.all (and limit concurrency)?
   *(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> `await` inside a `for` loop waits for each call to finish before starting the next one. If the
    calls do not depend on each other, this is slow.
    - Sequential: 5 calls x 200 ms = about 1000 ms.
    - Parallel with `Promise.all`: all 5 start together = about 200 ms.
    - Use sequential `await` only when each step needs the previous result, or when order/rate
      really matters.
    - `Promise.all` rejects as soon as one promise rejects. Use `Promise.allSettled` if you want
      every result (success and failure).
    - Do not fire 10,000 requests at once with `Promise.all`: you can overload the DB/API or hit
      rate limits. Limit concurrency (process in batches, or use a library like `p-limit`).
    - Note: `forEach(async ...)` does not wait at all. Use `for...of` (sequential) or `map` +
      `Promise.all` (parallel).

    ```js
    // Slow: one after another
    for (const id of ids) {
      const user = await getUser(id);
    }

    // Fast: all at once
    const users = await Promise.all(ids.map(id => getUser(id)));

    // Limited concurrency: 5 at a time
    import pLimit from 'p-limit';
    const limit = pLimit(5);
    const results = await Promise.all(ids.map(id => limit(() => getUser(id))));
    ```

    In short: Independent async work -> run in parallel with Promise.all; dependent work ->
    sequential await; huge lists -> limit concurrency.

======================================================================================================================================

## What to study first

```
Data types & var/let/const      (base of everything)
   ↓
Hoisting & TDZ                  (how declarations behave)
   ↓
Functions, this & closures      (scope, call/bind, currying)
   ↓
Array methods                   (map, filter, reduce, find)
   ↓
Callbacks & callback hell       (first way to do async)
   ↓
Promises & async/await          (most asked topic)
   ↓
Promise.all / allSettled / race / any
   ↓
AJAX, fetch & timeouts          (using it all for HTTP calls)
```

Data types, var/let/const and hoisting are the foundation. Functions, `this` and closures build on
scope and lead to currying.
Callbacks lead to Promises and async/await, which is the most asked topic here; the Promise
combinators, "Output" questions and fetch/timeout questions all build on that.
