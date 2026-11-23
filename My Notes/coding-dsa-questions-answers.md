# Coding / DSA – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. Filter even numbers and return their doubled values ([1,2,3,4,5] gives [4,8])
   *(Asked 1×: Hitachi)*

==> Approach: keep only the even numbers (`n % 2 === 0`), then multiply each by 2.

    ```js
    const arr = [1, 2, 3, 4, 5];
    const result = arr.filter(n => n % 2 === 0).map(n => n * 2);
    console.log(result); // [4, 8]

    // Plain loop version (if they ask without built-ins)
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] % 2 === 0) out.push(arr[i] * 2);
    }
    ```

    Time: O(n).

---

2. Reverse all words in an array
   *(Asked 1×: TCS)*

==> Approach: for each word, split into characters, reverse, join back. `map` does this for every
    word.

    ```js
    const words = ["hello", "world", "javascript"];
    const reversed = words.map(word => word.split("").reverse().join(""));
    console.log(reversed); // ["olleh", "dlrow", "tpircsavaj"]
    ```

    Time: O(total characters).

---

3. Leaders in an array
   *(Asked 1×: Deloitte USI AI (YT))*

==> A **leader** is an element bigger than every element to its right (the last element is always a
    leader).
    Approach: walk from right to left, keep the max seen so far; if the current element is greater
    than that max, it is a leader. (This was asked in a Python coding round.)

    ```python
    def leaders(arr):
        result = []
        max_right = float('-inf')
        for x in reversed(arr):
            if x > max_right:
                result.append(x)
                max_right = x
        return result[::-1]

    print(leaders([16, 17, 4, 3, 5, 2]))  # [17, 5, 2]
    ```

    Time: O(n), one pass.

---

4. Flatten a nested object into an array
   *(Asked 1×: EInfochips)*

==> Approach: loop over keys. If the value is not an object, push it; if it is an object, call the
    same function again (recursion) and spread its result.

    ```js
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } };

    const flattenObj = (obj) => {
      const result = [];
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          result.push(...flattenObj(obj[key]));
        } else {
          result.push(obj[key]);
        }
      }
      return result;
    };

    console.log(flattenObj(obj)); // [1, 2, 3]
    ```

    Time: O(total number of values).

---

5. Compare two objects
   *(Asked 1×: TCS)*

==> Approach: `obj1 === obj2` only checks if they are the same reference, so compare contents: same
    number of keys, and every key has the same value. Recurse for nested objects (deep compare).

    ```js
    function isEqual(a, b) {
      if (a === b) return true;
      if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
        return false;
      }
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => isEqual(a[key], b[key]));
    }

    console.log(isEqual({ name: "John", age: 25 }, { name: "John", age: 25 })); // true
    console.log(isEqual({ a: { b: 1 } }, { a: { b: 2 } }));                   // false
    ```

    Quick trick: `JSON.stringify(a) === JSON.stringify(b)` works only if keys are in the same order.
    Time: O(total number of keys).

---

6. Longest repeated substring that appears at least twice ('banana' gives 'ana')
   *(Asked 1×: ZS)*

==> Approach: try lengths from longest to shortest. For each length, slide over the string and store
    substrings in a Set; the first substring seen twice is the answer. (Overlapping is allowed:
    "ana" appears at index 1 and 3.)

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

    console.log(longestRepeatedSubstring("banana")); // "ana"
    ```

    Time: O(n³) worst case (fine for interviews; can be improved with binary search on length or a
    suffix array).

---

7. Detect a loop / cycle in a linked list
   *(Asked 1×: ZS)*

==> Approach: Floyd's "tortoise and hare". Move `slow` 1 step and `fast` 2 steps. If they ever meet,
    there is a loop; if `fast` reaches the end (`null`), there is no loop.

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
    a.next = b; b.next = c; c.next = a; // loop
    console.log(hasCycle(a)); // true
    ```

    Time: O(n), extra space O(1). (Simpler alternative: store visited nodes in a Set, O(n) space.)

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
