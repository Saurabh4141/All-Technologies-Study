# TypeScript – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is the use of TypeScript?

   *(Asked 1×: Algoworks)*

==> **TypeScript** = JavaScript + **static types**. The TypeScript compiler (**`tsc`**) checks your
types and then outputs plain JavaScript. Browsers and Node run that JS; the types are removed.
- Catches bugs at **compile time** (wrong type, typo in a property, missing argument) instead of
  at runtime in production.
- Better editor help: autocomplete, go-to-definition, safe rename/refactor.
- Types act as **documentation**, so big codebases and teams stay maintainable.
- Extra features: **interfaces**, **generics**, **enums**, union types, `strict` mode.

```ts
function add(a: number, b: number): number {
  return a + b;
}
add(2, 3);   // ok -> 5
add(2, "3"); // Compile error: Argument of type 'string' is not assignable
             //   to parameter of type 'number'.
```

Note: types are **compile-time only**. They don't validate data at runtime (API input still needs
a validator like Zod).

In short: same JavaScript, but checked before it runs – fewer bugs, easier maintenance.

---

2. What is the any data type?

   *(Asked 1×: Algoworks)*

==> **`any`** means "this can be anything". It **switches off type checking** for that value, so
TypeScript allows every operation on it.

```ts
let value: any = 10;
value = "hello";   // ok
value.foo.bar();   // no compile error, but crashes at runtime:
                   // TypeError: Cannot read properties of undefined (reading 'bar')
```

- `any` also spreads: assign an `any` to another variable and that one loses checking too.
- Use it rarely, e.g. while migrating old JS to TS. Prefer **`unknown`** or a real type.
- `"noImplicitAny": true` (part of `strict`) makes TS complain when it would silently guess `any`.

In short: `any` = "trust me", TypeScript stops checking.

---

3. What is the difference between unknown and any?

   *(Asked 1×: Kyndryl)*

==> Both can hold any value. The difference is what you're allowed to **do** with it.

```text
+------------------------+-----------------------+-----------------------------------+
|                        | any                   | unknown                           |
+========================+=======================+===================================+
| Type checking          | Turned off            | Still on                          |
+------------------------+-----------------------+-----------------------------------+
| Use the value directly | Yes, anything allowed | No, narrow its type first         |
+------------------------+-----------------------+-----------------------------------+
| Assign to typed var    | Yes                   | Only to unknown / any             |
+------------------------+-----------------------+-----------------------------------+
| Safety                 | Unsafe                | Safe                              |
+------------------------+-----------------------+-----------------------------------+
```

```ts
let a: any = 10;
a.toUpperCase();      // no compile error -> runtime TypeError

let b: unknown = 10;
// b.toUpperCase();   // Compile error: 'b' is of type 'unknown'.
if (typeof b === "string") {
  b.toUpperCase();    // ok – TS knows b is a string here (type narrowing)
}
```

Common use: `catch (err: unknown)` and `JSON.parse` results – check the type before using them.

In short: `unknown` is the safe version of `any` – you must check before you use.

---

4. Interface vs type in TypeScript

   *(Asked 1×: Wipro)*

==> Both describe the **shape of data**. The main differences:

```text
+-------------------------------+------------------------+-------------------------------+
|                               | interface              | type                          |
+===============================+========================+===============================+
| Best for                      | Object shapes, classes | Anything: unions, tuples,     |
|                               |                        | primitives, objects           |
+-------------------------------+------------------------+-------------------------------+
| Extend                        | extends                | & (intersection)              |
+-------------------------------+------------------------+-------------------------------+
| Declaration merging (same     | Yes                    | No (duplicate name error)     |
| name declared twice)          |                        |                               |
+-------------------------------+------------------------+-------------------------------+
| Union types (A or B)          | No                     | Yes                           |
+-------------------------------+------------------------+-------------------------------+
| Class can implement it        | Yes                    | Yes (if it's an object type)  |
+-------------------------------+------------------------+-------------------------------+
```

```ts
interface User { name: string; }
interface Admin extends User { role: string; }

interface User { age: number; }       // merged: User now has name + age

type Person = { name: string };
type Employee = Person & { salary: number };
type Status = "active" | "inactive";  // union – only possible with type
```

