# React / Next.js – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. Difference between React and Next.js; why is Next.js better?
   *(Asked 3×: AST Consulting, EZ Works, Web3Dev)*

==> React is a **library** for building UI. Next.js is a **framework built on React** that adds the
    things a real app needs.

    +--------------+---------------------------------+---------------------------------------+
    |              | React                           | Next.js                               |
    +==============+=================================+=======================================+
    | Type         | UI library                      | Full framework on top of React        |
    +--------------+---------------------------------+---------------------------------------+
    | Rendering    | Client-side (CSR) by default    | SSR, SSG, ISR and CSR                 |
    +--------------+---------------------------------+---------------------------------------+
    | Routing      | Needs React Router              | Built-in file-based routing           |
    +--------------+---------------------------------+---------------------------------------+
    | SEO          | Weaker (HTML is empty at first) | Strong (HTML comes ready from server) |
    +--------------+---------------------------------+---------------------------------------+
    | Backend      | None                            | API routes / server actions           |
    +--------------+---------------------------------+---------------------------------------+
    | Optimisation | Manual                          | Built-in image, font, code splitting  |
    +--------------+---------------------------------+---------------------------------------+

    In short: Next.js is "React + routing + server rendering + SEO + backend" out of the box. For a
    simple dashboard plain React is fine.

---

2. What hooks are available in React and what are their use cases? How do they differ from class
   lifecycle methods?
   *(Asked 3×: Persistent Systems, TCS (online), Capsitech)*

==> Hooks are functions that let function components use state and other React features.
    - `useState` – store local state
    - `useEffect` – side effects (API calls, timers, subscriptions)
    - `useContext` – read shared data from Context
    - `useReducer` – complex state with actions (like mini Redux)
    - `useRef` – access a DOM element or keep a value without re-render
    - `useMemo` – remember a computed value
    - `useCallback` – remember a function
    - Custom hooks – reuse your own logic (`useFetch`)

    Difference from class lifecycle methods:

    +--------------------------------+--------------------------------------------+
    | Class                          | Hooks                                      |
    +================================+============================================+
    | `componentDidMount`            | `useEffect(() => {...}, [])`               |
    +--------------------------------+--------------------------------------------+
    | `componentDidUpdate`           | `useEffect(() => {...}, [dep])`            |
    +--------------------------------+--------------------------------------------+
    | `componentWillUnmount`         | cleanup function returned from `useEffect` |
    +--------------------------------+--------------------------------------------+
    | `this.state` / `this.setState` | `useState`                                 |
    +--------------------------------+--------------------------------------------+

    Hooks group code by **feature** instead of by lifecycle phase, with no `this`, and logic is easy
    to reuse.

---

3. Explain the React component lifecycle in detail, with scenarios for each phase
   *(Asked 3×: American Express, EZ Works, Fundwave)*

==> Every component goes through 3 phases:

    1. **Mounting** (added to the screen)
        - Class: `constructor` → `render` → `componentDidMount`
        - Hook: `useEffect(fn, [])`
        - Scenario: fetch user data, start a timer, add an event listener.
    2. **Updating** (props or state changed)
        - Class: `render` → `componentDidUpdate(prevProps, prevState)`
        - Hook: `useEffect(fn, [dep])`
        - Scenario: search box text changes → call the search API again.
    3. **Unmounting** (removed from the screen)
        - Class: `componentWillUnmount`
        - Hook: return a cleanup function from `useEffect`
        - Scenario: clear timer, remove listener, close socket, cancel API call.

    Also: **Error handling** – `componentDidCatch` / `getDerivedStateFromError` in Error Boundaries.

---

4. How does routing work in React? Why do we need React Router DOM?
   *(Asked 3×: EZ Works, Web3Dev, Fundwave)*

