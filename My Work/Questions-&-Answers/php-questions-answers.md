# PHP – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. Multidimensional array and string function programs
   *(Asked 1×: Interview, no company)*

==> A multidimensional array is an array whose items are arrays (like rows of a table). Loop it with
    nested `foreach`. Common string functions: `strlen`, `strtoupper`, `str_replace`, `explode`,
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
    // Amit lives in PUNE
    // Priya lives in DELHI

    echo $users[1]["name"];                           // priya
    echo implode(", ", array_column($users, "name")); // amit, priya
    echo str_replace("world", "PHP", "hello world");   // hello PHP
    ```

    Interview tip: access a cell with two keys: `$arr[row][column]`.

---

2. Define an array, unset an element, then implode it
   *(Asked 1×: Interview, no company)*

==> `unset()` removes an element by key (the other keys do NOT re-number). `implode()` joins the
    values into one string.

    ```php
    <?php
    $fruits = ["apple", "banana", "mango", "grapes"];
    unset($fruits[1]);                 // remove "banana" (keys now 0, 2, 3)
    echo implode(", ", $fruits);       // apple, mango, grapes

    $fruits = array_values($fruits);   // optional: re-index keys to 0, 1, 2
    ```

    In short: `unset` removes, `implode` joins, `explode` splits.

---

3. Get the 2nd highest number from an array without built-in functions
   *(Asked 1×: Interview, no company)*

==> Loop once and keep two variables: `first` (highest) and `second`. No `sort`, `max` or `count`
    needed.

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

    echo secondHighest([10, 45, 32, 45, 8]);   // 32
    ```

    Duplicates of the highest (45, 45) are skipped by `$n < $first`, so the answer is 32.

---

4. Array and string logic questions without built-in functions
   *(Asked 1×: Interview, no company)*

