# JavaScript – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

##### 1. What are Promises? What is the use of async and await?

*(Asked 5×: Algoworks, TCS (online), Hyland Software, Kyndryl, Capsitech)*

==> A **Promise** is a JavaScript object that stands for a value you will get **later** – or an
error. Think of it as a receipt: "your result is coming".
- 3 states: **pending → fulfilled** or **pending → rejected**.
- Read the result with `.then()`, handle errors with `.catch()`, clean up with `.finally()`.

**async / await** is just nicer syntax on top of Promises:
- `async` → the function **always returns a Promise**.
- `await` → pauses **only that function** until the Promise settles, then gives you the value (or
  throws the error). The rest of the page/app keeps running.

```js
const getUser = () =>
  new Promise(resolve => setTimeout(() => resolve({ name: 'Ravi' }), 1000));

// Promise style
getUser().then(user => console.log(user.name)).catch(console.error);

// async/await style – same thing, reads top to bottom
async function show() {
  try {
    const user = await getUser();
    console.log(user.name);
  } catch (err) {
    console.error(err);
  }
}
show();
// Output (after 1 s): Ravi  Ravi
```

In short: a Promise = a future value; async/await = write Promise code like normal sync code.

---

##### 2. Output: Promise.resolve(1) .then(+1) .then(throw) .catch(() => 1) .then(+1) .then(log)

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
- `1` → first `.then` returns `2`.
- Next `.then` **throws**, so the chain skips to the nearest `.catch`.
- `.catch` **returns `1`** → the chain is "recovered" and continues as fulfilled with `1`.
- `1 + 1 = 2` → printed. The last `.catch` never runs.

In short: whatever `.catch` returns becomes the next value – the chain goes back to normal.

---

##### 3. What is the difference between var, let and const?

*(Asked 2×: TCS (online), Capsitech)*

==>
```text
+---------------------+----------------------+----------------------+----------------------+
|                     | var                  | let                  | const                |
+=====================+======================+======================+======================+
| Scope               | Function             | Block { }            | Block { }            |
+---------------------+----------------------+----------------------+----------------------+
| Re-declare (same    | Yes                  | No (SyntaxError)     | No (SyntaxError)     |
| scope)              |                      |                      |                      |
+---------------------+----------------------+----------------------+----------------------+
| Re-assign           | Yes                  | Yes                  | No (TypeError)       |
+---------------------+----------------------+----------------------+----------------------+
| Hoisting            | Hoisted as undefined | Hoisted, but in TDZ  | Hoisted, but in TDZ  |
+---------------------+----------------------+----------------------+----------------------+
| Value required at   | No                   | No                   | Yes                  |
| declaration         |                      |                      |                      |
+---------------------+----------------------+----------------------+----------------------+
| Global var creates  | Yes (window.x)       | No                   | No                   |
| window property     |                      |                      |                      |
+---------------------+----------------------+----------------------+----------------------+
```

```js
if (true) { var a = 1; let b = 2; }
console.log(a); // 1
console.log(b); // ReferenceError: b is not defined

const obj = { x: 1 };
obj.x = 2;      // OK – the object's content can change
obj = {};       // TypeError: Assignment to constant variable
```

Note: `const` means the **binding** can't change, not that the object is frozen.

In short: `const` by default, `let` when the value changes, avoid `var`.

---

##### 4. What are the different types of functions in JavaScript?

*(Asked 2×: Fundwave, Capsitech)*

==>
- **Function declaration** – `function add(a, b) { return a + b; }` → **fully hoisted**, can be
  called before the line.
- **Function expression** – `const add = function (a, b) { ... };` → not callable before the line.
- **Arrow function** – `const add = (a, b) => a + b;` → short, **no own `this`**, no
  `arguments`, can't be used with `new`.
- **Anonymous function** – no name, usually passed as a callback.
- **IIFE** – runs immediately: `(function () { ... })();` (old way to make private scope).
- **Callback** – a function passed to another function, called later.
- **Higher-order function** – takes or returns a function (`map`, `filter`, `setTimeout`).
- **Constructor function** – called with `new` to create objects: `new Person('Ravi')`.
- **Async function** – `async function f() {}` → always returns a Promise.
- **Generator function** – `function* gen() { yield 1; }` → can pause and resume.

```js
console.log(add(2, 3)); // 5 – declaration is hoisted
function add(a, b) { return a + b; }

console.log(sub(5, 1)); // ReferenceError – const expression is in TDZ
const sub = (a, b) => a - b;
```

