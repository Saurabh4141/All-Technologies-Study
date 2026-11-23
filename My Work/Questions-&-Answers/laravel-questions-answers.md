# Laravel – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. Cross-site attacks (XSS / CSRF): how do they work and how do you handle them?
   *(Asked 1×: Interview, no company)*

==> **XSS (Cross-Site Scripting)**: an attacker gets their own `<script>` into your page (saved in
    data like a comment or name, or put in a URL). When another user opens the page, the script
    runs in their browser and can steal data.
    - Laravel fix: Blade `{{ $value }}` escapes HTML automatically. Avoid `{!! $value !!}` for user
      input (or clean it first).

    **CSRF (Cross-Site Request Forgery)**: a bad site makes a logged-in user's browser send a
    request (e.g. "transfer money") to your site, using their cookies.
    - Laravel fix: the `VerifyCsrfToken` middleware checks a secret token on every
      POST/PUT/PATCH/DELETE. Add `@csrf` in forms.
    - Also: `SameSite` cookies.

    ```php
    <form method="POST" action="/profile">
        @csrf                       {{-- hidden _token field --}}
        <input name="name" value="{{ old('name') }}">   {{-- escaped output --}}
    </form>
    ```

    +--------------------------------------------+--------------------------------------------+
    | XSS                                        | CSRF                                       |
    +============================================+============================================+
    | Runs attacker's script in the victim's     | Sends a request as the victim without them |
    | browser                                    | knowing                                    |
    +--------------------------------------------+--------------------------------------------+
    | Fix: escape output (`{{ }}`)               | Fix: CSRF token (`@csrf`)                  |
    +--------------------------------------------+--------------------------------------------+

---

2. How will you secure your application?
   *(Asked 1×: Interview, no company)*

==> In any web app: validate input, use parameterized queries, escape output, protect forms
    against CSRF, use strong auth and permissions, rate-limit, and keep secrets and software safe.
    Main steps in Laravel:
    1. **Validation**: validate every input (`$request->validate()` / Form Requests).
    2. **SQL injection**: use Eloquent / Query Builder (they bind values); never put raw input into
       `DB::raw`.
    3. **XSS**: output with `{{ }}`.
    4. **CSRF**: `@csrf` in forms.
    5. **Auth**: Sanctum / Breeze; passwords hashed with `Hash::make` (bcrypt).
    6. **Authorization**: Gates and Policies, `can` middleware.
    7. **Mass assignment**: set `$fillable` on models.
    8. **Rate limiting**: `throttle` middleware on login and APIs.
    9. **Config**: secrets in `.env`, `APP_DEBUG=false` in production, HTTPS only.
    10. Keep Laravel and packages updated (`composer audit`).

---

3. What types of security have you used in your app?
   *(Asked 1×: Interview, no company)*

==> Sample answer:
    "In my project I used **Sanctum token authentication** for the APIs and **Policies** so users
    can only edit their own records. All input goes through **Form Request validation**. I used
    **Eloquent** everywhere, so queries are parameterized and safe from SQL injection. Forms have
    **@csrf**, Blade escapes output against **XSS**, passwords are **hashed** with bcrypt, and
    login/API routes have the **throttle** (rate limit) middleware. Secrets are in `.env`, debug is
    off in production and the site runs on **HTTPS**."

    Interview tip: name 4–5 real things you did and say *why* each one protects the app.

---

4. Where should sensitive files be saved for security?
   *(Asked 1×: Interview, no company)*

==> In any web app: outside the web root (the folder the web server serves), so no URL can reach
    them; give them out only through code that checks permission.
    In Laravel: outside the `public/` folder — in `storage/app` (the "local" / private disk). Only
    `public/` is reachable by URL.
    - Give access through a controller that checks the user first, or with a **temporary signed
      URL** (for S3).
    - Secrets (DB password, API keys) go in `.env`, which is never committed to git.
    - Do NOT run `storage:link` for private files; that link is only for public ones
      (`storage/app/public`).

    ```php
    // save privately
    $path = $request->file('document')->store('documents');   // storage/app/documents

    // download only after a permission check
    public function download(Document $doc) {
        $this->authorize('view', $doc);
        return Storage::download($doc->path);
    }
    ```

---

5. How do you store data in a Sanctum token?
   *(Asked 1×: Interview, no company)*

==> A Sanctum token is NOT a JWT — it is a random string. The token's **hash** is stored in the
    `personal_access_tokens` table, linked to the user. You can't put custom data inside the token
    string itself.
    What you can store with it:
    - A **name** and **abilities** (permissions) when you create it.
    - An **expiry** date (Laravel 10+).
    - Any other data: get the user from the token (`$request->user()`) and read it from the DB, or
      add your own column to `personal_access_tokens`.

    ```php
    $token = $user->createToken('mobile-app', ['orders:read', 'orders:create'])->plainTextToken;
    return response()->json(['token' => $token]);

    // later, on a route protected by auth:sanctum
    $request->user();                                   // the token's owner
    $request->user()->tokenCan('orders:create');        // true / false
    ```

    In short: data lives in the database; the token only points to it.

