# Laravel – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

##### 1. Cross-site attacks (XSS / CSRF): how do they work and how do you handle them?

*(Asked 1×: Interview, no company)*

==> **XSS (Cross-Site Scripting)**: an attacker gets their own script into your page, for example
by saving `<script>...</script>` as a comment or name. When another user opens the page, the
script runs in their browser and can steal their session or data.
- **Laravel fix**: Blade `{{ $value }}` escapes HTML automatically (it uses `htmlspecialchars`).
- `{!! $value !!}` prints raw HTML, so never use it on user input (or clean it first).

**CSRF (Cross-Site Request Forgery)**: another site makes a logged-in user's browser send a
request to your app (e.g. "change email"). The browser adds your session cookie automatically.
- **Laravel fix**: the CSRF middleware (`VerifyCsrfToken`, called `ValidateCsrfToken` in Laravel
  11) checks a secret `_token` on every POST / PUT / PATCH / DELETE request.
- Add **`@csrf`** in every form. For AJAX, send the `X-CSRF-TOKEN` / `X-XSRF-TOKEN` header.
- Session cookies are `SameSite=lax` by default (`config/session.php`), which helps too.

```php
<form method="POST" action="/profile">
    @csrf                                            {{-- hidden _token field --}}
    <input name="name" value="{{ old('name') }}">    {{-- escaped output --}}
</form>
```

```php
{{ '<script>alert(1)</script>' }}
// Output in HTML: &lt;script&gt;alert(1)&lt;/script&gt;   (shown as text, not run)
```

```text
+--------------------------------------------+--------------------------------------------+
| XSS                                        | CSRF                                       |
+============================================+============================================+
| Runs the attacker's script in the victim's | Sends a request as the victim without      |
| browser                                    | them knowing                               |
+--------------------------------------------+--------------------------------------------+
| Laravel fix: Blade {{ }} escaping          | Laravel fix: @csrf token + CSRF middleware |
+--------------------------------------------+--------------------------------------------+
```

In short: `{{ }}` stops XSS, `@csrf` stops CSRF.

---

##### 2. How will you secure your application?

*(Asked 1×: Interview, no company)*

==> My checklist for a Laravel app:
1. **Validation**: validate every input with `$request->validate()` or **Form Requests**.
2. **SQL injection**: use **Eloquent** / Query Builder, which bind values. Never put raw input
   into `DB::raw()` or `whereRaw()` without bindings.
3. **XSS**: print with `{{ }}`, not `{!! !!}`.
4. **CSRF**: `@csrf` in every form.
5. **Authentication**: **Sanctum** / Breeze; passwords hashed with `Hash::make()` (bcrypt).
6. **Authorization**: **Gates** and **Policies**, `can` middleware, `$this->authorize()`.
7. **Mass assignment**: set `$fillable` (or `$guarded`) on models.
8. **Rate limiting**: `throttle` middleware on login and API routes.
9. **Config**: secrets in `.env`, `APP_DEBUG=false` in production, HTTPS only.
10. **Updates**: keep Laravel and packages updated; check with `composer audit`.

```php
// mass assignment protection
class User extends Model {
    protected $fillable = ['name', 'email'];   // is_admin can't be set from request data
}
User::create($request->all());                 // extra fields like is_admin are ignored
```

In short: validate input, use Eloquent, escape output, `@csrf`, policies, throttle, safe `.env`.

---

##### 3. What types of security have you used in your app?

*(Asked 1×: Interview, no company)*

==> Sample answer:
"In my project I used **Sanctum token authentication** for the APIs and **Policies** so users can
only edit their own records. All input goes through **Form Request validation**. I used
**Eloquent** everywhere, so queries are parameterized and safe from SQL injection. Forms have
**`@csrf`**, Blade escapes output against **XSS**, passwords are **hashed** with bcrypt, and
login/API routes have the **`throttle`** middleware. Secrets are in `.env`, `APP_DEBUG` is off in
production and the site runs on **HTTPS**."

