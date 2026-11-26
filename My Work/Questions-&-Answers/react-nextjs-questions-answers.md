# React / Next.js – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

##### 1. Difference between React and Next.js; why is Next.js better?

*(Asked 3×: AST Consulting, EZ Works, Web3Dev)*

==> **React** is a **UI library** – it only renders components. **Next.js** is a **React
framework** that adds routing, server rendering and a backend on top.

```text
+--------------+---------------------------------+---------------------------------------+
|              | React                           | Next.js                               |
+==============+=================================+=======================================+
| Type         | UI library                      | Full framework built on React         |
+--------------+---------------------------------+---------------------------------------+
| Rendering    | Client-side (CSR) only          | SSR, SSG, ISR, CSR + Server           |
|              |                                 | Components                            |
+--------------+---------------------------------+---------------------------------------+
| Routing      | Needs a routing library         | Built-in file-based routing           |
+--------------+---------------------------------+---------------------------------------+
| SEO          | Weak (first HTML is empty)      | Strong (HTML comes ready from server) |
+--------------+---------------------------------+---------------------------------------+
| Backend      | None                            | Route handlers / Server Actions       |
+--------------+---------------------------------+---------------------------------------+
| Optimisation | Manual                          | Built-in image, font, code splitting  |
+--------------+---------------------------------+---------------------------------------+
```

Why Next.js is often better: pages come from the server as ready HTML, so the **first load is
faster** and **SEO is stronger**, and routing and backend code work without extra setup. If the
app doesn't need SEO or server rendering, plain React is enough.

In short: Next.js = React + routing + server rendering + backend, already set up.

---

##### 2. What hooks are available in React and what are their use cases? How do they differ from class lifecycle methods?

*(Asked 3×: Persistent Systems, TCS (online), Capsitech)*

==> **Hooks** are functions (starting with `use`) that give **function components** state and
lifecycle features.

- `useState` – local state (`const [count, setCount] = useState(0)`).
- `useEffect` – side effects after render: API calls, timers, subscriptions.
- `useContext` – read a value from Context (no prop drilling).
- `useReducer` – complex state updated through actions.
- `useRef` – DOM access, or a value that survives renders **without** causing a re-render.
- `useMemo` – cache a computed value.
- `useCallback` – cache a function reference.
- **Custom hooks** – your own reusable logic (`useFetch`, `useDebounce`).

Class lifecycle vs hooks:

```text
+--------------------------------+--------------------------------------------+
| Class                          | Hooks                                      |
+================================+============================================+
| componentDidMount              | useEffect(() => {...}, [])                 |
+--------------------------------+--------------------------------------------+
| componentDidUpdate             | useEffect(() => {...}, [dep])              |
+--------------------------------+--------------------------------------------+
| componentWillUnmount           | cleanup function returned from useEffect   |
+--------------------------------+--------------------------------------------+
| this.state / this.setState     | useState                                   |
+--------------------------------+--------------------------------------------+
```

Key difference: classes split one feature across several lifecycle methods; hooks keep one
feature's code **together** in one `useEffect`, with no `this`, and logic is reusable via custom
hooks.

---

##### 3. Explain the React component lifecycle in detail, with scenarios for each phase

*(Asked 3×: American Express, EZ Works, Fundwave)*

==> Every component goes through **3 phases**:

1. **Mounting** – added to the screen.
   - Class: `constructor` → `render` → `componentDidMount`
   - Hook: `useEffect(fn, [])`
   - Scenario: fetch user data, start a timer, add a `resize` listener.
2. **Updating** – props or state changed.
   - Class: `render` → `componentDidUpdate(prevProps, prevState)`
   - Hook: `useEffect(fn, [dep])`
   - Scenario: search text changes → call the search API again.
3. **Unmounting** – removed from the screen.
   - Class: `componentWillUnmount`
   - Hook: the **cleanup function** returned from `useEffect`
   - Scenario: clear the timer, remove the listener, close the socket, abort the fetch.