In short: declaration, expression, arrow are the main 3; the rest are roles (callback, HOF, IIFE).

---

##### 5. What is a closure and what is it used for?

*(Asked 2×: TCS, Hyland Software)*

==> A **closure** is a function that **remembers the variables of the scope it was created in**,
even after that outer function has returned. In JavaScript every function gets one automatically.

```js
function counter() {
  let count = 0;          // private – nobody outside can touch it
  return function () {
    count++;
    return count;
  };
}
const next = counter();
console.log(next()); // 1
console.log(next()); // 2  – count is remembered
```

Uses:
- **Data privacy** – private variables (like `count`).
- **Function factories / currying** – `multiply(2)` returns a "double" function.
- Keeping state in **event handlers** and `setTimeout` callbacks.
- **Memoization** – caching results in a remembered object.

In short: closure = function + the variables it remembers from where it was born.

---

##### 6. What are the types / states of a Promise?

*(Asked 1×: TCS)*

==> A Promise has **3 states**:
- **Pending** – starting state, still working.
- **Fulfilled** – `resolve(value)` was called.
- **Rejected** – `reject(reason)` was called, or an error was thrown inside.

Once fulfilled or rejected, it is **settled** – the state can **never change again**. Extra
`resolve`/`reject` calls are ignored.

```js
const p = new Promise((resolve, reject) => {
  resolve('first');
  reject('ignored');   // no effect – already settled
});
p.then(console.log);   // Output: first
```

In short: pending → fulfilled or rejected, and it settles only once.

---

##### 7. Can we use try...catch with async/await?

*(Asked 1×: Kyndryl)*

==> Yes. Inside an `async` function, `await` on a **rejected Promise throws**, so a normal
`try...catch` catches it. This is the standard way to handle async errors.

```js
async function getData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // fetch doesn't reject on 404/500
    return await res.json();
  } catch (err) {
    console.error('Failed:', err.message);
  }
}
```

Catch: `try...catch` only catches Promises you **`await`**. A Promise you start without `await`
rejects outside the `try` → "Uncaught (in promise)" error.

In short: await + try/catch = async error handling that looks like sync code.

---

##### 8. Does an async function work synchronously or asynchronously?

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> Both, in a way:
- The body runs **synchronously until the first `await`**.
- At `await`, the function pauses and control goes back to the caller. The rest resumes later as
  a **microtask**.
- It **always returns a Promise**, even if you `return 5`.

```js
async function demo() {
  console.log('A');
  await null;
  console.log('C');
}
demo();
console.log('B');
// Output: A B C
```

In short: sync until the first `await`, async after it – and it never blocks the thread.

---

##### 9. How have you used promises in your backend?

*(Asked 1×: Web3Dev)*

==> Sample answer: "In my backend almost every async task uses Promises with async/await:"
- **Database queries** – the database client returns Promises.
- **Calling other APIs** with `fetch`.
- **`Promise.all`** to run independent calls in parallel (user + orders together).
- **`Promise.allSettled`** when some calls may fail but I still need the rest.
- Errors with `try...catch`, passed to one central error handler.

```js
async function getDashboard(id) {
  try {
    const [user, orders] = await Promise.all([
      db.getUser(id),
      db.getOrders(id),
    ]);
    return { user, orders };
  } catch (err) {
    handleError(err);
  }
}
```

In short: async/await everywhere, `Promise.all` for parallel work, one central error handler.

---

##### 10. Output: Promise chain that logs, throws, catches and returns 10

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
```text
1
2
oops
10
```

Why:
- First `.then` logs `1`, returns `2`.
- Second `.then` logs `2`, then **throws**.
- `.catch` logs `oops` and **returns `10`** → chain recovers.
- Last `.then` receives `10` and logs it.

In short: a throw jumps to `.catch`; `.catch`'s return value continues the chain.

---

##### 11. Output: async function that awaits a rejected promise inside try/catch, then .then(console.log(5))

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
```text
5
Caught: Error occurred
```