Interview tip: name 4–5 real things you did and say *why* each one protects the app.

---

##### 4. Where should sensitive files be saved for security?

*(Asked 1×: Interview, no company)*

==> Outside the **`public/`** folder. Only `public/` is reachable by URL, so save private files in
**`storage/app`** (the `local` / private disk).
- Hand them out through a **controller that checks permission** first, or a **temporary signed
  URL** (`Storage::temporaryUrl()` on S3).
- Secrets (DB password, API keys) go in **`.env`**, which is never committed to git.
- `php artisan storage:link` only exposes `storage/app/public`, so never put private files there.

```php
// save privately
$path = $request->file('document')->store('documents');   // storage/app/documents/...

// download only after a permission check
public function download(Document $doc)
{
    $this->authorize('view', $doc);          // 403 if not allowed
    return Storage::download($doc->path);
}
```

In short: private files in `storage/app`, served by a controller with an auth check.

---

##### 5. How do you store data in a Sanctum token?

*(Asked 1×: Interview, no company)*

==> You don't. A **Sanctum token is not a JWT**. It's a random string, and only its **hash** is
saved in the **`personal_access_tokens`** table, linked to the user. You can't put custom data
inside the token string.

What you can store with it:
- A **name** and **abilities** (permissions) when you create it.
- An **expiry** (`expires_at`, Sanctum 3 / Laravel 10+).
- Anything else: read it from the user (`$request->user()`), or add your own column to
  `personal_access_tokens`.

```php
$token = $user->createToken('mobile-app', ['orders:read', 'orders:create'])->plainTextToken;
// e.g. "1|a8Fk2...": token id + random string

// later, on a route with auth:sanctum
$request->user();                               // the token's owner
$request->user()->tokenCan('orders:create');    // true
$request->user()->tokenCan('orders:delete');    // false
```

In short: the data lives in the database; the token only points to it.

---

##### 6. Types of authentication after user login

*(Asked 1×: Interview, no company)*

==> After login, Laravel must remember who the user is on every request. Laravel's options:

```text
+-------------------+---------------------------------------+-------------------------------------+
| Type              | How it works                          | Used for                            |
+===================+=======================================+=====================================+
| Session (cookie)  | web guard; session ID in a cookie     | Normal websites (Breeze, Jetstream) |
+-------------------+---------------------------------------+-------------------------------------+
| Sanctum API token | Bearer token, hash checked in DB      | Mobile apps, simple APIs            |
+-------------------+---------------------------------------+-------------------------------------+
| Sanctum SPA       | Session cookie + CSRF for your own    | Vue/React SPA on the same domain    |
|                   | frontend                              |                                     |
+-------------------+---------------------------------------+-------------------------------------+
| Passport (OAuth2) | Access + refresh tokens               | Third-party apps, "login with"      |
+-------------------+---------------------------------------+-------------------------------------+
| JWT (package)     | Signed token, no DB lookup            | Stateless APIs (tymon/jwt-auth)     |
+-------------------+---------------------------------------+-------------------------------------+
```

Extras: **"Remember me"** cookie, social login with **Socialite**, two-factor auth with
**Fortify**.

```php
Auth::guard('web')->user();        // session user
$request->user('sanctum');         // token user
```

In short: session for websites, Sanctum for APIs/SPAs, Passport when you need full OAuth2.

---

##### 7. How do tokens work?

*(Asked 1×: Interview, no company)*

==> The server gives the client a token after login. The client sends it on every request instead
of using a session. With **Sanctum**:
1. User logs in with email + password.
2. Laravel checks them and creates a token with `createToken()`.
3. Client saves it (mobile storage / memory).
4. Every request sends `Authorization: Bearer <token>`.
5. The **`auth:sanctum`** middleware hashes the token, finds it in `personal_access_tokens`, and
   loads the user.
6. Logout = delete the token (or let it expire).

```php
// login
$token = $user->createToken('api')->plainTextToken;

// protected route
Route::middleware('auth:sanctum')->get('/me', fn (Request $r) => $r->user());

// logout
$request->user()->currentAccessToken()->delete();
```