Plus **error handling**: `getDerivedStateFromError` / `componentDidCatch` in an **Error
Boundary** (class only).

```jsx
useEffect(() => {
  console.log("mounted / updated");
  return () => console.log("cleanup");
}, [userId]);
// first render: mounted / updated
// userId changes: cleanup → mounted / updated
// unmount: cleanup
```

---

##### 4. How does routing work in React? Why do we need React Router DOM?

*(Asked 3×: EZ Works, Web3Dev, Fundwave)*

==> A React app is a **Single Page App** – one `index.html`. React itself has **no routing**.

**React Router DOM** adds it:
- Watches the URL and renders the matching component **without a page reload**.
- Uses the browser **History API** (`pushState`).
- Gives `<Link>`, `useNavigate`, `useParams`, nested routes and protected routes.

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Link to="/">Home</Link> <Link to="/user/5">User</Link>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

function User() {
  const { id } = useParams(); // "/user/5" → id = "5"
  return <p>User {id}</p>;
}
```

In short: React Router maps URLs to components on the client, no full reload.

---

##### 5. How are components created in React?

*(Asked 2×: AST Consulting, Capsitech)*

==> Two ways:
- **Function component** (modern, recommended) – a function that returns JSX.
- **Class component** (legacy) – extends `React.Component` and has a `render()` method.

```jsx
function Hello({ name }) {
  return <h1>Hello {name}</h1>;
}

class HelloClass extends React.Component {
  render() {
    return <h1>Hello {this.props.name}</h1>;
  }
}

<Hello name="Saurabh" />   // renders: Hello Saurabh
```

Component names must start with a **capital letter** – lowercase `<hello />` is treated as an
HTML tag.

---

##### 6. Functional vs class components: which do you use?

*(Asked 2×: American Express, Fundwave)*

==>
```text
+-------------------+---------------------------------+--------------------------------------------+
|                   | Function component              | Class component                            |
+===================+=================================+============================================+
| Syntax            | Plain function                  | Class with render()                        |
+-------------------+---------------------------------+--------------------------------------------+
| State / lifecycle | Hooks (useState, useEffect)     | this.state, lifecycle methods              |
+-------------------+---------------------------------+--------------------------------------------+
| this keyword      | Not needed                      | Needed (binding issues)                    |
+-------------------+---------------------------------+--------------------------------------------+
| Code size         | Shorter, easier to test         | More boilerplate                           |
+-------------------+---------------------------------+--------------------------------------------+
| Status            | Recommended; needed for         | Legacy (still the only way to write an     |
|                   | Server Components               | Error Boundary)                            |
+-------------------+---------------------------------+--------------------------------------------+
```

Sample answer: "I use **function components with hooks**. I only write a class for an **Error
Boundary**."

---

##### 7. What is Next.js?

*(Asked 2×: AST Consulting, Fundwave)*

==> **Next.js** is a **React framework by Vercel** for production apps.
- **SSR / SSG / ISR** → fast first load and good SEO.
- **File-based routing** – folder = URL (`app/about/page.js` → `/about`).
- **Server Components** (App Router) – components that run only on the server, less JS sent.
- **Route handlers / Server Actions** – backend code in the same project.
- Built-in `next/image`, `next/font`, code splitting, TypeScript, middleware.

In short: React with routing, server rendering and a backend already wired up.

---

##### 8. What is the Virtual DOM and why is it useful?

*(Asked 2×: EZ Works, TCS (online))*

==> The **Virtual DOM** is a **plain JavaScript object tree** that describes the UI. React keeps it
in memory.

How React uses it:
1. State changes → React re-runs the component and builds a **new tree**.
2. It **diffs** the new tree with the old one (**reconciliation**).
3. It updates **only the changed nodes** in the real DOM (**commit**).

```jsx
// count goes 1 → 2
<div><h1>Title</h1><p>{count}</p></div>
// React only changes the text inside <p>; <h1> is not touched
```

Why useful: real DOM updates are costly, so React keeps them minimal and batched – and you just
write **what the UI should look like**, not manual DOM code.

In short: describe UI → React diffs → touches only what changed.

---

##### 9. What is React?

*(Asked 1×: EZ Works)*

==> **React** is an open-source **JavaScript library by Meta** for building user interfaces.
- UI is built from reusable **components**.
- **JSX** – HTML-like syntax inside JS.
- **Virtual DOM** – updates only what changed.
- **One-way data flow** – parent → child via **props**.
- **Declarative** – you describe the UI for a given state; React updates the screen.

In short: components + state → React keeps the screen in sync.

---

##### 10. Why ReactJS (listed in your resume)?

*(Asked 1×: Technovert)*

==> Sample answer: "I chose React because:
- **Component-based** – I build reusable pieces like buttons, forms and tables once.
- **Fast updates** thanks to the Virtual DOM and batching.
- **Huge ecosystem** – ready libraries for routing, state, forms and more.
- Big community and lots of jobs."

---

##### 11. What is JSX?

*(Asked 1×: EZ Works)*

==> **JSX** (JavaScript XML) lets you write HTML-like markup inside JavaScript.
- It is **not** HTML – a compiler turns it into JS function calls.
- `{}` puts a JS expression inside.
- Use `className` instead of `class`, `htmlFor` instead of `for`; every tag must be closed.
- Return **one root element** (or a Fragment `<>...</>`).

```jsx
const name = "Saurabh";
const el = <h1 className="title">Hello {name}</h1>;

