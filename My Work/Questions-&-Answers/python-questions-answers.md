# Python – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

##### 1. Read a CSV and fill null values with the median

*(Asked 1×: Accenture)*

==> Read the file with the built-in **`csv`** module. The empty cells are the **null values**. For
each number column, find the **median** of the filled cells with **`statistics.median()`**, then
put it into the empty cells.
- **Median** = the middle value when sorted. Outliers don't pull it, so it's safer than the mean.

```python
import csv
from statistics import median

# data.csv:
# name,age,salary
# A,25,50000
# B,,60000
# C,35,
# D,40,90000

with open("data.csv", newline="") as f:
    rows = list(csv.DictReader(f))

for col in ["age", "salary"]:                              # number columns only
    med = median(float(r[col]) for r in rows if r[col] != "")
    for r in rows:
        r[col] = float(r[col]) if r[col] != "" else med    # fill empty cells

for r in rows:
    print(r["name"], r["age"], r["salary"])
# Output:
# A 25.0 50000.0
# B 35.0 60000.0     <- median of 25, 35, 40
# C 35.0 60000.0     <- median of 50000, 60000, 90000
# D 40.0 90000.0
```

In short: read the rows → median of the filled cells per column → put it in the empty cells.

---

##### 2. Python + SQLite: employees with more than 3 leave requests last month

*(Asked 1×: Accenture)*

==> Use the built-in **`sqlite3`** module (no install needed). Filter rows to last month,
**`GROUP BY`** employee, keep groups with **`HAVING COUNT(*) > 3`**.
- **`WHERE`** filters rows *before* grouping; **`HAVING`** filters groups *after* counting.

```python
import sqlite3

conn = sqlite3.connect("company.db")
cur = conn.cursor()

query = """
SELECT e.id, e.name, COUNT(*) AS leave_count
FROM employees e
JOIN leave_requests l ON l.employee_id = e.id
WHERE l.request_date >= date('now', 'start of month', '-1 month')
  AND l.request_date <  date('now', 'start of month')
GROUP BY e.id, e.name
HAVING COUNT(*) > ?;
"""
for row in cur.execute(query, (3,)):
    print(row)          # e.g. (7, 'Ravi', 5)

conn.close()
```

- `date('now', 'start of month', '-1 month')` = first day of last month.
- `< date('now', 'start of month')` = stops before this month starts.

In short: `sqlite3` + `WHERE` date range + `GROUP BY` + `HAVING COUNT(*) > 3`.

---

##### 3. Union of three lists

*(Asked 1×: Deloitte USI AI (YT))*

==> **Union** = every value that is in any of the lists, with no duplicates. Convert the lists to
**sets** and combine them with **`|`** (or `set.union`).

```python
a = [1, 2, 3]
b = [3, 4, 5]
c = [5, 6, 1]

result = set(a) | set(b) | set(c)          # or set(a).union(b, c)
print(sorted(result))                      # Output: [1, 2, 3, 4, 5, 6]
```

- Time: O(total items) – set lookups are O(1) on average.

In short: `set(a) | set(b) | set(c)`.

---

##### 4. Merge two hash maps, keeping only distinct keys

*(Asked 1×: Deloitte USI AI (YT))*

==> In Python a hash map is a **`dict`**. "Distinct keys" = keys that are in only **one** of the two
dicts (drop keys both have). Dict key views support set operations, so use **`^`** (symmetric
difference).

```python
d1 = {"a": 1, "b": 2, "c": 3}
d2 = {"b": 20, "d": 4}

distinct = d1.keys() ^ d2.keys()                     # {'a', 'c', 'd'}
merged = {k: d1[k] if k in d1 else d2[k] for k in sorted(distinct)}
print(merged)                                        # Output: {'a': 1, 'c': 3, 'd': 4}
```

In short: `d1.keys() ^ d2.keys()` gives the keys in only one dict; build the merged dict from them.

---

##### 5. Flatten a nested list so an ML model can use it

*(Asked 1×: Deloitte USI AI (YT))*

==> An ML model expects a flat list (**1-D**) of numbers. Walk the list: if an item is a list,
flatten it too (**recursion**); otherwise add it.