Interview tip: tokens make the API **stateless**. A **JWT** (via a package) is checked by its
**signature**, not a DB lookup. It is signed, not encrypted, so anyone can read its payload; never
put secrets in it.

In short: login gives a token, every request sends it, `auth:sanctum` turns it back into a user.

---

##### 8. How does a Laravel request flow?

*(Asked 1×: Interview, no company)*

==> The **request lifecycle**:
1. Every request enters **`public/index.php`**.
2. It loads Composer's autoloader and creates the app from `bootstrap/app.php` (the **service
   container**).
3. The **HTTP Kernel** boots the **service providers** and runs the global middleware.
4. The **Router** matches the URL to a route and runs that route's middleware (`auth`, `throttle`,
   ...).
5. The **Controller** (or closure) runs: validation, models, business logic.
6. It returns a **Response** (view, JSON, redirect).
7. The response goes back out through the middleware and is sent to the browser.

```text
Browser -> public/index.php -> Kernel + middleware -> Router -> Controller -> Model/View
        -> Response -> middleware -> Browser
```

In short: index.php → kernel → middleware → router → controller → response.

---

##### 9. URL request flow

*(Asked 1×: Interview, no company)*

==> What happens when you open `https://shop.com/products/5` on a Laravel site:
1. **DNS** turns `shop.com` into the server's IP.
2. The browser opens a **TCP** connection and does the **TLS** (HTTPS) handshake.
3. It sends `GET /products/5`.
4. **Nginx / Apache** receives it and passes it to **PHP-FPM**, which runs `public/index.php`.
5. Laravel handles it: middleware → route `products/{id}` → controller → Eloquent → database.
6. Laravel returns HTML or JSON; Nginx sends it back.
7. The browser renders the page and loads CSS / JS / images.

```php
Route::get('/products/{id}', [ProductController::class, 'show']);

public function show($id) {
    return view('product', ['product' => Product::findOrFail($id)]);  // 404 if missing
}
```

In short: DNS → Nginx → PHP-FPM → index.php → route → controller → response → browser.

---

##### 10. What is a facade in Laravel?

*(Asked 1×: Interview, no company)*

==> A **facade** is a static-looking shortcut to an object in the **service container**.
`Cache::get('key')` looks static, but Laravel actually finds the real cache object in the
container and calls `get()` on it.
- Short and easy to read.
- Still testable: `Cache::shouldReceive('get')->andReturn('fake')`.
- Examples: `DB`, `Cache`, `Route`, `Auth`, `Log`, `Storage`.
- Works through `getFacadeAccessor()`, which returns the container key (e.g. `'cache'`).

```php
use Illuminate\Support\Facades\Cache;

Cache::put('key', 'value', 600);   // same as app('cache')->put('key', 'value', 600)
echo Cache::get('key');            // Output: value
```

In short: facade = static shortcut to an object in the service container.

---

##### 11. Laravel traits and the service container

*(Asked 1×: Interview, no company)*

==> **Trait**: a set of methods you can reuse in many classes. PHP allows only one parent class,
and traits fill that gap. Add one with `use`. Laravel examples: `HasFactory`, `SoftDeletes`,
`Notifiable`, `HasApiTokens`.

```php
trait Loggable {
    public function log($msg) { return static::class . ": " . $msg; }
}
class Order { use Loggable; }

echo (new Order)->log('created');   // Output: Order: created
```

**Service container**: Laravel's object factory. It creates objects and injects their
dependencies automatically (**dependency injection**).
- `bind()` = a new object each time; `singleton()` = one shared object.
- Laravel reads type-hints in controllers and constructors and injects the right object.

```php
// AppServiceProvider::register()
$this->app->bind(PaymentGateway::class, StripeGateway::class);

// controller: Laravel injects a StripeGateway automatically
public function pay(PaymentGateway $gateway) { $gateway->charge(100); }
```