// React 17+ compiles it to:
// jsx("h1", { className: "title", children: ["Hello ", name] })
// (older setup: React.createElement("h1", { className: "title" }, "Hello ", name))
```

In short: JSX is syntax sugar that becomes plain JS objects describing the UI.

---

##### 12. What are stateless and stateful components? Give examples

*(Asked 1×: American Express)*

==>
- **Stateless** (presentational) – no state of its own; just renders the **props** it gets.
- **Stateful** – keeps and updates its own **state**.

```jsx
// Stateless
function Greeting({ name }) {
  return <p>Hi {name}</p>;
}

// Stateful
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
// Output: button shows 0, then 1, 2, 3... on each click
```

---

##### 13. SSR, SSG, CSR; why Next.js is better for SEO; file-based routing, App Router and 'use client'

*(Asked 1×: EZ Works)*

==>
```text
+------------------------------+-------------------------------------+
|                              | When HTML is built                  |
+==============================+=====================================+
| CSR – Client-Side Rendering  | In the browser, by JS               |
+------------------------------+-------------------------------------+
| SSR – Server-Side Rendering  | On the server, on every request     |
+------------------------------+-------------------------------------+
| SSG – Static Site Generation | Once, at build time                 |
+------------------------------+-------------------------------------+
```

- **SEO**: with SSR/SSG the crawler gets **full HTML** immediately. With CSR the first HTML is an
  empty `<div id="root">`.
- **File-based routing**: `app/about/page.js` → `/about`, `app/blog/[id]/page.js` → `/blog/123`.
- **App Router** (`app/` folder, Next 13+): components are **Server Components** by default; you
  also get `layout.js`, `loading.js`, `error.js`.
- **`'use client'`**: first line of a file → it becomes a **Client Component**. Needed for
  state, effects, event handlers or browser APIs (`window`, `localStorage`).

```jsx
"use client";
import { useState } from "react";

export default function Like() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

In short: server-render for SEO, `'use client'` only where you need interactivity.

---

##### 14. What is CSR (Client-Side Rendering)?

*(Asked 1×: EZ Works)*

