# Hitachi – L1 Interview

**Topics:** DynamoDB keys, array filter/map program, `this` binding, event loop output

---

## AWS DynamoDB

### 1. What are keys in DynamoDB?

**Answer:**
In Amazon DynamoDB, keys are used to uniquely identify items in a table.

There are two types of primary keys:

1. **Partition Key (Hash Key)**
   - A single attribute.
   - Determines the partition where the data is stored.
   - Must be unique if used alone as the primary key.
2. **Composite Key (Partition Key + Sort Key)**
   - Combination of:
     - Partition Key
     - Sort Key (Range Key)
   - Allows multiple items with the same partition key but different sort keys.

> DynamoDB also supports Secondary Indexes:
> - Global Secondary Index (GSI)
> - Local Secondary Index (LSI)
>
> These improve query flexibility.

=====================================================================================================================

## JavaScript Programs

### 2. Write a JavaScript program to filter even numbers from an array and return their doubled values.

**Question:** Given an array `[1,2,3,4,5]`, write code to output `[4,8]`.

**Answer:**
```js
let arr = [1,2,3,4,5];
let evenNumbers = [];

for(let i = 0; i < arr.length; i++) {
    if(arr[i] % 2 === 0) {
        evenNumbers.push(arr[i] * 2);
    }
}

console.log("Even Numbers:", evenNumbers);
```

**Output:** `[4, 8]`

**Explanation:**
- Loop through the array.
- Check if a number is even (`% 2 === 0`).
- Multiply even numbers by 2.
- Push into a new array.

=====================================================================================================================

## Output Questions

### 3. What will be the output of the following code?

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

**Answer:**

**Output:** `undefined`

**Explanation:**
- When `greet()` is assigned to a variable and called independently, it loses its object context.
- `this` no longer refers to `obj`.
- In non-strict mode (browser), `this` refers to the global object.
- Since `name` is not defined globally, it prints `undefined`.

**To fix it:**
```js
const greet = obj.greet.bind(obj);
greet(); // John
```

=====================================================================================================================

### 4. What will be the output of the following asynchronous JavaScript code?

```js
console.log('Start');
setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('End');
```

**Answer:**

**Output:**
```
Start
End
Promise
Timeout
```

**Explanation:**
- JavaScript follows the Event Loop mechanism:
  - `console.log('Start')` → executes immediately.
  - `setTimeout()` → goes to the callback queue (macrotask queue).
  - `Promise.then()` → goes to the microtask queue.
  - `console.log('End')` → executes immediately.
- After the call stack is empty:
  - Microtasks run first → "Promise"
  - Then macrotasks → "Timeout"

> Microtasks (Promises) execute before macrotasks (setTimeout).

=====================================================================================================================