==> React builds a **Single Page App** – there is only one HTML page. React does not have routing
    built in.
    React Router DOM:
    - Watches the URL and shows the matching component **without reloading the page**.
    - Uses the browser History API.
    - Gives `<Link>` (no page reload), `useNavigate`, `useParams` (URL params), nested and protected
      routes.

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
    ```

    (In Next.js you don't need it – routing is based on files/folders.)

---

5. How are components created in React?
   *(Asked 2×: AST Consulting, Capsitech)*

==> Two ways:
    - **Function component** (modern, recommended) – a function that returns JSX.
    - **Class component** (old) – a class that extends `React.Component` and has a `render()`
      method.

    ```jsx
    function Hello({ name }) {
      return <h1>Hello {name}</h1>;
    }

    class HelloClass extends React.Component {
      render() {
        return <h1>Hello {this.props.name}</h1>;
      }
    }
    ```

    Component names must start with a capital letter. Use it like `<Hello name="Saurabh" />`.

---

6. Functional vs class components: which do you use?
   *(Asked 2×: American Express, Fundwave)*

==>
    +-------------------+---------------------------------+--------------------------------------------+
    |                   | Function component              | Class component                            |
    +===================+=================================+============================================+
    | Syntax            | Plain function                  | Class with `render()`                      |
    +-------------------+---------------------------------+--------------------------------------------+
    | State / lifecycle | Hooks (`useState`, `useEffect`) | `this.state`, lifecycle methods            |
    +-------------------+---------------------------------+--------------------------------------------+
    | `this` keyword    | Not needed                      | Needed (binding issues)                    |
    +-------------------+---------------------------------+--------------------------------------------+
    | Code size         | Shorter, easier to test         | More boilerplate                           |
    +-------------------+---------------------------------+--------------------------------------------+
    | Status            | Recommended today               | Legacy (still needed only for Error        |
    |                   |                                 | Boundaries)                                |
    +-------------------+---------------------------------+--------------------------------------------+

    Sample answer: "I use function components with hooks. I only use a class when I need an Error
    Boundary."

---

7. What is Next.js?
   *(Asked 2×: AST Consulting, Fundwave)*

==> Next.js is a **React framework** (by Vercel) for building production websites.
    - Server-side rendering (SSR) and static generation (SSG) → fast first load and good SEO.
    - File-based routing (folder = URL).
    - API routes / server actions – write backend code in the same project.
    - Built-in image optimisation, code splitting, TypeScript support.

    In short: React with routing, server rendering and backend features already set up.

---

8. What is the Virtual DOM and why is it useful?
   *(Asked 2×: EZ Works, TCS (online))*

==> The Virtual DOM is a **lightweight JavaScript copy** of the real DOM kept in memory.
    1. State changes → React builds a new Virtual DOM tree.
    2. It compares (diffs) it with the old one.
    3. It updates **only the changed parts** in the real DOM.

    Why useful: touching the real DOM is slow; batching and updating only what changed is faster,
    and we just write "what the UI should look like" instead of manual DOM code.

---

9. What is React?
   *(Asked 1×: EZ Works)*

==> React is an open-source **JavaScript library by Meta** for building user interfaces.
    - UI is made of reusable **components**.
    - Uses **JSX** to write HTML-like code in JS.
    - Uses a **Virtual DOM** for fast updates.
    - **One-way data flow** (parent → child via props).
    - Declarative: you describe the UI for a state, React updates the screen.

---

10. Why ReactJS (listed in your resume)?
    *(Asked 1×: Technovert)*

==> Sample answer: "I chose React because:
    - Component-based – I build reusable pieces like buttons, forms, tables.
    - Fast updates thanks to the Virtual DOM.
    - Huge ecosystem – React Router, Redux, React Query, Next.js.
    - Easy to learn for a JS developer, and it pairs well with my Node.js backend (same language
      end-to-end).
    - Big community and lots of jobs."

---

11. What is JSX?
    *(Asked 1×: EZ Works)*

==> JSX (JavaScript XML) lets you write HTML-like code inside JavaScript.
    - Babel converts it to `React.createElement(...)` calls.
    - Use `{}` to put JS expressions inside.
    - Use `className` instead of `class`, and close all tags.

    ```jsx
    const name = "Saurabh";
    const el = <h1 className="title">Hello {name}</h1>;
    // becomes: React.createElement("h1", { className: "title" }, "Hello ", name)
    ```

---

12. What are stateless and stateful components? Give examples
    *(Asked 1×: American Express)*

==>
    - **Stateless** – no own state; just shows the props it gets (also called presentational).
    - **Stateful** – keeps and changes its own state.

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
    ```

    Good pattern: few stateful "container" components, many simple stateless ones.

---

13. SSR, SSG, CSR; why Next.js is better for SEO; file-based routing, App Router and 'use client'
    *(Asked 1×: EZ Works)*