==> **CSR**: the server sends an almost empty HTML file plus a **JS bundle**; the **browser** runs
React to build the page.
- **Pros**: smooth app-like navigation, less server load, cheap hosting (static files).
- **Cons**: slower first paint (blank screen until JS loads), weaker SEO.
- A plain React app (no server rendering) is CSR.

```html
<!-- what the server sends in CSR -->
<div id="root"></div>
<script src="/assets/index.js"></script>
```

In short: CSR = the browser builds the page with JS.

---

##### 15. What is hydration? Why do hydration mismatch errors happen?

*(Asked 1×: EZ Works)*

==> **Hydration**: the server sends ready HTML, then React runs in the browser and **attaches event
handlers and state** to that HTML so it becomes interactive. React does it with `hydrateRoot`
(Next.js calls it for you).

**Hydration mismatch**: the HTML React renders on the client is different from the server HTML.
Common causes:
- `Date.now()`, `Math.random()`, `new Date().toLocaleString()` during render.
- Reading `window` / `localStorage` during render (doesn't exist on the server).
- Invalid HTML nesting, e.g. `<div>` inside `<p>`.
- Browser extensions changing the DOM.

In short: server HTML and first client render must match exactly.

---

##### 16. Advanced hooks

*(Asked 1×: Capsitech)*

==> Beyond `useState` / `useEffect`:
- `useReducer` – state with many actions.
- `useMemo` – cache an expensive calculation.
- `useCallback` – keep the same function reference between renders.
- `useRef` – DOM access, or a mutable value that doesn't trigger re-render.
- `useContext` – read Context, avoid prop drilling.
- `useLayoutEffect` – like `useEffect` but runs **before the browser paints** (measure layout).
- `useTransition` / `useDeferredValue` – mark slow updates as **low priority** (React 18).
- `useId` – unique IDs that match on server and client.
- React 19: `use`, `useActionState`, `useOptimistic` (forms and async data).
- **Custom hooks** – your own reusable logic.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);
  return data;
}

const users = useFetch("/api/users"); // null first, then the array
```

---

##### 17. useEffect: managing side effects, and why cleanup is needed (listeners, timers, API calls, AbortController)

*(Asked 1×: EZ Works)*

==> `useEffect` runs **after render** for **side effects** – work outside rendering (API calls,
timers, listeners).

Dependency array:
- no array → after **every** render
- `[]` → once after mount
- `[a]` → after mount and whenever `a` changes

**Cleanup** (the function you return) runs **before the next effect** and **on unmount**.
Without it: memory leaks, duplicate listeners, timers that keep running, and old API responses
overwriting new ones (race condition).

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users?q=${query}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUsers)
    .catch(() => {});                       // AbortError is expected

  const id = setInterval(() => console.log("tick"), 1000);
  const onResize = () => console.log(window.innerWidth);
  window.addEventListener("resize", onResize);

  return () => {
    controller.abort();                     // cancel the old request
    clearInterval(id);                      // stop the timer
    window.removeEventListener("resize", onResize); // remove listener
  };
}, [query]);
```

In short: effect sets something up, cleanup tears it down.

---

##### 18. Why is React considered fast?

*(Asked 1×: AST Consulting)*

==>
- **Virtual DOM + diffing** – only changed nodes in the real DOM are updated.
- **Automatic batching** (React 18) – several `setState` calls → one re-render.
- **Keys** – list items are reused instead of re-created.
- **Concurrent rendering** (React 18) – urgent updates (typing) can interrupt slow ones.
- Tools to skip work: `React.memo`, `useMemo`, `React.lazy`.

```jsx
function onClick() {
  setA(1);
  setB(2);   // React re-renders once, not twice
}
```

Honest note: React isn't magically faster than direct DOM code – it keeps updates **minimal by
default**, so apps stay fast as they grow.

---

##### 19. What is React's rendering process?

*(Asked 1×: Web3Dev)*

==>
1. **Trigger** – first load, or a state change (`setState`) / parent re-render.
2. **Render phase** – React calls your components and builds a new Virtual DOM tree (pure, no
   DOM changes).