```python
def flatten(items):
    out = []
    for x in items:
        if isinstance(x, list):
            out.extend(flatten(x))    # go inside the inner list
        else:
            out.append(x)
    return out

data = [1, [2, 3], [4, [5, 6]], 7]
print(flatten(data))                  # Output: [1, 2, 3, 4, 5, 6, 7]
```

In short: list → recurse, value → append.

---

##### 6. What are the data structures in Python?

*(Asked 1×: Accenture)*

==> Four main **built-in** ones:

```text
+-----------+-------------+-----------------------------+------------+-------------+
| Structure | Example     | Ordered                     | Changeable | Duplicates  |
+===========+=============+=============================+============+=============+
| list      | [1, 2, 2]   | Yes                         | Yes        | Yes         |
+-----------+-------------+-----------------------------+------------+-------------+
| tuple     | (1, 2, 2)   | Yes                         | No         | Yes         |
+-----------+-------------+-----------------------------+------------+-------------+
| set       | {1, 2}      | No                          | Yes        | No          |
+-----------+-------------+-----------------------------+------------+-------------+
| dict      | {"a": 1}    | Yes (insertion order, 3.7+) | Yes        | Keys unique |
+-----------+-------------+-----------------------------+------------+-------------+
```

```python
nums = [1, 2, 2]; nums.append(3)        # [1, 2, 2, 3]
point = (10, 20)                        # fixed, can be a dict key
uniq = set([1, 2, 2])                   # {1, 2}
user = {"name": "Asha"}; user["age"] = 30
print(nums, point, uniq, user)
# Output: [1, 2, 2, 3] (10, 20) {1, 2} {'name': 'Asha', 'age': 30}
```

- Also: `str`, and from **`collections`**: `deque` (fast queue), `Counter`, `defaultdict`,
  `namedtuple`.

In short: list = ordered and changeable, tuple = fixed, set = unique items, dict = key → value.

---

##### 7. Mutable vs immutable types in Python

*(Asked 1×: 20+ MNC AI interviews (YT))*

==> **Mutable** = can be changed in place. **Immutable** = can't; a "change" creates a new object.

```text
+---------------------------------+--------------------------------------------+
| Mutable                         | Immutable                                  |
+=================================+============================================+
| list, dict, set, bytearray      | int, float, bool, str, tuple, frozenset,   |
|                                 | bytes                                      |
+---------------------------------+--------------------------------------------+
| Same object (id) after change   | New object after "change"                  |
+---------------------------------+--------------------------------------------+
| Not hashable – can't be a dict  | Hashable – can be a dict key (a tuple only |
| key or set item                 | if everything inside it is hashable)       |
+---------------------------------+--------------------------------------------+
```

```python
a = [1, 2]
print(id(a)); a.append(3); print(id(a))   # same id -> same list changed: [1, 2, 3]

s = "hi"
print(id(s)); s = s + "!"; print(id(s))   # different id -> a NEW string
```

In short: list/dict/set change in place; int/str/tuple make new objects.

---

##### 8. What is a closure in Python?

*(Asked 1×: 20+ MNC AI interviews (YT))*

==> A **closure** is an inner function that **remembers variables from its outer function**, even
after the outer function has returned.
- Reading the outer variable works directly; to **change** it, declare it **`nonlocal`**.

```python
def make_counter():
    count = 0
    def inc():
        nonlocal count      # without this: UnboundLocalError
        count += 1
        return count
    return inc

c = make_counter()
print(c(), c(), c())        # Output: 1 2 3  -> inc still remembers 'count'
print(c.__closure__[0].cell_contents)   # Output: 3 (the remembered value)
```

In short: inner function + remembered outer variables = closure; use `nonlocal` to modify them.

======================================================================================================================================

## What to study first

```
Data structures          (list, tuple, set, dict are used in every answer)
   ↓
Mutable vs immutable     (explains how those structures behave)
   ↓
Closures                 (functions remembering variables)
   ↓
Coding: union, merge dicts, flatten list   (sets, dicts, recursion)
   ↓
pandas CSV + median, sqlite3 GROUP BY/HAVING   (data tasks)
```

Data structures and mutable vs immutable are the foundation. Union, merging hash maps and flattening
are direct practice of sets, dicts and lists.
The pandas and SQLite questions build on that and are the most "real work" style questions, so
practice writing them from memory.
