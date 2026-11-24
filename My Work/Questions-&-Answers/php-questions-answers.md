# PHP – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. Multidimensional array and string function programs

   *(Asked 1×: Interview, no company)*

==> A **multidimensional array** in PHP is an array whose items are arrays, like rows of a table.
Loop it with nested `foreach`, and read a cell with two keys: `$arr[row][column]`.

Common **string functions**: `strlen`, `strtoupper`, `ucfirst`, `str_replace`, `explode`,
`implode`, `substr`, `strrev`.

```php
<?php
$users = [
    ["name" => "amit",  "city" => "pune"],
    ["name" => "priya", "city" => "delhi"],
];

foreach ($users as $user) {
    echo ucfirst($user["name"]) . " lives in " . strtoupper($user["city"]) . "\n";
}
// Output:
// Amit lives in PUNE
// Priya lives in DELHI

echo $users[1]["name"] . "\n";                            // priya
echo implode(", ", array_column($users, "name")) . "\n";  // amit, priya
echo str_replace("world", "PHP", "hello world") . "\n";   // hello PHP
echo substr("interview", 0, 5) . "\n";                    // inter
```

In short: nested `foreach` to loop, `$arr[i][key]` to read, string functions to format.

---

2. Define an array, unset an element, then implode it

   *(Asked 1×: Interview, no company)*

==> Three functions to know:
- **`unset()`** removes an element by key. The other keys are **not** re-numbered.
- **`implode()`** joins the values into one string; **`explode()`** does the opposite.
- **`array_values()`** re-indexes the keys to 0, 1, 2...

```php
<?php
$fruits = ["apple", "banana", "mango", "grapes"];
unset($fruits[1]);                 // remove "banana" → keys are now 0, 2, 3
echo implode(", ", $fruits);       // Output: apple, mango, grapes

$fruits = array_values($fruits);   // keys back to 0, 1, 2
print_r(explode(", ", "a, b"));    // Array ( [0] => a [1] => b )
```

In short: `unset` removes, `implode` joins, `explode` splits.

---

3. Get the 2nd highest number from an array without built-in functions

   *(Asked 1×: Interview, no company)*

==> Loop **once** and keep two variables: `$first` (highest) and `$second`. No `sort`, `max` or
`count` needed, and it runs in **O(n)**.

```php
<?php
function secondHighest($arr) {
    $first = null;
    $second = null;
    foreach ($arr as $n) {
        if ($first === null || $n > $first) {
            $second = $first;      // old highest becomes second
            $first = $n;
        } elseif ($n < $first && ($second === null || $n > $second)) {
            $second = $n;
        }
    }
    return $second;                // null if there is no 2nd highest
}

echo secondHighest([10, 45, 32, 45, 8]);   // Output: 32
```

The duplicate 45 is skipped by `$n < $first`, so the answer is 32, not 45.

In short: one loop, two variables, update `second` whenever `first` changes.

---

4. Array and string logic questions without built-in functions

   *(Asked 1×: Interview, no company)*

==> The interviewer wants you to do by hand what `strlen`, `strrev`, `array_reverse`,
`array_unique` and `count` do. Use loops and indexes. Key trick: a PHP string can be read like
an array, so `$s[0]` is the first character.

```php
<?php
// 1) String length without strlen
function myStrlen($s) {
    $i = 0;
    while (isset($s[$i])) { $i++; }
    return $i;
}

// 2) Reverse a string without strrev
function reverseString($s) {
    $out = "";
    for ($i = myStrlen($s) - 1; $i >= 0; $i--) { $out .= $s[$i]; }
    return $out;
}

// 3) Palindrome check
function isPalindrome($s) {
    return $s === reverseString($s);
}

// 4) Reverse an array without array_reverse
function reverseArray($arr) {
    $n = 0;
    foreach ($arr as $v) { $n++; }          // count without count()
    $out = [];
    for ($i = $n - 1; $i >= 0; $i--) { $out[] = $arr[$i]; }
    return $out;
}

// 5) Remove duplicates without array_unique
function uniqueValues($arr) {
    $seen = [];
    $out = [];
    foreach ($arr as $v) {
        if (!isset($seen[$v])) { $seen[$v] = true; $out[] = $v; }
    }
    return $out;
}

echo myStrlen("hello");                     // 5
echo reverseString("hello");                // olleh
var_dump(isPalindrome("madam"));            // bool(true)
print_r(reverseArray([1, 2, 3]));           // Array ( [0] => 3 [1] => 2 [2] => 1 )
print_r(uniqueValues([1, 2, 2, 3, 1]));     // Array ( [0] => 1 [1] => 2 [2] => 3 )
```

