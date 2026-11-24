# Python – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. Read a CSV and fill null values with the median

   *(Asked 1×: Accenture)*

==> Use **pandas**: `read_csv` loads the file into a **DataFrame**, empty cells become **`NaN`**,
and `fillna()` replaces them with each column's **median**.
- **Median** = the middle value when sorted. Outliers don't pull it, so it's safer than the mean.
- `numeric_only=True` = use only number columns (you can't take the median of text).

```python
import pandas as pd

# data.csv:
# name,age,salary
# A,25,50000
# B,,60000
# C,35,
# D,40,90000

df = pd.read_csv("data.csv")
print(df.isnull().sum())                        # how many NaNs per column: age 1, salary 1

df = df.fillna(df.median(numeric_only=True))    # each number column gets its own median
print(df)
# Output:
#   name   age   salary
# 0    A  25.0  50000.0
# 1    B  35.0  60000.0     <- median of 25, 35, 40
# 2    C  35.0  60000.0     <- median of 50000, 60000, 90000
# 3    D  40.0  90000.0

# One column only:
# df["salary"] = df["salary"].fillna(df["salary"].median())
```

In short: `read_csv` → `median(numeric_only=True)` → `fillna()`.

---

2. Python + SQLite: employees with more than 3 leave requests last month

   *(Asked 1×: Accenture)*

==> Use the built-in **`sqlite3`** module (no install needed). Filter rows to last month,
**`GROUP BY`** employee, keep groups with **`HAVING COUNT(*) > 3`**.
- **`WHERE`** filters rows *before* grouping; **`HAVING`** filters groups *after* counting.
- Pass user values with **`?` placeholders** – safe from SQL injection.

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
- Tip: `with sqlite3.connect(...) as conn:` commits/rolls back the transaction for you (it does not
  close the connection).

In short: `sqlite3` + `WHERE` date range + `GROUP BY` + `HAVING COUNT(*) > 3`.

---

3. Union of three lists

   *(Asked 1×: Deloitte USI AI (YT))*

==> **Union** = every value that is in any of the lists, with no duplicates. Convert the lists to
**sets** and combine them with **`|`** (or `set.union`).

```python
a = [1, 2, 3]
b = [3, 4, 5]
c = [5, 6, 1]

result = set(a) | set(b) | set(c)          # or set(a).union(b, c)
print(sorted(result))                      # Output: [1, 2, 3, 4, 5, 6]

# Keep first-seen order (sets are unordered):
print(list(dict.fromkeys(a + b + c)))      # Output: [1, 2, 3, 4, 5, 6]
```

- Time: O(total items) – set lookups are O(1) on average.

In short: `set(a) | set(b) | set(c)`; use `dict.fromkeys` when order matters.

---

4. Merge two hash maps, keeping only distinct keys

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

If they just mean "merge, each key once":

```python
print({**d1, **d2})   # Output: {'a': 1, 'b': 20, 'c': 3, 'd': 4}
print(d1 | d2)        # same, Python 3.9+ – the second dict wins on a clash
```

In short: `d1.keys() ^ d2.keys()` for keys in only one dict; `d1 | d2` for a normal merge.

---

5. Flatten a nested list so an ML model can use it

   *(Asked 1×: Deloitte USI AI (YT))*

==> ML libraries (scikit-learn, NumPy) want a flat list / **1-D array** of numbers. Walk the list: if
an item is a list, flatten it too (**recursion**); otherwise add it.

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

- Only one level deep: `[x for sub in data for x in sub]` (every item must be a list).
- Equal-size numeric lists: `numpy.array(data).flatten()` (copy) or `.ravel()` (view when possible).
- Very deep nesting can hit Python's **recursion limit** (~1000); use a stack-based loop then.

In short: list → recurse, value → append.

---

6. What are the data structures in Python?

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
- For data work: **NumPy arrays** and **pandas DataFrames**.

In short: list = ordered and changeable, tuple = fixed, set = unique items, dict = key → value.

---

7. Mutable vs immutable types in Python

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

Interview trap: a **mutable default argument** is created once and shared across calls.

```python
def add(x, items=[]):
    items.append(x)
    return items

print(add(1))  # Output: [1]
print(add(2))  # Output: [1, 2]   <- same list reused!
# Fix: def add(x, items=None): items = [] if items is None else items
```

In short: list/dict/set change in place; int/str/tuple make new objects.

---

8. What is a closure in Python?

   *(Asked 1×: 20+ MNC AI interviews (YT))*

==> A **closure** is an inner function that **remembers variables from its outer function**, even
after the outer function has returned.
- Used for: function factories, small private state, **decorators**.
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

Gotcha (late binding): closures in a loop see the variable's **final** value.

```python
fns = [lambda: i for i in range(3)]
print([f() for f in fns])   # Output: [2, 2, 2]
# Fix: lambda i=i: i  ->  [0, 1, 2]
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
