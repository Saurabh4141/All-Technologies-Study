# Coding / DSA – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

##### 1. Filter even numbers and return their doubled values ([1,2,3,4,5] gives [4,8])

*(Asked 1×: Hitachi)*

==> **Approach:** keep only the even numbers (`n % 2 === 0`), then double each one.
**`filter`** picks items, **`map`** changes them.

```js
const arr = [1, 2, 3, 4, 5];
const result = arr.filter(n => n % 2 === 0).map(n => n * 2);
console.log(result); // Output: [4, 8]
```

- **Time:** O(n). **Space:** O(n) for the result.

In short: filter the evens, map them to double.

---

##### 2. Reverse all words in an array

*(Asked 1×: TCS)*

==> **Approach:** for each word, turn it into characters, reverse them, join them back.
**`map`** runs this on every word.

```js
const words = ["hello", "world", "javascript"];
const reversed = words.map(word => word.split("").reverse().join(""));
console.log(reversed); // Output: ["olleh", "dlrow", "tpircsavaj"]
```

- **Time:** O(total characters). **Space:** O(total characters).
- If they mean "reverse the order of the words": `words.reverse()` (changes the array) or
  `[...words].reverse()` (keeps the original).

In short: split → reverse → join, inside a map.

---

##### 3. Leaders in an array

*(Asked 1×: Deloitte USI AI (YT))*

==> A **leader** is an element bigger than every element to its right. The last element is always a
leader.

**Approach:** walk from **right to left** and keep the max seen so far. If the current element is
bigger than that max, it's a leader.

```python
def leaders(arr):
    result = []
    max_right = float('-inf')
    for x in reversed(arr):
        if x > max_right:
            result.append(x)
            max_right = x
    return result[::-1]   # back to left-to-right order

print(leaders([16, 17, 4, 3, 5, 2]))  # Output: [17, 5, 2]
```

- **Time:** O(n), one pass. **Space:** O(1) extra (besides the result).

In short: scan from the right, track the max, anything bigger than the max is a leader.

---

##### 4. Flatten a nested object into an array

*(Asked 1×: EInfochips)*

==> **Approach:** loop over the keys. If the value is a plain value, push it. If it's an object, call
the same function on it (**recursion**) and spread its result in.

```js
const obj = { a: 1, b: { c: 2, d: { e: 3 } } };

const flattenObj = (obj) => {
  const result = [];
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "object" && val !== null) {
      result.push(...flattenObj(val)); // go deeper
    } else {
      result.push(val);
    }
  }
  return result;
};

console.log(flattenObj(obj)); // Output: [1, 2, 3]
```

- Check `val !== null` because `typeof null === "object"`.
- `Object.keys` skips inherited properties (a plain `for...in` would include them).
- **Time:** O(total number of values). **Space:** O(depth) for the recursion stack.

In short: plain value → push, object → recurse and spread.

---

##### 5. Compare two objects

*(Asked 1×: TCS)*

==> `obj1 === obj2` only checks whether both point to the **same reference**, not the same content.
So do a **deep compare**: same number of keys, and every key has an equal value. Recurse for nested
objects.

```js
function isEqual(a, b) {
  if (a === b) return true;                       // same value or same reference
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => Object.hasOwn(b, key) && isEqual(a[key], b[key]));
}

console.log({ a: 1 } === { a: 1 });                                      // Output: false
console.log(isEqual({ name: "John", age: 25 }, { name: "John", age: 25 })); // Output: true
console.log(isEqual({ a: { b: 1 } }, { a: { b: 2 } }));                   // Output: false
```

- **Time:** O(total number of keys). **Space:** O(depth).

In short: `===` compares references; compare key count and values recursively for content.

---

##### 6. Longest repeated substring that appears at least twice ('banana' gives 'ana')

*(Asked 1×: ZS)*

==> **Approach:** try lengths from longest to shortest. For each length, slide a window over the
string and store each substring in a **Set**. The first substring you see twice is the answer.
Overlapping is allowed: "ana" appears at index 1 and index 3.

```js
function longestRepeatedSubstring(s) {
  for (let len = s.length - 1; len > 0; len--) {
    const seen = new Set();
    for (let i = 0; i + len <= s.length; i++) {
      const sub = s.slice(i, i + len);
      if (seen.has(sub)) return sub;
      seen.add(sub);
    }
  }
  return "";
}

console.log(longestRepeatedSubstring("banana")); // Output: "ana"
console.log(longestRepeatedSubstring("abcd"));   // Output: ""
```

- **Time:** O(n³) worst case (n lengths × n windows × slicing up to n chars). **Space:** O(n²).

In short: longest length first, Set of windows, first duplicate wins.

---

##### 7. Detect a loop / cycle in a linked list

*(Asked 1×: ZS)*

==> **Approach:** Floyd's **"tortoise and hare"**. Move `slow` 1 step and `fast` 2 steps. If they
ever meet, there is a loop. If `fast` reaches the end (`null`), there is no loop.

```js
class Node {
  constructor(val) { this.val = val; this.next = null; }
}

function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

const a = new Node(1), b = new Node(2), c = new Node(3);
a.next = b; b.next = c;
console.log(hasCycle(a)); // Output: false
c.next = a;               // create a loop
console.log(hasCycle(a)); // Output: true
```

- Why they meet: inside the loop, fast gains 1 step on slow every move, so it must catch up.
- **Time:** O(n). **Space:** O(1).

In short: slow 1 step, fast 2 steps; if they meet, there's a cycle.

======================================================================================================================================

## What to study first

```
Array programs          (loops, map/filter, one-pass tricks)
   ↓
String programs         (split/reverse/join, substrings with a Set)
   ↓
Object programs         (recursion over nested keys, deep compare)
   ↓
Data structures         (linked list, two pointers)
```

Array programs are the foundation: loops plus `map`/`filter` and the right-to-left "leaders" pass.
String programs reuse the same loops with `split`/`slice` and a Set. Object programs add recursion.
Linked list cycle detection builds on pointers and the two-pointer (slow/fast) idea.