==> Interviewers ask you to do by hand what `strrev`, `strlen`, `array_reverse`, `count` do. Use
    loops and indexes. Common ones:

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
    print_r(reverseArray([1, 2, 3]));           // [3, 2, 1]
    print_r(uniqueValues([1, 2, 2, 3, 1]));     // [1, 2, 3]
    ```

    Interview tip: a string can be read like an array: `$s[0]` is the first character.

---

5. Flow of a cookie
   *(Asked 1×: Interview, no company)*

==> A cookie is a small piece of data stored in the **browser**. The server sends it in a
    `Set-Cookie` response header, and the browser sends it back in the `Cookie` request header on
    every later request to that site. This is plain HTTP, the same in every web language.
    In PHP:
    1. PHP calls `setcookie()`. This sends a `Set-Cookie` header with the response.
    2. The browser saves the cookie (name, value, expiry, path, domain).
    3. On every next request to that site, the browser sends it back in the `Cookie` header.
    4. PHP reads it from `$_COOKIE`.
    5. It is deleted when it expires, or when you set it with a past time.

    ```php
    <?php
    setcookie("theme", "dark", [
        "expires"  => time() + 3600,   // 1 hour
        "path"     => "/",
        "secure"   => true,            // only over HTTPS
        "httponly" => true,            // JavaScript cannot read it
        "samesite" => "Lax",           // helps against CSRF
    ]);

    echo $_COOKIE["theme"] ?? "not set";      // available on the NEXT request
    setcookie("theme", "", time() - 3600);    // delete
    ```

    Interview tip: `$_COOKIE` is empty on the same request where you call `setcookie()` — it appears
    from the next request.

---

6. Flow of a session
   *(Asked 1×: Interview, no company)*

==> A session stores user data on the **server**; the browser keeps only a session ID (usually in a
    cookie) and sends it with each request. Every web language/framework uses this idea.
    In PHP:
    1. `session_start()` creates a unique session ID (or reuses the existing one).
    2. PHP sends the ID to the browser in a cookie named `PHPSESSID`.
    3. Data you put in `$_SESSION` is saved in a file on the server (named after the ID).
    4. Next request: browser sends `PHPSESSID` → PHP finds the file → fills `$_SESSION`.
    5. Logout: `session_unset()` + `session_destroy()`. It also ends after the timeout
       (`session.gc_maxlifetime`).

    ```php
    <?php
    session_start();
    $_SESSION["user_id"] = 42;          // save
    echo $_SESSION["user_id"];          // read on any page after session_start()

    session_regenerate_id(true);        // new ID after login (stops session fixation)
    session_unset();                    // logout: clear data
    session_destroy();                  //         delete the session
    ```

    +--------------------------------+------------------------------------+
    | Cookie                         | Session                            |
    +================================+====================================+
    | Stored in browser              | Stored on server                   |
    +--------------------------------+------------------------------------+
    | Less secure, user can see/edit | More secure, user sees only the ID |
    +--------------------------------+------------------------------------+
    | Size limit ~4 KB               | No small limit                     |
    +--------------------------------+------------------------------------+

---

7. Where are session files stored?
   *(Asked 1×: Interview, no company)*

==> On the server, in the folder set by `session.save_path` in `php.ini`. Each file is named
    `sess_<session_id>`.
    - Linux default: usually `/tmp` or `/var/lib/php/sessions`.
    - Windows (XAMPP): `C:\xampp\tmp`.
    - Check it with `echo session_save_path();` or `phpinfo()`.
    - Sessions can also be stored in Redis, Memcached or a database (`session.save_handler`) —
      useful when you run many servers.

---

8. GET vs POST
   *(Asked 1×: Interview, no company)*

==> GET and POST are HTTP methods (same in every language): GET asks the server for data, POST
    sends data to the server to create or change something. In PHP you read them from `$_GET` and
    `$_POST`.

    +-------------------------------------+--------------------------------------------+
    | GET                                 | POST                                       |
    +=====================================+============================================+
    | Data in the URL (`?id=5`)           | Data in the request body                   |
    +-------------------------------------+--------------------------------------------+
    | Visible, saved in history/bookmarks | Not shown in URL                           |
    +-------------------------------------+--------------------------------------------+
    | Limited length (URL limit)          | Can send large data and files              |
    +-------------------------------------+--------------------------------------------+
    | Used to read data (search, filters) | Used to create/change data (forms, login,  |
    |                                     | upload)                                    |
    +-------------------------------------+--------------------------------------------+
    | Can be cached                       | Not cached by default                      |
    +-------------------------------------+--------------------------------------------+
    | PHP: `$_GET`                        | PHP: `$_POST`                              |
    +-------------------------------------+--------------------------------------------+

    Interview tip: POST is not encrypted by itself — only HTTPS makes it secure. Never send
    passwords with GET.

---

9. Errors in PHP
   *(Asked 1×: Interview, no company)*

==> Main error types:
    - **Parse / syntax error**: code is wrong (missing `;`). Script does not run.
    - **Fatal error**: script stops (calling a function that does not exist).
    - **Warning**: problem, but script continues (`include` of a missing file).
    - **Notice**: small issue, script continues (using an undefined variable/index).
    - **Deprecated**: feature will be removed in a future PHP version.

    Handling them:
    - `error_reporting(E_ALL)` + `display_errors = On` in development; Off in production and log
      them (`log_errors`, `error_log`).
    - `try / catch` for exceptions; in PHP 7+ many fatal errors are thrown as `Error`, so catch
      `Throwable` to get both.
    - `set_error_handler()` / `set_exception_handler()` for custom handling.

    ```php
    <?php
    try {
        $x = intdiv(10, 0);
    } catch (DivisionByZeroError $e) {
        echo "Error: " . $e->getMessage();   // Error: Division by zero
    } finally {
        echo " - done";
    }
    ```

---

10. Can we inherit a final class / method in PHP?
   *(Asked 1×: Interview, no company)*

==> No.
    - A `final` **class** cannot be extended (no child class).
    - A `final` **method** cannot be overridden in a child class — but the class itself can still be
      extended, and the child can still **call** that method.
    - Breaking this gives a fatal error.

    ```php
    <?php
    final class Payment {}
    // class Upi extends Payment {}   // Fatal error: cannot inherit from final class

    class Base {
        final public function id() { return 1; }
    }
    class Child extends Base {        // OK: class is not final
        // public function id() {}   // Fatal error: cannot override final method
    }
    echo (new Child)->id();           // 1  (inherited and usable)
    ```

    Use `final` when you want to lock important logic so nobody changes it by extending.

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