==>
    +------------------------------+-------------------------------------+--------------------------------+
    |                              | When HTML is built                  | Good for                       |
    +==============================+=====================================+================================+
    | CSR – Client-Side Rendering  | In the browser, by JS               | Dashboards, logged-in apps     |
    +------------------------------+-------------------------------------+--------------------------------+
    | SSR – Server-Side Rendering  | On the server, on every request     | Fresh, personalised data + SEO |
    +------------------------------+-------------------------------------+--------------------------------+
    | SSG – Static Site Generation | At build time                       | Blogs, docs, marketing pages   |
    +------------------------------+-------------------------------------+--------------------------------+
    | (ISR)                        | Static, but rebuilt every N seconds | Product pages                  |
    +------------------------------+-------------------------------------+--------------------------------+

    - **SEO**: with SSR/SSG, Google gets full HTML with content right away. With CSR, the first HTML
      is almost empty.
    - **File-based routing**: `app/about/page.js` → `/about`, `app/blog/[id]/page.js` → `/blog/123`.
    - **App Router** (`app/` folder, Next 13+): components are **Server Components** by default,
      plus layouts, `loading.js`, `error.js`.
    - **`'use client'`**: put at the top of a file to make it a **Client Component** – needed when
      you use state, effects, event handlers or browser APIs.

    ```jsx
    "use client";
    import { useState } from "react";
    export default function Like() {
      const [n, setN] = useState(0);
      return <button onClick={() => setN(n + 1)}>{n}</button>;
    }
    ```

---

14. What is CSR (Client-Side Rendering)?
    *(Asked 1×: EZ Works)*

==> CSR means the server sends an almost empty HTML file + a JS bundle, and the **browser** runs the
    JS to build the page.
    - Pros: smooth app-like navigation, less server work.
    - Cons: slower first load (blank screen until JS runs), weaker SEO.
    - Plain React (Vite / CRA) apps are CSR.

---

15. What is hydration? Why do hydration mismatch errors happen?
    *(Asked 1×: EZ Works)*

==> **Hydration**: the server sends ready HTML; then React runs in the browser and **attaches event
    handlers and state** to that existing HTML, making it interactive.

    **Mismatch error**: the HTML React renders in the browser is different from the server HTML.
    Common causes:
    - Using `Date.now()`, `Math.random()` during render.
    - Using `window` / `localStorage` during render (not available on server).
    - Invalid HTML nesting (e.g. `<div>` inside `<p>`).
    - Browser extensions changing the HTML.

    Fix: move browser-only code into `useEffect`, or load the component only on the client.

    ```jsx
    const [time, setTime] = useState(null);
    useEffect(() => setTime(new Date().toLocaleTimeString()), []);
    ```

---

16. Advanced hooks
    *(Asked 1×: Capsitech)*

==> Beyond `useState`/`useEffect`:
    - `useReducer` – state with many actions (cart, forms).
    - `useMemo` – cache an expensive calculation.
    - `useCallback` – keep the same function reference between renders.
    - `useRef` – DOM access / value that survives renders without re-render.
    - `useContext` – avoid prop drilling.
    - `useLayoutEffect` – like useEffect but runs before the browser paints (measure layout).
    - `useTransition` / `useDeferredValue` – mark slow updates as low priority.
    - `useId` – unique IDs that match on server and client.
    - **Custom hooks** – your own reusable logic.

    ```jsx
    function useFetch(url) {
      const [data, setData] = useState(null);
      useEffect(() => {
        fetch(url).then(r => r.json()).then(setData);
      }, [url]);
      return data;
    }
    ```

---

17. useEffect: managing side effects, and why cleanup is needed (listeners, timers, API calls,
    AbortController)
    *(Asked 1×: EZ Works)*

==> `useEffect` runs code **after render** for side effects (things outside rendering: API calls,
    timers, listeners).
    Dependency array:
    - no array → runs after every render
    - `[]` → only once after mount
    - `[a]` → when `a` changes

    **Cleanup** (the function you return) runs before the next effect and on unmount. Without it you
    get memory leaks, duplicate listeners, timers that keep running, and "set state on unmounted
    component" / old-response bugs.

    ```jsx
    useEffect(() => {
      const controller = new AbortController();
      fetch(`/api/users?q=${query}`, { signal: controller.signal })
        .then(r => r.json())
        .then(setUsers)
        .catch(() => {});

      const id = setInterval(() => console.log("tick"), 1000);
      const onResize = () => console.log(window.innerWidth);
      window.addEventListener("resize", onResize);

      return () => {
        controller.abort();                          // cancel old API call
        clearInterval(id);                           // stop timer
        window.removeEventListener("resize", onResize); // remove listener
      };
    }, [query]);
    ```

---

18. Why is React considered fast?
    *(Asked 1×: AST Consulting)*