Why:
- `processData()` starts, hits `await` and **pauses** (the rest is a microtask).
- `.then(console.log(5))` – `console.log(5)` is **called right now** while building the argument
  (it's not wrapped in a function), so `5` prints first. `.then` gets `undefined` and ignores it.
- Then the microtask runs: the rejection is thrown at `await` and caught → `Caught: Error occurred`.

Trap: to log after the Promise, write `.then(() => console.log(5))`.

In short: `.then(fn())` calls fn immediately – pass a function, not a call.

---

##### 12. What is hoisting?

*(Asked 1×: TCS)*

==> **Hoisting**: before running a scope, the JS engine registers all its declarations first, so
they behave as if "moved to the top".
- `var` → hoisted and set to **`undefined`**.
- `let` / `const` / `class` → hoisted but **not initialized** (in the **TDZ**) → `ReferenceError`
  if used early.
- **Function declarations** → hoisted **fully** (name + body), so you can call them early.
- Function expressions / arrow functions follow their variable's rule (`var` → `undefined`,
  `const` → TDZ).

```js
console.log(a); // undefined
var a = 5;

sayHi();        // Hi
function sayHi() { console.log('Hi'); }

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;
```

In short: declarations are set up before the code runs; only `var` and functions are usable early.

---

##### 13. What is the TDZ (Temporal Dead Zone)?

*(Asked 1×: TCS)*

==> The **TDZ** is the time from the **start of the block** until the line where a `let` / `const`
/ `class` is declared. The variable exists (it is hoisted) but touching it throws a
**`ReferenceError`**.

```js
{
  // TDZ for x starts here
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 5;      // TDZ ends here
  console.log(x); // 5
}
```

Even `typeof x` inside the TDZ throws (while `typeof notDeclared` just gives `"undefined"`).

In short: TDZ = "declared but not ready yet" – it stops you using `let`/`const` too early.

---

##### 14. What is the difference between find() and filter()?

*(Asked 1×: TCS)*

==>
```text
+--------------------+----------------------------+--------------------------------------+
|                    | find()                     | filter()                             |
+====================+============================+======================================+
| Returns            | The first matching element | New array of all matching elements   |
+--------------------+----------------------------+--------------------------------------+
| Nothing matches    | undefined                  | [] (empty array)                     |
+--------------------+----------------------------+--------------------------------------+
| Stops early        | Yes, at the first match    | No, checks every element             |
+--------------------+----------------------------+--------------------------------------+
```

```js
const nums = [1, 5, 8, 12];
console.log(nums.find(n => n > 4));   // 5
console.log(nums.filter(n => n > 4)); // [5, 8, 12]
console.log(nums.find(n => n > 50));  // undefined
```

In short: `find` → one item; `filter` → an array of items.

---

##### 15. What is the difference between map, filter and reduce?

*(Asked 1×: EZ Works)*

==>
```text
+----------+--------------------------------------+------------------------------------------+
| Method   | What it does                         | Returns                                  |
+==========+======================================+==========================================+
| map      | Transforms every element             | New array, same length                   |
+----------+--------------------------------------+------------------------------------------+
| filter   | Keeps elements that pass a test      | New array, same or shorter               |
+----------+--------------------------------------+------------------------------------------+
| reduce   | Combines all elements into one value | One value (number, object, array...)     |
+----------+--------------------------------------+------------------------------------------+
```

```js
const nums = [1, 2, 3, 4];
nums.map(n => n * 2);                // [2, 4, 6, 8]
nums.filter(n => n % 2 === 0);       // [2, 4]
nums.reduce((sum, n) => sum + n, 0); // 10
```

Tip: always pass the **initial value** to `reduce` (the `0` above) – on an empty array without it,
`reduce` throws a TypeError.

In short: map = transform, filter = select, reduce = combine.

---

##### 16. Do map, filter and reduce mutate the original array?

*(Asked 1×: EZ Works)*

==> **No.** They return a new value and leave the original array as it was.
- But if the array holds **objects** and your callback changes them (`item.price = 0`), the
  original objects change too – objects are shared **by reference**.

```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log(nums);    // [1, 2, 3]  – unchanged
console.log(doubled); // [2, 4, 6]

const users = [{ name: 'a' }];
users.map(u => { u.name = 'X'; return u; });
console.log(users[0].name); // 'X' – the object itself was changed
```

In short: the array isn't mutated, but objects inside it can be.

---

##### 17. Practical use cases of map, filter and reduce

*(Asked 1×: EZ Works)*

==>
- **map** – shape API data for the UI: `users.map(u => u.name)`.
- **filter** – active users, search results, delete an item: `todos.filter(t => t.id !== id)`.
- **reduce** – cart total, counting, grouping by category.