---

6. Types of authentication after user login
   *(Asked 1×: Interview, no company)*

==> After login, the app must remember who the user is. Two general ways: a server-side
    **session** (the browser keeps a session-ID cookie), or a **token** the client sends with each
    request (random API token, JWT, OAuth2 access token). Common ways in Laravel:

    +-------------------+--------------------------------------------+-------------------------------------+
    | Type              | How it works                               | Used for                            |
    +===================+============================================+=====================================+
    | Session (cookie)  | `web` guard; session ID in a cookie        | Normal websites (Breeze, Jetstream) |
    +-------------------+--------------------------------------------+-------------------------------------+
    | Sanctum API token | Bearer token checked against DB            | Mobile apps, simple APIs            |
    +-------------------+--------------------------------------------+-------------------------------------+
    | Sanctum SPA       | Session cookie + CSRF for your own         | Vue/React SPA on same domain        |
    |                   | frontend                                   |                                     |
    +-------------------+--------------------------------------------+-------------------------------------+
    | Passport (OAuth2) | Access + refresh tokens                    | Third-party apps, "login with"      |
    +-------------------+--------------------------------------------+-------------------------------------+
    | JWT (package)     | Signed token, no DB lookup                 | Stateless APIs                      |
    +-------------------+--------------------------------------------+-------------------------------------+

    Also: "Remember me" cookie, social login (Socialite), and two-factor auth (Fortify).

---

7. How do tokens work?
   *(Asked 1×: Interview, no company)*

==> A token is a string the server gives the client after login; the client sends it with every
    request to prove who it is, instead of using a server session. Steps:
    1. User logs in with email + password.
    2. Server checks them and creates a token, then returns it.
    3. Client saves it (mobile storage / memory).
    4. Each request sends `Authorization: Bearer <token>`.
    5. Server checks the token (Sanctum: looks up its hash in DB; JWT: checks the signature) and
       finds the user.
    6. Logout = delete the token (or let it expire).

    In Laravel (Sanctum):

    ```php
    // login
    $token = $user->createToken('api')->plainTextToken;

    // protected route
    Route::middleware('auth:sanctum')->get('/me', fn (Request $r) => $r->user());

    // logout
    $request->user()->currentAccessToken()->delete();
    ```

    Interview tip: tokens make APIs **stateless** (no server session). A JWT is signed, not
    encrypted — anyone can read its payload, so never put secrets in it.

---

8. How does a Laravel request flow?
   *(Asked 1×: Interview, no company)*

==> Request lifecycle:
    1. All requests enter `public/index.php`.
    2. It loads Composer autoload and creates the app (`bootstrap/app.php`, the service container).
    3. The **HTTP Kernel** runs global middleware and boots the **service providers**.
    4. The **Router** matches the URL to a route and runs the route's middleware (auth, throttle…).
    5. The **Controller** (or closure) runs: validation, models / database, business logic.
    6. It returns a **Response** (view, JSON, redirect).
    7. The response goes back out through the middleware and is sent to the browser.

    ```
    Browser → public/index.php → Kernel + middleware → Router → Controller → Model/View → Response → Browser
    ```

---

9. URL request flow
   *(Asked 1×: Interview, no company)*

==> What happens when you open a URL like `https://shop.com/products/5`:
    1. **DNS** turns `shop.com` into the server's IP address.
    2. Browser opens a **TCP** connection and an **HTTPS (TLS)** handshake.
    3. Browser sends the HTTP request (`GET /products/5`).
    4. Web server (**Nginx/Apache**) gets it and passes it to the app; for Laravel that is
       **PHP-FPM** → `public/index.php`.
    5. Laravel runs it: middleware → route `products/{id}` → controller → database.
    6. Laravel returns an HTML/JSON response; the server sends it back.
    7. Browser renders the page and loads CSS/JS/images.

    In short: DNS → server → index.php → route → controller → response → browser.

---

10. What is a facade in Laravel?
   *(Asked 1×: Interview, no company)*

==> A facade is a short "static-looking" way to use a service from the service container.
    `Cache::get()` looks static, but behind it Laravel finds the real cache object in the container
    and calls `get()` on it.
    - Easy to read and write.
    - Still testable: `Cache::shouldReceive('get')->andReturn(...)`.
    - Examples: `DB`, `Cache`, `Route`, `Auth`, `Log`, `Storage`.

    ```php
    use Illuminate\Support\Facades\Cache;

    Cache::put('key', 'value', 600);   // same as app('cache')->put(...)
    echo Cache::get('key');
    ```

    In short: facade = static shortcut to an object in the service container.

---

11. Laravel traits and the service container
   *(Asked 1×: Interview, no company)*