==>
    - **Virtual DOM + diffing** – only changed parts of the real DOM are updated.
    - **Batching** – many state updates are combined into one re-render.
    - **Keys** help reuse list items instead of re-creating them.
    - **Concurrent rendering** (React 18) – urgent updates (typing) go first.
    - Easy optimisation tools: `React.memo`, `useMemo`, lazy loading.

---

19. What is React's rendering process?
    *(Asked 1×: Web3Dev)*

==>
    1. **Trigger** – first load, or state/props change (`setState`).
    2. **Render phase** – React calls your components and builds a new Virtual DOM tree.
    3. **Reconciliation** – compares the new tree with the old one (diffing) to find what changed.
    4. **Commit phase** – applies only those changes to the real DOM.
    5. Browser paints; then `useEffect` runs.

    Note: when a parent re-renders, its children re-render too (unless memoised).

---

20. What is the key prop and why is it important?
    *(Asked 1×: EZ Works)*

==> `key` is a unique ID you give to each item in a list. React uses it to know **which item
    changed, was added or removed**.
    - Without good keys, React may re-create items or mix up their state (e.g. input text jumps to
      the wrong row).
    - Use a stable unique id from the data. Avoid array index if the list can be reordered/filtered.

    ```jsx
    {users.map(u => <li key={u.id}>{u.name}</li>)}
    ```

---

21. Explain componentDidMount and componentWillUnmount with code
    *(Asked 1×: American Express)*

==>
    - `componentDidMount` – runs **once after** the component is added to the DOM. Use for API
      calls, timers, listeners.
    - `componentWillUnmount` – runs **just before** it is removed. Use for cleanup.

    ```jsx
    class Clock extends React.Component {
      state = { time: new Date() };

      componentDidMount() {
        this.timer = setInterval(() => this.setState({ time: new Date() }), 1000);
      }

      componentWillUnmount() {
        clearInterval(this.timer);
      }

      render() {
        return <p>{this.state.time.toLocaleTimeString()}</p>;
      }
    }
    ```

    Hook version: `useEffect(() => { const t = setInterval(...); return () => clearInterval(t); },
    [])`.

---

22. How do you share state between components without a common parent?
    *(Asked 1×: Kyndryl)*