```js
const cart = [
  { name: 'pen',  price: 10,  qty: 2, category: 'office' },
  { name: 'book', price: 100, qty: 1, category: 'books' },
];

const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log(total); // 120

const byCategory = cart.reduce((acc, p) => {
  (acc[p.category] ||= []).push(p.name);
  return acc;
}, {});
console.log(byCategory); // { office: ['pen'], books: ['book'] }

// chain them
const expensive = cart.filter(i => i.price > 50).map(i => i.name); // ['book']
```

In short: map for display, filter for search/remove, reduce for totals and grouping.

---

##### 18. What is the difference between null and undefined?

*(Asked 1×: Algoworks)*

==>
```text
+-------------+----------------------------+----------------------------------+
|             | undefined                  | null                             |
+=============+============================+==================================+
| Meaning     | Value not set yet          | "Empty on purpose"               |
+-------------+----------------------------+----------------------------------+
| Who sets it | JavaScript (default)       | The developer                    |
+-------------+----------------------------+----------------------------------+
| typeof      | "undefined"                | "object" (a historic JS bug)     |
+-------------+----------------------------+----------------------------------+
| In math     | Number(undefined) -> NaN   | Number(null) -> 0                |
+-------------+----------------------------+----------------------------------+
```

```js
let a;               // undefined – declared, no value
let b = null;        // null – cleared on purpose
null == undefined;   // true  (loose equality treats them as equal)
null === undefined;  // false (different types)
```

In short: `undefined` = JS says "nothing here yet"; `null` = you say "intentionally empty".

---

##### 19. Output: [] == false

*(Asked 1×: Algoworks)*

==> Code (from the interview):

```js
console.log([] == false);
```

**Output:** `true`

Why (**type coercion** with `==`):
- Boolean is turned into a number: `false` → `0`. Now it's `[] == 0`.
- Object is turned into a primitive: `[]` → `""` (empty string).
- String is turned into a number: `""` → `0`.
- `0 == 0` → `true`.

With `===` there's no conversion: `[] === false` → `false`.

In short: `==` coerces types – always use `===`.

---

##### 20. Output: undefined > 0

*(Asked 1×: Algoworks)*

==> Code (from the interview):

```js
let variableName;
console.log(variableName > 0);
```

**Output:** `false`

Why:
- `variableName` is `undefined` (declared, never assigned).
- For `>`, JavaScript converts `undefined` to a number → **`NaN`**.
- Every comparison with `NaN` is `false` (even `NaN === NaN`).

In short: undefined → NaN, and NaN compares false with everything.

---

##### 21. JavaScript data types and how values are stored

*(Asked 1×: Fundwave)*

==> 2 groups of types:
- **Primitives (7)**: `string`, `number`, `boolean`, `undefined`, `null`, `bigint`, `symbol` –
  immutable, copied **by value**.
- **Objects (reference type)**: plain objects, arrays, functions, `Date`, `Map`, `Set`... –
  copied **by reference**.

How they are stored:
- Objects live in the **heap**; your variable holds a **reference** to it. Copying the variable
  copies the reference, so both point to the same object.
- "Primitives on the stack" is only a mental model – the spec doesn't define it. Engines may,
  for example, keep strings on the heap and store small integers directly.

```js
let a = 10; let b = a; b = 20;
console.log(a);    // 10 – separate copy

let o1 = { x: 1 }; let o2 = o1; o2.x = 99;
console.log(o1.x); // 99 – same object

typeof null;       // 'object' (historic bug)
typeof [];         // 'object' – use Array.isArray([]) → true
```

In short: 7 primitives copied by value; everything else is an object shared by reference.

---

##### 22. What is the difference between the Promise methods (all, allSettled, race, any)?

*(Asked 1×: Deloitte)*

==>
```text
+--------------------+-----------------------------------+--------------------------------+
| Method             | Resolves when                     | Rejects when                   |
+====================+===================================+================================+
| Promise.all        | ALL succeed -> array of values    | ANY one fails (fail fast)      |
+--------------------+-----------------------------------+--------------------------------+
| Promise.allSettled | All finish -> array of            | Never                          |
|                    | { status, value / reason }        |                                |
+--------------------+-----------------------------------+--------------------------------+
| Promise.race       | The FIRST to settle succeeds      | The FIRST to settle fails      |
+--------------------+-----------------------------------+--------------------------------+
| Promise.any        | The FIRST to succeed              | ALL fail (AggregateError)      |
+--------------------+-----------------------------------+--------------------------------+
```