3. **Reconciliation** – diffs the new tree with the old one to find changes.
4. **Commit phase** – applies only those changes to the real DOM; `useLayoutEffect` runs.
5. Browser **paints**; then `useEffect` runs.

Note: when a parent re-renders, **all its children re-render** too, unless memoised with
`React.memo`.

In short: trigger → render → diff → commit → paint → effects.

---

##### 20. What is the key prop and why is it important?

*(Asked 1×: EZ Works)*

==> `key` is a **unique, stable ID** for each item in a list. React uses it to know **which item
was added, removed or moved**.
- Bad keys → React may reuse the wrong DOM node, so state jumps to the wrong row (e.g. typed text
  stays in the wrong input).
- Use an id from the data. Avoid the **array index** if the list can be reordered, filtered or
  have items inserted.
- Keys must be unique **among siblings** only.

```jsx
{users.map(u => <li key={u.id}>{u.name}</li>)}
```

In short: keys give list items an identity across renders.

---

##### 21. Explain componentDidMount and componentWillUnmount with code

*(Asked 1×: American Express)*

==>
- `componentDidMount` – runs **once, after** the component is added to the DOM. Use it for API
  calls, timers, listeners.
- `componentWillUnmount` – runs **just before** it is removed. Use it for cleanup.

```jsx
class Clock extends React.Component {
  state = { time: new Date() };

  componentDidMount() {
    this.timer = setInterval(() => this.setState({ time: new Date() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);   // otherwise the timer keeps running → leak
  }

  render() {
    return <p>{this.state.time.toLocaleTimeString()}</p>;
  }
}
// Output: the time, updating every second
```

---

##### 22. How do you share state between components without a common parent?

*(Asked 1×: Kyndryl)*

==>
- **Context API** – put the state in a Provider high in the tree; any component reads it with
  `useContext`.
- **Global store** – a state-management library; any component can read or update it.
- **URL state** – query params (filters, page number).

```jsx
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header /><Sidebar />
    </ThemeContext.Provider>
  );
}

function Sidebar() {
  const { theme } = useContext(ThemeContext);
  return <div>{theme}</div>;   // Output: light
}
```

Rule of thumb: Context for small, rarely-changing data (theme, logged-in user); a global store
for big state that changes often – every Context consumer re-renders when the value changes.

---

##### 23. How do you cache API responses in Redux?

*(Asked 1×: Kyndryl)*

==> Manual way:
1. Save the response in the store with a `lastFetched` timestamp.
2. Before calling the API, check: data exists and is fresh → use it; otherwise fetch.
3. Invalidate (refetch) after a change, e.g. after a POST.

Easiest way: **RTK Query** (part of Redux Toolkit) – caching, de-duplication, refetching and
**tag-based invalidation** built in.

```js
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User"],
  endpoints: (b) => ({
    getUsers: b.query({
      query: () => "users",
      providesTags: ["User"],
      keepUnusedDataFor: 60,          // keep cache 60 s after last use
    }),
    addUser: b.mutation({
      query: (body) => ({ url: "users", method: "POST", body }),
      invalidatesTags: ["User"],      // refetch getUsers after adding
    }),
  }),
});

// in a component:
const { data, isLoading } = useGetUsersQuery();
```

In short: RTK Query = cache + auto refetch with tags.

---

##### 24. What is middleware in React (Redux middleware)? Have you used any?

*(Asked 1×: American Express)*

==> React itself has no middleware – this means **Redux middleware**: a function that sits
**between `dispatch(action)` and the reducer**. It can log, modify, delay or block actions, and
it's where async work (API calls) lives.
- **redux-thunk** – dispatch functions for async calls (included in Redux Toolkit).
- **redux-saga** – complex async flows using generators.
- **redux-logger** – logs every action and the new state.