Note: `reverseArray` assumes keys 0..n-1 (a normal list).

In short: loop with an index; use `isset($s[$i])` instead of `strlen`, and a `$seen` map for
duplicates.

---

5. Flow of a cookie

   *(Asked 1×: Interview, no company)*

==> A **cookie** is small data stored in the **browser**. In PHP:
1. You call **`setcookie()`**. PHP adds a **`Set-Cookie`** header to the response, so call it
   before any output.
2. The browser saves the cookie (name, value, expiry, path, domain).
3. On every later request to that site, the browser sends it back in the **`Cookie`** header.
4. PHP puts it in **`$_COOKIE`**.
5. It is removed when it expires, or when you set it again with a past time.

```php
<?php
setcookie("theme", "dark", [
    "expires"  => time() + 3600,   // 1 hour
    "path"     => "/",
    "secure"   => true,            // only over HTTPS
    "httponly" => true,            // JavaScript cannot read it
    "samesite" => "Lax",           // helps against CSRF
]);

echo $_COOKIE["theme"] ?? "not set";      // 1st request: not set, next request: dark
setcookie("theme", "", time() - 3600);    // delete
```

Interview tip: `$_COOKIE` is empty on the same request where you call `setcookie()`; the value
appears from the next request.

In short: `setcookie()` → browser stores it → browser sends it back → `$_COOKIE`.

---

6. Flow of a session

   *(Asked 1×: Interview, no company)*

==> A PHP **session** keeps user data on the **server**. The browser holds only the **session
ID**.
1. **`session_start()`** creates a new session ID, or reuses the one the browser sent.
2. PHP sends the ID to the browser in a cookie named **`PHPSESSID`**.
3. Data you put in **`$_SESSION`** is saved on the server, by default in a file named after the
   ID.
4. Next request: the browser sends `PHPSESSID` → PHP loads that file → `$_SESSION` is filled.
5. Logout: `session_unset()` + `session_destroy()`. Old sessions are also cleaned up after
   `session.gc_maxlifetime` (1440 s by default).

```php
<?php
session_start();
$_SESSION["user_id"] = 42;          // save
echo $_SESSION["user_id"];          // Output: 42 (on any page after session_start())

session_regenerate_id(true);        // new ID after login (stops session fixation)
session_unset();                    // logout: clear data
session_destroy();                  //         delete the session
```

```text
+--------------------------------+------------------------------------+
| Cookie                         | Session                            |
+================================+====================================+
| Stored in the browser          | Stored on the server               |
+--------------------------------+------------------------------------+
| User can see / edit it         | User sees only the ID              |
+--------------------------------+------------------------------------+
| Size limit ~4 KB               | No small limit                     |
+--------------------------------+------------------------------------+
| Read with $_COOKIE             | Read with $_SESSION                |
+--------------------------------+------------------------------------+
```

In short: data on the server, only `PHPSESSID` in the browser cookie.

---

7. Where are session files stored?

   *(Asked 1×: Interview, no company)*

==> On the server, in the folder set by **`session.save_path`** in `php.ini`. Each file is named
**`sess_<session_id>`**.
- Linux: usually `/var/lib/php/sessions` or `/tmp`.
- Windows (XAMPP): `C:\xampp\tmp`.
- Check it with `echo session_save_path();` or `phpinfo()`.
- With **`session.save_handler`** you can store sessions in **Redis**, Memcached or a database
  instead. You need that when you run several servers behind a load balancer.

```php
<?php
echo session_save_path();   // e.g. /var/lib/php/sessions
```

In short: `session.save_path`, one `sess_<id>` file per user; use Redis for many servers.

---

8. GET vs POST

   *(Asked 1×: Interview, no company)*