==>
    - **Context API** – put the state in a Provider high in the tree; any component reads it with
      `useContext`.
    - **State library** – Redux / Redux Toolkit, Zustand: a global store any component can use.
    - **URL / server state** – query params, or React Query cache for API data.
    - (Rare) event emitter / browser storage.

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
      return <div>{theme}</div>;
    }
    ```

    Best practice: Context for small/rarely-changing data (theme, user), Redux/Zustand for big
    app-wide state.

---

23. How do you cache API responses in Redux?
    *(Asked 1×: Kyndryl)*

==>
    1. Save the API response in the Redux store (plus a `lastFetched` timestamp).
    2. Before calling the API, check: if data exists and is still fresh, use it; else fetch again.
    3. Clear/refresh the data when it changes (cache invalidation), e.g. after a POST.

    Easiest way: **RTK Query** (part of Redux Toolkit) does caching, de-duplication and invalidation
    automatically.

    ```js
    export const api = createApi({
      baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
      tagTypes: ["User"],
      endpoints: (b) => ({
        getUsers: b.query({ query: () => "users", providesTags: ["User"], keepUnusedDataFor: 60 }),
        addUser: b.mutation({ query: (body) => ({ url: "users", method: "POST", body }), invalidatesTags: ["User"] }),
      }),
    });
    ```

---

24. What is middleware in React (Redux middleware)? Have you used any?
    *(Asked 1×: American Express)*

==> Redux middleware is a function that sits **between dispatching an action and the reducer**. It
    can log, change, delay or stop actions, and is where async work (API calls) happens.
    - **redux-thunk** – dispatch functions for async API calls (built into Redux Toolkit).
    - **redux-saga** – handles complex async flows with generators.
    - **redux-logger** – logs every action and state.

    ```js
    const logger = (store) => (next) => (action) => {
      console.log("dispatching", action);
      const result = next(action);
      console.log("next state", store.getState());
      return result;
    };
    ```

    Sample answer: "Yes, I used redux-thunk via `createAsyncThunk` in Redux Toolkit for API calls."

---

25. State management (advanced)
    *(Asked 1×: Capsitech)*

==> Pick the tool based on the type of state:

    +-------------------------------------------+--------------------------------------------+
    | Type of state                             | Tool                                       |
    +===========================================+============================================+
    | Local UI (input, modal open)              | `useState` / `useReducer`                  |
    +-------------------------------------------+--------------------------------------------+
    | Shared, rarely changes (theme, auth user) | Context API                                |
    +-------------------------------------------+--------------------------------------------+
    | Big app-wide state, many updates          | Redux Toolkit / Zustand                    |
    +-------------------------------------------+--------------------------------------------+
    | Server data (API responses)               | React Query / RTK Query (caching, refetch) |
    +-------------------------------------------+--------------------------------------------+
    | URL state (filters, page)                 | Query params                               |
    +-------------------------------------------+--------------------------------------------+

    Tips: keep state as close as possible to where it is used, don't store derived values, normalise
    lists by id, and split contexts so one change doesn't re-render everything.

---

26. How can you improve the performance of a React application (large lists, complex UIs)?
    *(Asked 1×: Persistent Systems)*

==>
    - `React.memo` to skip re-rendering children with the same props.
    - `useMemo` / `useCallback` for heavy calculations and stable callbacks.
    - **Virtualise large lists** (react-window / react-virtualized) – render only visible rows.
    - **Code splitting / lazy loading** with `React.lazy` + `Suspense`.
    - Correct `key` props.
    - Keep state local; split big contexts.
    - Debounce search inputs; paginate data.
    - Optimise images, production build, and measure with React Profiler.

---

27. What is lazy loading? Ways to implement it; component-level vs data-level
    *(Asked 1×: EZ Works)*

==> Lazy loading = **load something only when it is needed**, not at start. Makes the first load
    faster.

    - **Component-level** – split code so a component's JS is downloaded only when shown.

    ```jsx
    const Dashboard = React.lazy(() => import("./Dashboard"));

    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
    ```
    (Next.js: `dynamic(() => import("./Chart"))`.)

    - **Data-level** – fetch data only when needed: pagination, infinite scroll, load on tab click,
      `IntersectionObserver` when the user scrolls near it.
    - **Images** – `<img loading="lazy">` or Next.js `<Image>`.

---

28. useCallback, React.memo, preventing re-renders: when does memoization make sense?
    *(Asked 1×: EZ Works)*

==>
    - `React.memo(Component)` – skips re-render if props are the same (shallow compare).
    - `useCallback(fn, deps)` – keeps the same function reference, so a memoised child doesn't see a
      "new" prop each render.
    - `useMemo(() => value, deps)` – caches an expensive result.

    ```jsx
    const Child = React.memo(({ onClick }) => <button onClick={onClick}>Click</button>);

    function Parent() {
      const [count, setCount] = useState(0);
      const handleClick = useCallback(() => console.log("clicked"), []);
      return <><p>{count}</p><Child onClick={handleClick} /></>;
    }
    ```

    When it makes sense: the component is heavy or re-renders often with the same props, the
    calculation is expensive, or a function/object is a prop to a memoised child or a `useEffect`
    dependency.
    When not: small cheap components – memoization itself costs memory and comparisons. Measure
    first with the Profiler.

---

29. The marketing team says the website is slow. How will you debug and fix it?
    *(Asked 1×: EZ Works)*

==>
    1. **Ask & reproduce** – which page, device, network? Is it the first load or clicks?
    2. **Measure** – Lighthouse / PageSpeed / GTmetrix for LCP, CLS, FCP; Network tab for big or
       slow requests; React Profiler for slow re-renders.
    3. **Find the cause** and fix:
        - Big JS bundle → code splitting, lazy loading, remove unused libraries.
        - Heavy images → compress, WebP, lazy-load, proper sizes, CDN.
        - Slow APIs → check backend (DB indexes, caching with Redis), pagination.
        - Too many re-renders → `React.memo`, `useMemo`, virtualised lists.
        - SEO / first paint → SSR or SSG with Next.js.
        - Third-party scripts → load with `defer`/`async`.
    4. **Verify** – measure again and compare; set up monitoring so it doesn't get slow again.

---

30. What is the difference between state and props?
    *(Asked 1×: EZ Works)*

==>
    +--------------------------+----------------------------------+-----------------------------------+
    |                          | Props                            | State                             |
    +==========================+==================================+===================================+
    | Comes from               | Parent component                 | Inside the component itself       |
    +--------------------------+----------------------------------+-----------------------------------+
    | Can change?              | Read-only in the child           | Yes, with `setState` / setter     |
    +--------------------------+----------------------------------+-----------------------------------+
    | Purpose                  | Pass data/config down            | Store data that changes over time |
    +--------------------------+----------------------------------+-----------------------------------+
    | Change causes re-render? | Yes, when parent sends new props | Yes                               |
    +--------------------------+----------------------------------+-----------------------------------+

    In short: props are like function arguments; state is the component's own memory.

---

31. How do you transfer data between components?
    *(Asked 1×: American Express)*

==>
    - **Parent → child**: props.
    - **Child → parent**: parent passes a callback function as a prop; child calls it with data.
    - **Between siblings**: lift state up to the common parent.
    - **Far apart components**: Context API or Redux/Zustand.
    - Also: URL params (React Router), refs (rare).

    ```jsx
    function Parent() {
      const [msg, setMsg] = useState("");
      return <Child name="Ram" onSend={setMsg} />;   // down: name, up: onSend
    }
    function Child({ name, onSend }) {
      return <button onClick={() => onSend("Hi from " + name)}>Send</button>;
    }
    ```

---

32. What is prop drilling?
    *(Asked 1×: EZ Works)*

==> Prop drilling = passing props through **many middle components that don't need them**, just to
    reach a deep child.
    - Problem: messy code, hard to change, extra re-renders.
    - Fix: Context API, Redux/Zustand, or component composition (pass the child as `children`).

    `App → Layout → Sidebar → Profile` – all just to give `user` to `Profile`.

---

33. Write a React example that handles user input and shows the submitted value
    *(Asked 1×: Persistent Systems)*

==>
    ```jsx
    import { useState } from "react";

    export default function App() {
      const [input, setInput] = useState("");
      const [submitted, setSubmitted] = useState("");

      const handleSubmit = (e) => {
        e.preventDefault();      // stop page reload
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
    ```

    `input` holds what you type (controlled input); `submitted` is set only when the form is
    submitted.

---

34. Controlled vs uncontrolled components
    *(Asked 1×: EZ Works)*

==>
    +-----------------+--------------------------------------------+------------------------------------+
    |                 | Controlled                                 | Uncontrolled                       |
    +=================+============================================+====================================+
    | Value stored in | React state                                | The DOM itself                     |
    +-----------------+--------------------------------------------+------------------------------------+
    | Read value      | From state                                 | With a `ref` (`ref.current.value`) |
    +-----------------+--------------------------------------------+------------------------------------+
    | Code            | `value` + `onChange`                       | `defaultValue` + `useRef`          |
    +-----------------+--------------------------------------------+------------------------------------+
    | Good for        | Validation, live formatting, dynamic forms | Simple forms, file inputs          |
    +-----------------+--------------------------------------------+------------------------------------+

    ```jsx
    // Controlled
    const [name, setName] = useState("");
    <input value={name} onChange={e => setName(e.target.value)} />

    // Uncontrolled
    const ref = useRef();
    <input defaultValue="" ref={ref} />   // read ref.current.value on submit
    ```

---

35. Counter app with useState (plus and minus buttons)
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
    ```

    Interview tip: use the updater form `c => c + 1` so it always uses the latest value.

---

36. Piano tiles: 8 tiles that expand vertically when clicked (map + useState toggle)
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
    ```

    One boolean per tile; clicking flips only that tile's value (new array, no mutation). If only
    one tile should be open at a time, store `openIndex` instead: `setOpenIndex(openIndex === i ?
    null : i)`.

---

37. What are Higher-Order Components (HOCs)? How are they different from render props?
    *(Asked 1×: AST Consulting)*

==> An **HOC** is a function that takes a component and returns a new component with extra features
    (like a wrapper).

    ```jsx
    function withLoading(Component) {
      return function Wrapped({ loading, ...props }) {
        if (loading) return <p>Loading...</p>;
        return <Component {...props} />;
      };
    }
    const UserListWithLoading = withLoading(UserList);
    ```

    **Render props**: a component takes a **function as a prop** and calls it to decide what to
    render.

    ```jsx
    <MouseTracker render={(pos) => <p>{pos.x}, {pos.y}</p>} />
    ```

    +----------+-----------------------------------+------------------------------------+
    |          | HOC                               | Render props                       |
    +==========+===================================+====================================+
    | How      | Wraps a component                 | Passes a function that returns JSX |
    +----------+-----------------------------------+------------------------------------+
    | Problems | "Wrapper hell", prop name clashes | Nested callbacks                   |
    +----------+-----------------------------------+------------------------------------+
    | Example  | `withRouter`, `connect` (Redux)   | `<Formik>{...}</Formik>`           |
    +----------+-----------------------------------+------------------------------------+

    Today both are mostly replaced by **custom hooks**.

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