==> **Trait**: a group of methods you can reuse in many classes (PHP has single inheritance, traits
    fill the gap). Add it with `use`. Laravel examples: `HasFactory`, `SoftDeletes`, `Notifiable`,
    `HasApiTokens`.

    ```php
    trait Loggable {
        public function log($msg) { logger(static::class . ": " . $msg); }
    }
    class Order { use Loggable; }
    (new Order)->log('created');
    ```

    **Service container**: Laravel's box that creates objects and gives them their dependencies
    automatically (dependency injection).
    - `bind()` = new object each time; `singleton()` = one shared object.
    - Laravel reads type-hints in controllers/constructors and injects the right object.

    ```php
    // AppServiceProvider::register()
    $this->app->bind(PaymentGateway::class, StripeGateway::class);

    // controller: Laravel injects StripeGateway automatically
    public function pay(PaymentGateway $gateway) { $gateway->charge(100); }
    ```

    +------------------------------+---------------------------+
    | Trait                        | Service container         |
    +==============================+===========================+
    | Reuse code (methods)         | Create and inject objects |
    +------------------------------+---------------------------+
    | Compile-time copy of methods | Runtime object management |
    +------------------------------+---------------------------+

---

12. How does the rate limiter work?
   *(Asked 1×: Interview, no company)*

==> A rate limiter caps how many requests a user/IP can make in a time window (e.g. 60 per
    minute); extra requests are rejected, usually with **429 Too Many Requests**, until the window
    resets.
    In Laravel: the `throttle` middleware keeps a counter per key (user ID or IP) in the cache
    (Redis/file). When the limit is crossed it returns 429 with a `Retry-After` header. The counter
    resets after the window.

    ```php
    // AppServiceProvider::boot()
    use Illuminate\Cache\RateLimiting\Limit;
    use Illuminate\Support\Facades\RateLimiter;

    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    // routes
    Route::middleware('throttle:api')->group(function () { /* ... */ });
    Route::post('/login', ...)->middleware('throttle:5,1');   // 5 tries per 1 minute
    ```

    Used for: stopping brute-force logins, spam and API abuse.

---

13. What is middleware? Give an example
   *(Asked 1×: Interview, no company)*

==> Middleware is a filter that runs **before** (or after) a request reaches the controller. It can
    allow, block or change the request.
    - Built-in examples: `auth` (must be logged in), `throttle`, `VerifyCsrfToken`, `verified`.
    - Custom example: only admins allowed.

    ```php
    // php artisan make:middleware IsAdmin
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()?->is_admin) {
            abort(403, 'Admins only');
        }
        return $next($request);      // pass to the next step / controller
    }

    // register alias 'admin' (Kernel.php, or bootstrap/app.php in Laravel 11), then:
    Route::get('/admin', [AdminController::class, 'index'])->middleware(['auth', 'admin']);
    ```

---

14. How do you handle errors in Laravel?
   *(Asked 1×: Interview, no company)*

==> Use a few layers:
    - **try / catch** around risky code (payments, external APIs) and return a friendly message.
    - **Validation**: `$request->validate()` — on failure Laravel redirects back with errors (or
      returns 422 JSON for APIs).
    - **Exception handler**: `app/Exceptions/Handler.php` (Laravel 11: `bootstrap/app.php` →
      `withExceptions`) to report/log and render custom responses.
    - **Custom exceptions** with their own `render()` method.
    - `abort(404)` / `findOrFail()` for not-found; custom pages in
      `resources/views/errors/404.blade.php`.
    - **Logging**: `Log::error()`; logs in `storage/logs/laravel.log`.
    - `APP_DEBUG=false` in production so users never see stack traces.

    ```php
    try {
        $payment->charge($amount);
    } catch (PaymentException $e) {
        Log::error('Payment failed', ['error' => $e->getMessage()]);
        return back()->with('error', 'Payment failed, please try again.');
    }
    ```

---

15. Localization in Laravel
   *(Asked 1×: Interview, no company)*

==> Localization = showing the app in different languages.
    1. Put translations in `lang/<locale>/` files (PHP arrays) or `lang/<locale>.json`.
    2. Show text with `__('key')` or `@lang('key')`.
    3. Set the language with `App::setLocale('hi')` — usually in a middleware, from the user's
       setting, session or URL.
    4. Default and fallback language in `config/app.php` (`locale`, `fallback_locale`).

    ```php
    // lang/en/messages.php
    return ['welcome' => 'Welcome, :name'];

    // lang/hi/messages.php
    return ['welcome' => 'स्वागत है, :name'];

    // use
    App::setLocale('hi');
    echo __('messages.welcome', ['name' => 'Amit']);   // स्वागत है, Amit
    ```

    Interview tip: `trans_choice()` handles plurals (1 item / 2 items).

======================================================================================================================================

## What to study first

```
Request lifecycle / URL flow     (how every request moves through Laravel)
   ↓
Service container & facades      (how Laravel builds and gives you objects)
   ↓
Middleware                       (filters on the request path)
   ↓
Authentication, tokens, Sanctum  (who is the user)
   ↓
Security: XSS, CSRF, rate limiter, sensitive files
   ↓
Error handling, Localization
```

Request flow is the foundation: middleware, auth and the rate limiter all sit on that path.
The service container and facades explain how those pieces are created. Security questions build on
middleware and authentication, so study them after.