```js
const ok   = v  => new Promise(r => setTimeout(() => r(v), 100));
const fail = e  => Promise.reject(new Error(e));

await Promise.all([ok(1), ok(2)]);            // [1, 2]
await Promise.allSettled([ok(1), fail('x')]);
// [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: Error: x }]
await Promise.race([ok(1), fail('x')]);       // rejects with Error: x (it settled first)
await Promise.any([ok(1), fail('x')]);        // 1
```

In short: all = all or nothing; allSettled = report on all; race = first to finish; any = first
success.

---

##### 23. How do you call multiple APIs simultaneously (Promise.all)?

*(Asked 1×: TCS)*

==> Start all requests **at the same time**, then wait for all of them with **`Promise.all`**.
They run in parallel, so total time ≈ the **slowest** request, not the sum.

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

- 3 calls × 300 ms one by one ≈ 900 ms; with `Promise.all` ≈ 300 ms.
- If one fails, `Promise.all` rejects and the `catch` runs.

In short: fire all requests first, then `await Promise.all` – time = slowest call.

---

##### 24. What is the difference between Promise.all and Promise.allSettled?

*(Asked 1×: Senior Node.js round (YT))*

==>
```text
+--------------+----------------------------------+--------------------------------------------+
|              | Promise.all                      | Promise.allSettled                         |
+==============+==================================+============================================+
| If one fails | Rejects immediately (fail fast)  | Still waits for all                        |
+--------------+----------------------------------+--------------------------------------------+
| Result       | Array of values                  | Array of { status, value } or              |
|              |                                  | { status, reason }                         |
+--------------+----------------------------------+--------------------------------------------+
| Use when     | You need every result to go on   | You want each result, even if some fail    |
+--------------+----------------------------------+--------------------------------------------+
```

```js
const ok = () => Promise.resolve('ok');
const fail = () => Promise.reject('no');

await Promise.all([ok(), fail()]);        // throws 'no'
await Promise.allSettled([ok(), fail()]);
// [{ status: 'fulfilled', value: 'ok' }, { status: 'rejected', reason: 'no' }]
```

In short: all = all-or-nothing; allSettled = give me every outcome.

---

##### 25. What is a callback function?

*(Asked 1×: Tech Mahindra (YT))*

==> A **callback** is a function you pass to another function so it can **call it later** – for
example when a click happens, a timer ends or data arrives. It works because functions are
**first-class values** in JavaScript.

```js
function greet(name, done) {
  console.log('Hi ' + name);
  done();
}
greet('Ravi', () => console.log('Finished'));
// Output: Hi Ravi  Finished

// async callbacks in the browser
button.addEventListener('click', () => console.log('clicked'));
setTimeout(() => console.log('1 second later'), 1000);

// sync callbacks
[1, 2, 3].forEach(n => console.log(n));
```

- **Sync callbacks** run right away (`forEach`, `map`).
- **Async callbacks** run later (`setTimeout`, events).

In short: a callback = "here's a function, call it when you're done".

---

##### 26. What is callback hell? (what do we call the problem of nesting many callbacks?)

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> **Callback hell** (or the **pyramid of doom**) is when async callbacks are nested inside each
other. The code drifts to the right, is hard to read, and every level repeats its own error check.

```js
getUser(id, (err, user) => {
  if (err) return handle(err);
  getOrders(user, (err, orders) => {
    if (err) return handle(err);
    getDetails(orders, (err, details) => {
      if (err) return handle(err);
      // ...more nesting
    });
  });
});
```

In short: callbacks nested inside callbacks = pyramid of doom – hard to read and maintain.

---

##### 27. What is the difference between a Promise and a callback?

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==>
```text
+-----------------------+---------------------------------------+-------------------------------------+
|                       | Callback                              | Promise                             |
+=======================+=======================================+=====================================+
| What it is            | A function passed in, called later    | An object for a future value        |
+-----------------------+---------------------------------------+-------------------------------------+
| Readability           | Nesting -> callback hell              | Flat .then() chain or async/await   |
+-----------------------+---------------------------------------+-------------------------------------+
| Error handling        | Check err in every callback           | One .catch() or try...catch         |
+-----------------------+---------------------------------------+-------------------------------------+
| Many in parallel      | Hard, manual counting                 | Easy with Promise.all               |
+-----------------------+---------------------------------------+-------------------------------------+
| How many times called | Could be called 0 or many times       | Settles exactly once                |
+-----------------------+---------------------------------------+-------------------------------------+
| When it runs          | Depends on the API (sync or async)    | .then always runs async (microtask) |
+-----------------------+---------------------------------------+-------------------------------------+
```