```js
const logger = (store) => (next) => (action) => {
  console.log("dispatching", action.type);
  const result = next(action);
  console.log("next state", store.getState());
  return result;
};
// dispatch({ type: "inc" }) → "dispatching inc", then "next state { count: 1 }"
```

Sample answer: "Yes – thunk through `createAsyncThunk` in Redux Toolkit for API calls."

---

##### 25. State management (advanced)

*(Asked 1×: Capsitech)*

==> Pick the tool by **type of state**:

```text
+-------------------------------------------+--------------------------------------------+
| Type of state                             | Tool                                       |
+===========================================+============================================+
| Local UI (input, modal open)              | useState / useReducer                      |
+-------------------------------------------+--------------------------------------------+
| Shared, rarely changes (theme, auth user) | Context API                                |
+-------------------------------------------+--------------------------------------------+
| Big app-wide state, many updates          | Global store (state-management library)    |
+-------------------------------------------+--------------------------------------------+
| Server data (API responses)               | Data-fetching cache (cache, refetch)       |
+-------------------------------------------+--------------------------------------------+
| URL state (filters, page)                 | Query params                               |
+-------------------------------------------+--------------------------------------------+
```

Tips:
- Keep state **as close as possible** to where it's used.
- Don't store **derived values** – compute them during render.
- Normalise lists by id.
- Split contexts so one change doesn't re-render everything.

---

##### 26. How can you improve the performance of a React application (large lists, complex UIs)?

*(Asked 1×: Persistent Systems)*

==>
- `React.memo` – skip re-rendering a child when its props are the same.
- `useMemo` / `useCallback` – cache heavy calculations and keep callbacks stable.
- **Virtualise large lists** – render only the visible rows (e.g. 20 of 10,000).
- **Code splitting / lazy loading** – `React.lazy` + `Suspense`.
- Correct, stable `key` props.
- Keep state local; split big contexts.
- Debounce search inputs; paginate data.
- `useTransition` for slow, non-urgent updates.
- Optimise images, ship the production build, and **measure with React DevTools Profiler**.

In short: render less, render smaller, load later – and measure first.

---

##### 27. What is lazy loading? Ways to implement it; component-level vs data-level

*(Asked 1×: EZ Works)*

==> **Lazy loading** = load something **only when it's needed**, not on startup → faster first
load.

**Component-level** – the component's JS is a separate chunk, downloaded only when rendered:

```jsx
const Dashboard = React.lazy(() => import("./Dashboard"));

<Suspense fallback={<p>Loading...</p>}>
  <Dashboard />
</Suspense>
// shows "Loading..." until the Dashboard chunk downloads
```

Next.js: `const Chart = dynamic(() => import("./Chart"))`.

**Data-level** – fetch data only when needed: pagination, infinite scroll, load on tab click, or
`IntersectionObserver` when the user scrolls near it.

**Images** – `<img loading="lazy">` or Next.js `<Image>` (lazy by default).

---

##### 28. useCallback, React.memo, preventing re-renders: when does memoization make sense?

*(Asked 1×: EZ Works)*

==>
- `React.memo(Component)` – skips re-render if props are **shallowly equal**.
- `useCallback(fn, deps)` – same function reference across renders, so a memoised child doesn't
  see a "new" prop.
- `useMemo(() => value, deps)` – caches an expensive result.

```jsx
const Child = React.memo(({ onClick }) => {
  console.log("Child render");
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => console.log("clicked"), []);
  return <><p onClick={() => setCount(count + 1)}>{count}</p><Child onClick={handleClick} /></>;
}
// clicking the count: Parent re-renders, "Child render" is NOT logged again
// without useCallback: a new function each render → Child re-renders every time
```

**Use it when**: the component is heavy or re-renders often with the same props, the calculation
is expensive, or the value is a prop to a memoised child / a `useEffect` dependency.

**Skip it when**: components are small and cheap – memoization itself costs memory and
comparisons. Profile first.

---