Interview tip: use **`interface`** for object/API shapes (and when you need merging, e.g. extending
a library's types); use **`type`** for unions, tuples and computed types.

In short: interface = extendable object shapes; type = any type, including unions.

---

5. Type-safe APIs using generics and conditional types

   *(Asked 1×: Wipro)*

==>
- **Generics** = a type parameter `<T>`. Like a function argument, but for types. One function
  works for many data types and still keeps exact types.
- **Conditional types** = "if/else" for types: `T extends X ? A : B`.

```ts
// Generic API response
type ApiResponse<T> = { success: boolean; data: T };

async function getJson<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return { success: res.ok, data: (await res.json()) as T };
}

interface User { id: number; name: string; }

async function main() {
  const users = await getJson<User[]>("/api/users");
  users.data[0].name;  // TS knows: string
  users.data[0].email; // Compile error: Property 'email' does not exist on type 'User'.
}

// Conditional type: error shape when data is null
type Result<T> = T extends null
  ? { success: false; error: string }
  : ApiResponse<T>;

type A = Result<User>; // { success: boolean; data: User }
type B = Result<null>; // { success: false; error: string }
```

- `as T` is a promise to the compiler, not a runtime check. For untrusted API data, validate it
  (e.g. Zod) and infer the type from the schema.
- Constrain generics with `extends`: `function getId<T extends { id: number }>(x: T) { return x.id; }`.

In short: generics make one helper work for every response type; conditional types pick the right
type from the input.

---

6. Create a TODO app on the MERN stack using TypeScript

   *(Asked 1×: Web3Dev)*

==> Steps (MERN = MongoDB, Express, React, Node):
1. **Backend setup**: `npm i express mongoose cors` and `npm i -D typescript ts-node
   @types/express @types/node @types/cors`, then `npx tsc --init` (turn on `"strict": true`).
2. **Model**: a `Todo` interface + a Mongoose schema typed with it (`Schema<ITodo>`).
3. **Routes**: REST API: `GET /todos`, `POST /todos`, `PUT /todos/:id`, `DELETE /todos/:id`,
   with typed `Request<Params, ResBody, ReqBody>`.
4. **Frontend**: `npm create vite@latest client -- --template react-ts`. Share the same `Todo`
   type, call the API with `fetch`/`axios`, keep todos in `useState<Todo[]>`.
5. **Extras**: input validation, error-handling middleware, `.env` for the Mongo URL.

```ts
// server/models/Todo.ts
import { Schema, model } from "mongoose";

export interface ITodo { title: string; completed: boolean; }

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
export const Todo = model<ITodo>("Todo", todoSchema);
```

```ts
// server/index.ts
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Todo } from "./models/Todo";

const app = express();
app.use(express.json());

app.get("/todos", async (_req: Request, res: Response) => {
  res.json(await Todo.find());
});

app.post("/todos", async (req: Request<{}, {}, { title: string }>, res: Response) => {
  const todo = await Todo.create({ title: req.body.title });
  res.status(201).json(todo); // -> { _id: "...", title: "Buy milk", completed: false }
});

app.delete("/todos/:id", async (req: Request<{ id: string }>, res: Response) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

mongoose.connect(process.env.MONGO_URL as string).then(() => app.listen(5000));
```

```tsx
// client/src/App.tsx (core idea)
type Todo = { _id: string; title: string; completed: boolean };

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    fetch("/todos").then(r => r.json()).then((data: Todo[]) => setTodos(data));
  }, []);
  return <ul>{todos.map(t => <li key={t._id}>{t.title}</li>)}</ul>;
}
```

In short: typed Mongoose model + typed Express routes + typed React state, sharing one `Todo` type.

======================================================================================================================================

## What to study first

```
TypeScript basics: any vs unknown     (why TS, basic types)
   ↓
Interfaces, types & generics          (describing data, reusable types)
   ↓
TypeScript project                    (using it all in a MERN app)
```

TypeScript basics (why TS, `any` vs `unknown`) are the foundation. Interfaces, `type` and generics
build on them to describe API data safely.
The MERN TODO project uses all of these together: typed models, typed Express routes and typed React
state.
