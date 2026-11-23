# Python – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. Read a CSV and fill null values with the median
   *(Asked 1×: Accenture)*

==> Use pandas. Read the file, then fill each number column's empty cells (NaN) with that column's
    median.
    - `median()` = the middle value when sorted. It is not pulled by outliers, so it is safer than
      the mean.
    - `numeric_only=True` means only number columns are used (you cannot take a median of text).

    ```python
    import pandas as pd

    df = pd.read_csv("data.csv")
    df = df.fillna(df.median(numeric_only=True))   # fill every number column with its own median
    # one column only: df["salary"] = df["salary"].fillna(df["salary"].median())
    print(df.head())
    ```

    In short: `read_csv` → `median()` → `fillna()`.

---

2. Python + SQLite: employees with more than 3 leave requests last month
   *(Asked 1×: Accenture)*

==> Use the built-in `sqlite3` module. Filter rows to last month, `GROUP BY` employee, keep groups
    with `HAVING COUNT(*) > 3`.
    - `WHERE` filters rows before grouping; `HAVING` filters groups after counting.
    - Pass values with `?` placeholders (safe from SQL injection).

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
    HAVING COUNT(*) > 3;
    """
    for row in cur.execute(query):
        print(row)

    conn.close()
    ```

    Interview tip: `date('now','start of month','-1 month')` = first day of last month; `< start of
    this month` ends it.

---

3. Union of three lists
   *(Asked 1×: Deloitte USI AI (YT))*

==> Union = every value that is in any of the lists, with no duplicates. Turn the lists into sets
    and join them with `|` (or `set.union`).

    ```python
    a = [1, 2, 3]
    b = [3, 4, 5]
    c = [5, 6, 1]

    result = set(a) | set(b) | set(c)          # or set(a).union(b, c)
    print(sorted(result))                      # [1, 2, 3, 4, 5, 6]
    ```

    If order must be kept: `list(dict.fromkeys(a + b + c))` → `[1, 2, 3, 4, 5, 6]`.

---

4. Merge two hash maps, keeping only distinct keys
   *(Asked 1×: Deloitte USI AI (YT))*

==> In Python a hash map is a `dict`. "Distinct keys" = keys that are in only ONE of the two dicts
    (drop keys that both have). Use the `^` (symmetric difference) of the key sets.

    ```python
    d1 = {"a": 1, "b": 2, "c": 3}
    d2 = {"b": 20, "d": 4}

    distinct = d1.keys() ^ d2.keys()                       # {'a', 'c', 'd'}
    merged = {k: d1.get(k, d2.get(k)) for k in distinct}
    print(merged)                                          # {'a': 1, 'c': 3, 'd': 4}  (order may vary)
    ```

    If they only mean "merge, each key once": `merged = {**d1, **d2}` or `d1 | d2` (Python 3.9+);
    the second dict wins on a clash.

---

5. Flatten a nested list so an ML model can use it
   *(Asked 1×: Deloitte USI AI (YT))*

==> ML models want a flat list / 1-D array of numbers. Walk the list: if an item is a list, flatten
    it too (recursion); else add it.

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
    print(flatten(data))                  # [1, 2, 3, 4, 5, 6, 7]
    ```

    - Only one level deep: `[x for sub in data for x in sub]`.
    - Equal-size numeric lists: `numpy.array(data).flatten()` (or `.ravel()`).

---

6. What are the data structures in Python?
   *(Asked 1×: Accenture)*

==> Four main built-in ones:

    +-----------+-------------+-----------------------------+------------+-------------+
    | Structure | Example     | Ordered                     | Changeable | Duplicates  |
    +===========+=============+=============================+============+=============+
    | list      | `[1, 2, 2]` | Yes                         | Yes        | Yes         |
    +-----------+-------------+-----------------------------+------------+-------------+
    | tuple     | `(1, 2, 2)` | Yes                         | No         | Yes         |
    +-----------+-------------+-----------------------------+------------+-------------+
    | set       | `{1, 2}`    | No                          | Yes        | No          |
    +-----------+-------------+-----------------------------+------------+-------------+
    | dict      | `{"a": 1}`  | Yes (insertion order, 3.7+) | Yes        | Keys unique |
    +-----------+-------------+-----------------------------+------------+-------------+

    - Also: `str` (text), and from `collections`: `deque` (fast queue), `Counter`, `defaultdict`,
      `namedtuple`.
    - For data work: NumPy arrays and pandas DataFrames.

    In short: list = ordered list, tuple = fixed list, set = unique items, dict = key → value.

---

7. Mutable vs immutable types in Python
   *(Asked 1×: 20+ MNC AI interviews (YT))*

==> Mutable = can be changed in place after creation. Immutable = cannot; a "change" makes a new
    object.

    +---------------------------------+--------------------------------------------+
    | Mutable                         | Immutable                                  |
    +=================================+============================================+
    | list, dict, set, bytearray      | int, float, bool, str, tuple, frozenset,   |
    |                                 | bytes                                      |
    +---------------------------------+--------------------------------------------+
    | Same object (`id`) after change | New object after "change"                  |
    +---------------------------------+--------------------------------------------+
    | Cannot be a dict key            | Can be a dict key (hashable)               |
    +---------------------------------+--------------------------------------------+

    ```python
    a = [1, 2]; a.append(3)      # same list changed -> [1, 2, 3]
    s = "hi";   s = s + "!"      # a NEW string is created
    ```

    Interview tip: never use a mutable default argument (`def f(x=[])`) — the same list is shared
    across calls; use `x=None`.

---

8. What is a closure in Python?
   *(Asked 1×: 20+ MNC AI interviews (YT))*

==> A closure is an inner function that remembers variables from its outer function, even after the
    outer function has finished.
    - Used for: function factories, keeping small private state, decorators.
    - Use `nonlocal` to change the outer variable.

    ```python
    def make_counter():
        count = 0
        def inc():
            nonlocal count
            count += 1
            return count
        return inc

    c = make_counter()
    print(c(), c(), c())   # 1 2 3  -> inc still remembers 'count'
    ```

    In short: inner function + remembered outer variables = closure.

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
