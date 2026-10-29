# Node.js & JavaScript – Questions

**Versions noted:**
- nodejs (lts: 18.12.0) (current: 19.0.0) (used: 14.15)
- mongodb (current: 6.0) (used: 4.6)
- elasticsearch (current 8.4) (used: 7.5)

**Topics:** hoisting, closure, arrow function, callbacks, promises, async/await, ES6, array methods, var/let/const, call/apply/bind, event loop, EventEmitter, built-in modules, npm

---

## JavaScript Basics

### 1. Hoisting

**Answer:**
- hoisting is where variable and function declarations are moved to the top of their scope (during compilation)
- `var` is hoisted and initialized with `undefined`; `let` and `const` are hoisted but stay in the Temporal Dead Zone until declared

**Example:**
```js
console.log(test);
var test
// output: undefined

console.log(test)
var test = 10
// output: undefined
```

=====================================================================================================================

### 2. Closure

**Answer:**
- closure means the inner function has access to its outer function variable, even after the outer function has finished.
- it is used for hiding implementation details in javascript, or to create private variables or functions.
- by closure we can achieve data encapsulation by creating private variables and functions

**Example:**
```js
function closure(){
    let test = "something";
    function inner(){
        console.log(test);
    }
    inner();
}

closure();   // something
```

=====================================================================================================================

### 3. Arrow function

**Answer:**
- it provides the shorter syntax than function expression
- arrow function doesn't have its own binding to this; it uses the this of the surrounding (lexical) scope. (A normal function's this is the object that calls the function.)
- arrow functions are not suitable as object methods or constructors, and call, apply and bind cannot change their this

=====================================================================================================================

### 4. What is callback function

**Answer:**
- callback function is to be executed after another function finishes execution.
- we can pass function as argument to another function.
- benefits : we can wait for the result of the previous function call and then execute the other function call
- it is used to run code in a fixed order after a task completes. it is useful when we have to wait for a result that takes time (asynchronous work like timers, file reads, API calls).

=====================================================================================================================

### 5. What is callback hell

**Answer:**
- callback means a function pass as an argument to another function.
- if we have multiple functions that depend on another function, we pass them as callbacks. (it creates unmanageable code)
- it reduces code readability and makes it difficult to find the errors where the code breaks. that situation is known as callback hell.

=====================================================================================================================

### 6. What is promises

**Answer:**
- promises are used to handle asynchronous operations in javascript.
- it is an improved alternative to callbacks (not a superset of them).
- it has three states: pending, fulfilled and rejected.

**Benefits:**
- Improves the code readability
- Better handling of asynchronous operations
- Better error handling

=====================================================================================================================

### 7. Async await

**Answer:**
- async/await is syntax built on top of promises (it makes promise code look synchronous)
- async means the function always returns a promise
- await means wait until the promise is resolved or rejected.
- async/await are used with Promises.

=====================================================================================================================

### 8. New features in ES6 and ES7