##### 29. The marketing team says the website is slow. How will you debug and fix it?

*(Asked 1×: EZ Works)*

==>
1. **Ask & reproduce** – which page, device, network? First load or interactions?
2. **Measure** – a browser performance audit for **Core Web Vitals** (LCP, INP, CLS); Network
   tab for big or slow requests; **React Profiler** for slow re-renders.
3. **Fix the cause**:
   - Big JS bundle → code splitting, lazy loading, remove unused libraries.
   - Heavy images → compress, WebP/AVIF, lazy-load, right sizes, `next/image`, CDN.
   - Slow APIs → check the backend (database indexes, caching), pagination.
   - Too many re-renders → `React.memo`, `useMemo`, virtualised lists.
   - Slow first paint / SEO → SSR or SSG with Next.js.
   - Third-party scripts → `defer` / `async`, or `next/script` with a lazy strategy.
4. **Verify** – measure again, compare, and add monitoring so it doesn't regress.

In short: reproduce → measure → fix the biggest cause → measure again.

---

##### 30. What is the difference between state and props?

*(Asked 1×: EZ Works)*

==>
```text
+--------------------------+----------------------------------+-----------------------------------+
|                          | Props                            | State                             |
+==========================+==================================+===================================+
| Comes from               | Parent component                 | Inside the component itself       |
+--------------------------+----------------------------------+-----------------------------------+
| Can change?              | Read-only in the child           | Yes, with the setter / setState   |
+--------------------------+----------------------------------+-----------------------------------+
| Purpose                  | Pass data/config down            | Data that changes over time       |
+--------------------------+----------------------------------+-----------------------------------+
| Change causes re-render? | Yes, when parent sends new props | Yes                               |
+--------------------------+----------------------------------+-----------------------------------+
```

```jsx
function Child({ label }) {              // label = prop (read-only)
  const [clicks, setClicks] = useState(0); // clicks = state (own memory)
  return <button onClick={() => setClicks(clicks + 1)}>{label}: {clicks}</button>;
}
<Child label="Likes" />   // Output: "Likes: 0", then "Likes: 1"...
```

In short: props are like function arguments; state is the component's own memory.

---

##### 31. How do you transfer data between components?

*(Asked 1×: American Express)*

==>
- **Parent → child**: props.
- **Child → parent**: parent passes a **callback** prop; child calls it with data.
- **Siblings**: **lift state up** to the common parent.
- **Far-apart components**: Context API or a global store.
- Also: URL params, refs (rare).

```jsx
function Parent() {
  const [msg, setMsg] = useState("");
  return (
    <>
      <Child name="Ram" onSend={setMsg} />   {/* down: name, up: onSend */}
      <p>{msg}</p>
    </>
  );
}
function Child({ name, onSend }) {
  return <button onClick={() => onSend("Hi from " + name)}>Send</button>;
}
// click → Parent shows: Hi from Ram
```

---

##### 32. What is prop drilling?

*(Asked 1×: EZ Works)*

==> **Prop drilling** = passing props through **many middle components that don't use them**, just
to reach a deep child.

`App → Layout → Sidebar → Profile` – Layout and Sidebar pass `user` along only so Profile gets it.

- Problem: noisy code, hard to change, extra re-renders.

---

##### 33. Write a React example that handles user input and shows the submitted value

*(Asked 1×: Persistent Systems)*

==>
```jsx
import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();      // stop the page reload
    setSubmitted(input);
    setInput("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      {submitted && <p>You submitted: {submitted}</p>}
    </div>
  );
}
// type "Hello" + Submit → "You submitted: Hello", input clears
```

`input` holds what you type (**controlled input**); `submitted` changes only on submit.

---

##### 34. Controlled vs uncontrolled components

*(Asked 1×: EZ Works)*