```js
// callback
setTimeout(() => console.log('done'), 1000);

// promise
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
wait(1000).then(() => console.log('done'));
```

In short: Promises give you a value you can chain, combine and catch once – callbacks don't.

---

##### 28. Output: obj.greet assigned to a variable and called (this binding lost)

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

**Output:**
- **Browser, non-strict**: empty line – `this` is `window`, and `window.name` is `""`.
- **Strict mode / ES module**: `TypeError: Cannot read properties of undefined (reading 'name')`.

Why:
- `this` depends on **how a function is called**, not where it is written.
- `greet()` is a plain call (no `obj.` before it), so `this` is **not** `obj` → the binding is lost.

In short: copy a method into a variable and call it alone – `this` is lost, so `name` isn't
"John".

---

##### 29. Write any one AJAX method

*(Asked 1×: Bajaj Finserv)*

==> **AJAX** = the browser fetches data from the server **without reloading the page**. The
modern way is **`fetch`** (returns a Promise):

```js
fetch('/api/users/1')
  .then(res => res.json())
  .then(user => console.log(user.name))
  .catch(err => console.error(err));
// Output: the user's name, page not reloaded
```

In short: AJAX = update the page with server data without a reload; `fetch` does it.

---

##### 30. Making HTTP requests with async/await in Node.js / Express

*(Asked 1×: Capsitech)*

==> Use **`fetch`** (built into Node 18+) inside an `async` route handler, with `try...catch` for
errors.

```js
const express = require('express');
const app = express();

app.get('/users', async (req, res) => {
  try {
    const response = await fetch('https://api.example.com/users');
    if (!response.ok) throw new Error(`Upstream ${response.status}`);
    const users = await response.json();
    res.json(users);
  } catch (err) {
    res.status(502).json({ message: 'Failed to fetch users' });
  }
});

app.listen(3000);
// GET /users → JSON array of users
```

- `fetch` does **not** reject on 404/500 → check `response.ok`.

In short: `await fetch(...)` in an async route, check `ok`, and catch errors.

---

##### 31. Fetch an API so that it completes within 3 seconds (timeout)

*(Asked 1×: Capsitech)*

==> Use **`AbortController`**: start a 3-second timer that **aborts** the request if it's still
running.

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

In short: a timer calls `controller.abort()` after 3 s, which cancels the request.

---

##### 32. What is function currying? (e.g. multi(4)(5))

*(Asked 1×: TCS)*

==> **Currying** turns `f(a, b)` into `f(a)(b)` – a chain of functions that each take **one
argument**. It works because of **closures**: the inner function remembers `a`.

```js
function multi(a) {
  return function (b) {
    return a * b;
  };
}
console.log(multi(4)(5)); // 20

const multiArrow = a => b => a * b;
const double = multiArrow(2); // a is fixed to 2
console.log(double(7));       // 14
```

In short: currying = one argument at a time, powered by closures.

---

## More questions from revision PDFs (not yet asked in a real interview)

Ordered by topic priority: questions from the most-asked topics come first.

---

##### 33. Sequential vs parallel await: what is wrong with `await` inside a loop, and when should you use Promise.all (and limit concurrency)?

*(Not asked in a real interview yet · From: Gaurav Sharma Node.js notes PDF)*

==> `await` inside a `for` loop waits for each call to finish **before starting the next**. If the
calls don't depend on each other, that's slow.
- **Sequential**: 5 calls × 200 ms ≈ 1000 ms.
- **Parallel** with `Promise.all`: all 5 start together ≈ 200 ms.
- Use sequential `await` only when each step needs the previous result, or order/rate matters.
- Don't fire 10,000 requests at once – you'll overload the server or hit rate limits. **Limit
  concurrency**, e.g. run them in batches.
- `forEach(async ...)` does **not wait at all**. Use `for...of` (sequential) or
  `map` + `Promise.all` (parallel).

```js
// Slow: one after another (~1000 ms)
for (const id of ids) {
  const user = await getUser(id);
}

// Fast: all at once (~200 ms)
const users = await Promise.all(ids.map(id => getUser(id)));

// Limited: batches of 5, at most 5 running at a time
const results = [];
for (let i = 0; i < ids.length; i += 5) {
  const batch = ids.slice(i, i + 5);
  results.push(...(await Promise.all(batch.map(id => getUser(id)))));
}
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