```text
+-------------------------------------+------------------------------------+
| Trait                               | Service container                  |
+=====================================+====================================+
| Reuses code (methods)               | Creates and injects objects        |
+-------------------------------------+------------------------------------+
| Methods copied into the class when  | Objects resolved at runtime        |
| PHP compiles it                     |                                    |
+-------------------------------------+------------------------------------+
```

In short: trait = shared methods; container = builds objects and injects them.

---

##### 12. How does the rate limiter work?

*(Asked 1×: Interview, no company)*

==> The **`throttle`** middleware keeps a **counter per key** (user ID or IP) in the **cache**
(Redis, file, ...). Each request adds 1. When the limit is crossed, Laravel returns **429 Too
Many Requests** with a **`Retry-After`** header. The counter resets when the time window ends.

```php
// AppServiceProvider::boot()
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// routes
Route::middleware('throttle:api')->group(function () { /* ... */ });
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
// 5 tries per 1 minute; the 6th returns 429
```

Used for: stopping brute-force logins, spam and API abuse.

In short: a cache counter per user/IP; over the limit → 429.

---

##### 13. What is middleware? Give an example

*(Asked 1×: Interview, no company)*

==> **Middleware** is a filter that runs **before** (or after) a request reaches the controller. It
can let the request through, block it, or change it.
- Built-in: `auth` (must be logged in), `throttle`, CSRF check, `verified` (email verified).
- Custom example below: only admins allowed.

```php
// php artisan make:middleware IsAdmin
public function handle(Request $request, Closure $next)
{
    if (! $request->user()?->is_admin) {
        abort(403, 'Admins only');   // blocked
    }
    return $next($request);          // pass on to the next middleware / controller
}

// register the alias 'admin' (app/Http/Kernel.php, or bootstrap/app.php in Laravel 11), then:
Route::get('/admin', [AdminController::class, 'index'])->middleware(['auth', 'admin']);
// non-admin user → 403 "Admins only"
```

In short: middleware = a gate on the route; `$next($request)` lets the request through.

---

##### 14. How do you handle errors in Laravel?

*(Asked 1×: Interview, no company)*

==> In layers:
- **try / catch** around risky code (payments, external APIs), returning a friendly message.
- **Validation**: on failure `$request->validate()` redirects back with errors, or returns **422**
  JSON for API requests.
- **Exception handler**: `app/Exceptions/Handler.php` (Laravel 11: `withExceptions()` in
  `bootstrap/app.php`) to log errors and render custom responses.
- **Custom exceptions** with their own `report()` / `render()` methods.
- **Not found**: `abort(404)` or `findOrFail()`; custom page in
  `resources/views/errors/404.blade.php`.
- **Logging**: `Log::error()`, written to `storage/logs/laravel.log`.
- **`APP_DEBUG=false`** in production so users never see stack traces.

```php
try {
    $payment->charge($amount);
} catch (PaymentException $e) {
    Log::error('Payment failed', ['error' => $e->getMessage()]);
    return back()->with('error', 'Payment failed, please try again.');
}
```

In short: try/catch for risky code, the exception handler for the rest, and log everything.

---

##### 15. Localization in Laravel

*(Asked 1×: Interview, no company)*

==> **Localization** = showing the app in different languages.
1. Put translations in `lang/<locale>/` files (PHP arrays) or `lang/<locale>.json`.
2. Print text with `__('key')` or `@lang('key')` in Blade.
3. Switch the language with `App::setLocale('hi')`, usually in a middleware based on the user's
   setting, session or URL.
4. Set the default and fallback language in `config/app.php` (`locale`, `fallback_locale`).

```php
// lang/en/messages.php
return ['welcome' => 'Welcome, :name'];

// lang/hi/messages.php
return ['welcome' => 'स्वागत है, :name'];

App::setLocale('hi');
echo __('messages.welcome', ['name' => 'Amit']);   // Output: स्वागत है, Amit
```

Interview tip: **`trans_choice()`** handles plurals (1 item / 2 items).

In short: language files + `__()` + `App::setLocale()`.

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