==>
```text
+-----------------+--------------------------------------------+------------------------------------+
|                 | Controlled                                 | Uncontrolled                       |
+=================+============================================+====================================+
| Value stored in | React state                                | The DOM itself                     |
+-----------------+--------------------------------------------+------------------------------------+
| Read value      | From state                                 | With a ref (ref.current.value)     |
+-----------------+--------------------------------------------+------------------------------------+
| Code            | value + onChange                           | defaultValue + useRef              |
+-----------------+--------------------------------------------+------------------------------------+
```

```jsx
// Controlled – React owns the value
const [name, setName] = useState("");
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled – the DOM owns the value
const ref = useRef(null);
<input defaultValue="" ref={ref} />   // read ref.current.value on submit
```

`<input type="file">` is always uncontrolled.

---

##### 35. Counter app with useState (plus and minus buttons)

*(Asked 1×: Capsitech)*

==>
```jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <span> {count} </span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
// Output: - 0 +   → click + twice → - 2 +
```

Interview tip: use the **updater form** `c => c + 1`. With `setCount(count + 1)` called twice in
one handler, you get +1, not +2, because both read the same old `count`.

---

##### 36. Piano tiles: 8 tiles that expand vertically when clicked (map + useState toggle)

*(Asked 1×: ScroBits Technologies)*

==>
```jsx
import { useState } from "react";

export default function PianoTiles() {
  const [open, setOpen] = useState(Array(8).fill(false));

  const toggle = (i) =>
    setOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
      {open.map((isOpen, i) => (
        <div
          key={i}
          onClick={() => toggle(i)}
          style={{
            width: 40,
            height: isOpen ? 200 : 100,
            background: i % 2 ? "black" : "white",
            border: "1px solid #333",
            transition: "height 0.3s",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
}
// click tile 3 → it grows 100px → 200px; click again → back to 100px
```

- One boolean per tile; clicking flips only that tile, using a **new array** (no mutation).
- Index as `key` is fine here – the list never reorders.

---

##### 37. What are Higher-Order Components (HOCs)? How are they different from render props?

*(Asked 1×: AST Consulting)*

==> An **HOC** is a function that **takes a component and returns a new component** with extra
behaviour (a wrapper).

```jsx
function withLoading(Component) {
  return function Wrapped({ loading, ...props }) {
    if (loading) return <p>Loading...</p>;
    return <Component {...props} />;
  };
}
const UserListWithLoading = withLoading(UserList);
<UserListWithLoading loading={true} />   // Output: Loading...
```

**Render props**: a component takes a **function as a prop** and calls it to decide what to
render.

```jsx
<MouseTracker render={(pos) => <p>{pos.x}, {pos.y}</p>} />
```

```text
+----------+-----------------------------------+------------------------------------+
|          | HOC                               | Render props                       |
+==========+===================================+====================================+
| How      | Wraps a component                 | Passes a function that returns JSX |
+----------+-----------------------------------+------------------------------------+
| Problems | "Wrapper hell", prop name clashes | Nested callbacks                   |
+----------+-----------------------------------+------------------------------------+
```

======================================================================================================================================

## What to study first

```
React basics, JSX & components      (what React is, JSX, function components)
   ↓
Props, state & data flow            (how data moves)
   ↓
Hooks + Component lifecycle         (useState, useEffect, cleanup)
   ↓
Forms + React coding tasks          (controlled inputs, counter, piano tiles)
   ↓
Virtual DOM, rendering & keys       (how React updates the screen)
   ↓
Routing + State management          (React Router, Context, Redux)
   ↓
Performance & memoization           (memo, useCallback, lazy loading)
   ↓
Patterns (HOC, render props)
   ↓
Next.js                             (SSR, SSG, CSR, hydration, App Router)
```

React basics, props/state and hooks are the foundation – almost every other question uses them.
Rendering/Virtual DOM explains why performance tricks (memo, keys, lazy loading) work.
Next.js builds on everything: it is React plus routing and server rendering, and it is the most
asked topic here, so finish with it.
