# Irpgrammer Solutions – L1 Interview

**Topics:** Promise chains, event loop order, async/await, URL shortener design

---

## Output Questions

### 1. Promise chain output
```js
Promise.resolve(1)
  .then(x => x + 1)
  .then(x => { throw new Error('error') })
  .catch(() => 1)
  .then(x => x + 1)
  .then(x => console.log(x))
  .catch(console.error);
```
**Output:** `2`

=====================================================================================================================

### 2. Event loop order (`nextTick`, Promise, `setTimeout`)
```js
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
console.log('end');
```
**Output:** `start`, `end`, `nextTick`, `promise`, `timeout`

=====================================================================================================================

### 3. async/await with rejected promise
```js
async function processData() {
  try {
    return await Promise.reject("Error occurred");
  } catch (err) {
    console.log("Caught:", err);
  }
}
processData().then(console.log(5))
```
**Output:** `5` is printed first (`console.log(5)` runs immediately), then `Caught: Error occurred`.

=====================================================================================================================

## System Design

### 4. Design: URL shortener
1. **Shorten URL – POST**
   - Take full URL from client.
   - Create a unique key for the URL.
   - Store URL and key in the `shorten_url` table.
2. **URL mapping – GET**
   - Take unique key from the tiny URL.
   - Look it up in the `shorten_url` table.
   - If it doesn't exist, return 404; otherwise redirect to the full URL.

**Tables**
- `url_table`: `id` (PK), `full_url`
- `url_key_table`: `url_id` (FK), `url_key`

=====================================================================================================================