==> In PHP you read GET data from **`$_GET`** and POST data from **`$_POST`**. Use GET to read data
and POST to create or change data.

```text
+-------------------------------------+--------------------------------------------+
| GET                                 | POST                                       |
+=====================================+============================================+
| Data in the URL (?id=5)             | Data in the request body                   |
+-------------------------------------+--------------------------------------------+
| Visible, saved in history/bookmarks | Not shown in the URL                       |
+-------------------------------------+--------------------------------------------+
| Limited length (URL limit)          | Large data and file uploads ($_FILES)      |
+-------------------------------------+--------------------------------------------+
| Read data (search, filters)         | Create/change data (forms, login, upload)  |
+-------------------------------------+--------------------------------------------+
| Can be cached / bookmarked          | Not cached by default                      |
+-------------------------------------+--------------------------------------------+
| PHP: $_GET                          | PHP: $_POST                                |
+-------------------------------------+--------------------------------------------+
```

```php
<?php
// URL: /search.php?q=php
echo $_GET["q"] ?? "";                               // Output: php

// form with method="post" and <input name="email">
$email = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL);
echo $_SERVER["REQUEST_METHOD"];                    // POST
```

Interview tip: POST is not encrypted by itself; only HTTPS makes it safe. Never send passwords with
GET.

In short: GET = URL, for reading; POST = body, for changing; `$_GET` / `$_POST`.

---

9. Errors in PHP

   *(Asked 1×: Interview, no company)*

==> Main error types (PHP 8):
- **Parse / syntax error**: the code is wrong (e.g. missing `;`), so the script doesn't run.
- **Fatal error**: the script stops, e.g. calling a function that doesn't exist. In PHP 7+ this
  is thrown as an **`Error`** you can catch.
- **Warning**: the script continues, e.g. `include` of a missing file, or an undefined variable or
  array key (these were Notices before PHP 8).
- **Notice**: a minor hint; the script continues.
- **Deprecated**: the feature will be removed in a future PHP version.

Handling them:
- Development: `error_reporting(E_ALL)` + `display_errors = On`.
- Production: `display_errors = Off`, `log_errors = On` (written to the `error_log` file).
- **`try / catch`** for exceptions. Catch **`Throwable`** to get both `Exception` and `Error`.
- **`set_error_handler()`** / **`set_exception_handler()`** for custom handling.

```php
<?php
try {
    $x = intdiv(10, 0);
} catch (DivisionByZeroError $e) {
    echo "Error: " . $e->getMessage();
} finally {
    echo " - done";
}
// Output: Error: Division by zero - done

echo $undefined;   // Warning: Undefined variable $undefined (script continues)
```

In short: show all errors in dev, log them in prod, catch `Throwable`.

---

10. Can we inherit a final class / method in PHP?

    *(Asked 1×: Interview, no company)*

==> No.
- A **`final` class** cannot be extended at all.
- A **`final` method** cannot be **overridden**. The class can still be extended, and the child
  can still **call** that method.
- Breaking either rule gives a **fatal error** when the class is declared.

```php
<?php
final class Payment {}
// class Upi extends Payment {}   // Fatal error: Class Upi cannot extend final class Payment

class Base {
    final public function id() { return 1; }
}
class Child extends Base {        // OK: Base is not final
    // public function id() {}   // Fatal error: Cannot override final method Base::id()
}
echo (new Child)->id();           // Output: 1 (inherited and usable)
```

Use `final` to lock important logic (payments, security checks) so nobody changes it by extending.

In short: final class = no child class; final method = no override, but it can still be called.

======================================================================================================================================

## What to study first

```
Arrays & strings          (used in every PHP program)
   ↓
Logic without built-ins   (loops + indexes: 2nd highest, reverse, unique)
   ↓
GET vs POST               (how data reaches PHP)
   ↓
Cookies → Sessions        (keeping user state between requests)
   ↓
Errors & error handling
   ↓
OOP: final class / method
```

Arrays, strings and loops are the foundation; the "without built-in functions" programs are just
practice of them.
GET/POST, cookies and sessions explain the request-to-request flow, and sessions build on cookies
(the session ID lives in a cookie).