**Answer:**
- ES6
  - let and const
  - arrow function
  - promises
  - Template literals
  - multi line string (backtick ` operator)
  - default parameter
  - destructuring (array, object)  // let obj ={p:21,q:34}     let {p,q}=obj
  - classes
  - modules
  - rest parameter and spread operator
- ES7 (ES2016)
  - Array.prototype.includes()
  - exponentiation operator (**)

=====================================================================================================================

### 9. Difference between map and forEach

**Answer:**
- map returns a new array where forEach returns undefined

```js
let arr = [ 10,2,44,5,45]
let map = arr.map((x)=>x*x)   // [100,4,...]
let foreach = arr.forEach((x)=>x*x)   // undefined
```

- map returns the array so we can chain reduce(), filter(), sort() after map() but not after forEach()

=====================================================================================================================

### 10. Map

**Answer:**
- map is used to iterate the array
- creates new array by calling a function for every element in array

```js
arr.map((currentValue, index, arr)=>{})
```

=====================================================================================================================

### 11. Filter

**Answer:**
- filter method creates new array with the elements that pass the condition provided by function.
- does not execute the function for empty elements
- does not change the original array

```js
let arr = [10,23,2,33,57,4]
let filtered = arr.filter((ele)=> ele>8)   // [10, 23, 33, 57]
```

=====================================================================================================================

### 12. Find

**Answer:**
- returns a value of the first element in array that passes the test
- it returns undefined if no element is found

=====================================================================================================================

### 13. Difference between "forin" and "forOf"

**Answer:**
- for...in iterates over the enumerable property names (keys, or indexes for arrays) of an object
- for...of iterates over the values of any iterable (arrays, strings, Map, Set)

=====================================================================================================================

### 14. Difference between var, let, const

**Answer:**
- var is function scope, let and const are block scope.
- var and let can be declared without initialization, const must be initialized when it is declared
- var can be updated and re-declared, let can be updated but not re-declared, const can not be updated or re-declared
- var is hoisted (initialized as undefined), let and const are hoisted but can not be used before the declaration (Temporal Dead Zone).

=====================================================================================================================

### 15. Call, apply and bind

**Answer:**
- **call:** call method calls the function with the given this value and arguments.
- **apply:** apply is similar to call except it accept argument in array.
- **bind:** bind method returns a new function with the provided this (it does not call it immediately).

=====================================================================================================================

### 16. Promise.all v/s Promise.allSettled

**Answer:**
- **Promise.all** - it resolves only when all the promises get resolved; if any one fails then it rejects
- **Promise.allSettled** - this will always resolve with an array having the info of each promise (resolved or rejected)

=====================================================================================================================

### 17. Timer function

**Answer:**
- **setTimeout** - setTimeout executes the first argument after the specified time has completed.
- **setInterval** - repeats the function call after every specified time interval

=====================================================================================================================

### 18. Ways to copy Object

**Answer:**
```js
let obj = {
    "name":"abc"
}

// let obj2 = {...obj}                           // shallow copy

// let obj2 = Object.assign({},obj)              // shallow copy

// let obj2 = JSON.parse(JSON.stringify(obj));   // deep copy (loses functions and undefined, Date becomes a string)
```

=====================================================================================================================

### 19. Ways to create objects

**Answer:**
- Object literals
  ```js
  let obj = { firstname:"abc" }
  ```
- using new keyword
  ```js
  let obj = new Object()
  ```
- using classes
  ```js
  //using es6 classes
  class Vehicle {
      constructor(name, maker, engine) {
          this.name = name;
          this.maker =  maker;
          this.engine = engine;
      }
  }

  let car1 = new Vehicle('GT', 'BMW', '1998cc');
  console.log(car1.name);  //GT
  ```

=====================================================================================================================

## Node.js

### 20. How node.js works

**Answer:**
- nodejs is single threded and run on chrome v8 engine
- it accept the request from client and push it into event loop and dosent wait for response
- event loop executes the request in FIFO manner
- nodejs is asyncronous in nature.

=====================================================================================================================

### 21. What are the two types of API functions in Node.js

**Answer:**
- asyncronous , Non blocking
- syncronous , blocking function

=====================================================================================================================

### 22. Http methods

**Answer:**
- GET, POST, PUT, PATCH, DELETE

=====================================================================================================================

### 23. Global Object in Node.js

**Answer:**
- global objects are global in nature and they are available all the modules. and we do not include these objects in project.
- In Node.js, Globals are the objects which are global in nature and are available in all the modules of the application. You can use these objects directly in your application, rather than having to include them explicitly. The global objects can be modules, functions, strings, object, etc. Moreover, some of these objects can be in the module scope instead of global scope.

**Common globals:**
- `__filename` : It represent filename of the code being executed.
- `__dirname` : represents the name of the directory of the currently executing script reside in.
- setTimeout
- clearTimeout
- setInterval
- clearInterval
- console
- process

=====================================================================================================================

### 24. Events in nodejs

**Answer:**
- events is a built-in module in node js.
- we can create, fire, and listen the custom events
- for that we need to import the EventEmitter class from events.
- emit method is used to fire the event and in the 'on' method we can write the handler.
- eventEmitter.on(event, listener) and eventEmitter.addListener(event, listener) are pretty much similar
- eventEmitter.once(event, listener) fires at most once for a particular event and will be removed from listeners array after it has listened once.

=====================================================================================================================

### 25. What is an EventEmitter in Node.js

**Answer:**
- EventEmitter is a class used to create custom events in node js
- it provides multiple methods like emit, on, once, addListener

=====================================================================================================================

### 26. What does event-driven programming mean

**Answer:**
- In event driven programming the control flow of the program is handled by events.
- Node js extensively uses events, that's why it is fast.
- there are two main components in event driven programming
- one is the callback function (event handler) that is called when an event is triggered
- second is the event loop that listens for events and calls the corresponding callback function.

```
(event emitter)
events -------- event loop -------- event handler
```

**Advantages:** Simplicity of Programming

=====================================================================================================================

### 27. What is event loop

**Answer:**
- event loop used to handle non blocking i/o operations.
- it is an infinite loop that continuously checks the event queue and passes that event to the event handler
- event handler executes the event and returns the result.
- if the event queue is empty then the event loop waits (sleeps).

=====================================================================================================================

### 28. Node.js built-in modules

**Answer:**
- **http:**
  - used to create the server ( createServer() )
  - request() method used to call 3rd party apis
- **fs:**
  - used to perform operations on files
- **url:**
  - parses the url string into a url object
- **Buffer:** (global class)
  - used to handle binary data
- **events**
- **timers**

=====================================================================================================================

### 29. Differentiate between process.nextTick() and setImmediate()

**Answer:**
- process.nextTick() call the callback function immediate after the execution of current task.
- process.nextTick has higher priority than setImmediate
- if we recursively call process.nextTick it block the event loop

=====================================================================================================================

### 30. Difference between dependencies and devDependencies

**Answer:**
- dependencies consist of packages that are required at runtime.
- devDependencies consist of packages that are used in the development phase only, not in production.

=====================================================================================================================

### 31. Difference between package.json and package-lock.json

**Answer:**
- package.json contains the information about the required version (range) of the packages.
- package-lock.json contains the exact installed version of every package and maintains the hierarchy of required child packages (dependencies of dependencies).

=====================================================================================================================

### 32. Package.json

**Answer:**
- package.json file contains the metadata of project
- name of project, version of project, description, dependencies, devDependencies, scripts, repository

=====================================================================================================================

### 33. How do you install, update, and delete a dependency

**Answer:**
```
npm install <packageName>
npm uninstall <packageName>
npm update <packageName> OR  npm install <packageName>@<version>
```

=====================================================================================================================

### 34. What are the pros and cons of Node.js

**Answer:**
**Pros:**
- it is asynchronous, non blocking, event driven so it handles multiple requests, which helps to increase performance
- npm has a large community
- easy scalability
- Asynchronous and Event driven
- Fast in code execution
- Single threaded but highly scalable
- Node.js library uses JavaScript

**Cons:**
- not suitable for heavy CPU-intensive tasks (they block the single thread / event loop)
- callback hell if code is not structured well
- frequent API and package changes

=====================================================================================================================

### 35. What are LTS releases of Node.js?

**Answer:**
LTS stands Long Term Support version of Node.js that receives all the critical bug fixes along with security updates and performance improvements. These versions are supported for about 30 months (12 months Active LTS + 18 months Maintenance) and mainly focus on stability and security. The modifications done to the LTS versions are restricted to the bug fixes, security upgrade, npm, and documentation updates, performance improvement, etc.

=====================================================================================================================

## To Do – questions without answers yet

- Rest parameter and spread operator
- Why Node.js is single threaded?
- Use of the "this" keyword
- Synchronous and asynchronous means
- Difference between local, session, cookie storage
- Shallow copy v/s deep copy
- Middleware
- What is express.js
- Explain routing in express
- Different status codes
- JWT token
- What is a module - an independent, reusable function or group of functions
- Purpose of module.exports
- How do you create a simple Express.js application
- What is the buffer class in Node.js
- What is the difference between fork() and spawn() methods in Node.js

---

## Coding Practice Questions

### JavaScript

- Given a string, reverse each word in the sentence.
- How to check if an object is an array or not? Provide some code.
- How to empty an array in JavaScript?
- How would you check if a number is an integer?
- Write a function that would allow you to do this?
  ```js
  var addSix = createBase(6);
  addSix(10); // returns 16
  addSix(21); // returns 27
  ```
- How would you use a closure to create a private counter?

```js
function counter() {
  var _counter = 0;
  // return an object with several functions that allow you
  // to modify the private _counter variable
  return {
    add: function(increment) { _counter += increment; },
    retrieve: function() { return 'The counter is currently at: ' + _counter; }
  }
}

// error if we try to access the private variable like below
// _counter;

// usage of our counter function
var c = counter();
c.add(5);
c.add(9);

// now we can access the private variable in the following way
c.retrieve(); // => The counter is currently at: 14
```

- Polyfill of: forEach, map, filter, reduce, every, some, indexOf, includes, find, findIndex, flat

### Front end coding

1. two button --> plus and minus ---> click on plus will incement the number and click on minus will decrement the number
2. On button click increment the number.

### Array problems

- Q1: Write a program to find duplicate elements in an array?
- Q2: Write a program to find second largest element in an array of integers?
- Q3: Maximum consecutive ones (or zeros) in a binary array?
- Q4: Write a program to find all pairs of elements in an integer array whose sum is equal to a given number?
- Q5: Write a program to find continuous sub array whose sum is equal to a given number?
- Q6: Write a program to find the intersection of two arrays?
- Q7: Write a program to find a missing number in an integer array?
- Q8: Write a program to count occurrences of each element in an array?
- Q10: Count Distinct element in every k size window
- Q9: Find a rotation with maximum hamming distance?

### String problems

- Print duplicate characters from a string?
- Check if two strings are anagrams or not
- Check if a string is a rotated palindrome or not
- Count number of substrings in a string
- Q12: Check if two strings are k-anagrams or not
- Q13: Check for Balanced Brackets
- Q16: Find all possible palindromic substrings of a string
- Q17: Find the longest substring of a string containing distinct characters
- Q19: Find first k non-repeating characters in a string in a single traversal
- Q20: Check if a repeated subsequence is present in a string or not

=====================================================================================================================
