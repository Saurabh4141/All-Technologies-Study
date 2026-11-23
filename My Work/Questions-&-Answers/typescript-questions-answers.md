# TypeScript – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is the use of TypeScript?
   *(Asked 1×: Algoworks)*

==> **TypeScript** is JavaScript plus **types**. It is compiled (turned) into plain JavaScript
    before it runs.
    - Catches bugs at compile time (wrong type, typo in a property, missing argument) instead of at
      runtime.
    - Better editor help: autocomplete, go-to-definition, safe refactoring.
    - Code is easier to read and maintain in big teams, because types act as documentation.
    - Supports interfaces, generics, enums, etc.

    ```ts
    function add(a: number, b: number): number {
      return a + b;
    }
    add(2, "3"); // Error at compile time: "3" is not a number
    ```

    In short: same JavaScript, but safer and easier to maintain.

---

2. What is the any data type?
   *(Asked 1×: Algoworks)*

==> `any` means "this can be any type". It **turns off type checking** for that value, so TypeScript
    allows anything on it.

    ```ts
    let value: any = 10;
    value = "hello";   // ok
    value.foo.bar();   // no compile error, but crashes at runtime
    ```

    Use it rarely (e.g. while moving old JS code to TS). Prefer `unknown` or a proper type.

---

3. What is the difference between unknown and any?
   *(Asked 1×: Kyndryl)*

==>
    +------------------------+-----------------------+-----------------------------------+
    |                        | `any`                 | `unknown`                         |
    +========================+=======================+===================================+
    | Type checking          | Turned off            | Still on                          |
    +------------------------+-----------------------+-----------------------------------+
    | Use the value directly | Yes, anything allowed | No, you must check its type first |
    +------------------------+-----------------------+-----------------------------------+
    | Safety                 | Unsafe                | Safe                              |
    +------------------------+-----------------------+-----------------------------------+

    ```ts
    let a: any = 10;
    a.toUpperCase();      // no compile error (crashes at runtime)

    let b: unknown = 10;
    // b.toUpperCase();   // compile error
    if (typeof b === "string") {
      b.toUpperCase();    // ok after the check
    }
    ```

    In short: `unknown` is the safe version of `any`.

---

4. Interface vs type in TypeScript
   *(Asked 1×: Wipro)*

==> Both describe the shape of data. Main differences:

    +--------------------------------------------+------------------------+--------------------------------------------+
    |                                            | `interface`            | `type`                                     |
    +============================================+========================+============================================+
    | Best for                                   | Object shapes, classes | Any type: unions, tuples, primitives,      |
    |                                            |                        | objects                                    |
    +--------------------------------------------+------------------------+--------------------------------------------+
    | Extend                                     | `extends`              | `&` (intersection)                         |
    +--------------------------------------------+------------------------+--------------------------------------------+
    | Declaration merging (same name declared    | Yes                    | No (error)                                 |
    | twice gets merged)                         |                        |                                            |
    +--------------------------------------------+------------------------+--------------------------------------------+
    | Union types (`A | B`)                      | No                     | Yes                                        |
    +--------------------------------------------+------------------------+--------------------------------------------+
    | Class can `implements` it                  | Yes                    | Yes (if it is an object type)              |
    +--------------------------------------------+------------------------+--------------------------------------------+

    ```ts
    interface User { name: string; }
    interface Admin extends User { role: string; }

    type Person = { name: string };
    type Employee = Person & { salary: number };
    type Status = "active" | "inactive"; // only possible with type
    ```

    Interview tip: use `interface` for objects/APIs, `type` for unions and more complex types.

---

5. Type-safe APIs using generics and conditional types
   *(Asked 1×: Wipro)*

==>
    - **Generics** = a type parameter `<T>`, like a function argument but for types. One function or
      type works for many data types and stays type-safe.
    - **Conditional types** = "if/else" for types: `T extends X ? A : B`.

    ```ts
    // Generic API response
    type ApiResponse<T> = { success: boolean; data: T };

    async function getJson<T>(url: string): Promise<ApiResponse<T>> {
      const res = await fetch(url);
      return { success: res.ok, data: (await res.json()) as T };
    }

    interface User { id: number; name: string; }
    const users = await getJson<User[]>("/api/users");
    users.data[0].name; // TypeScript knows this is a string

    // Conditional type: error shape when data is null
    type Result<T> = T extends null
      ? { success: false; error: string }
      : ApiResponse<T>;
    ```

    In short: generics make one API helper work for every response type, and conditional types pick
    the right type based on the input.

---

6. Create a TODO app on the MERN stack using TypeScript
   *(Asked 1×: Web3Dev)*

==> Steps (MERN = MongoDB, Express, React, Node):
    1. **Backend setup**: `npm i express mongoose cors` and `npm i -D typescript ts-node
       @types/express @types/node @types/cors`, then `npx tsc --init`.
    2. **Model**: a `Todo` interface and a Mongoose schema (`title`, `completed`).
    3. **Routes**: REST API: `GET /todos`, `POST /todos`, `PUT /todos/:id`, `DELETE /todos/:id`.
    4. **Frontend**: `npm create vite@latest client -- --template react-ts`. Share the same `Todo`
       type, call the API with `fetch`/`axios`, keep todos in `useState<Todo[]>`.
    5. **Extras**: validation, error handling middleware, `.env` for the Mongo URL.

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
      res.status(201).json(todo);
    });

    app.delete("/todos/:id", async (req: Request<{ id: string }>, res: Response) => {
      await Todo.findByIdAndDelete(req.params.id);
      res.sendStatus(204);
    });

    mongoose.connect(process.env.MONGO_URL as string).then(() => app.listen(5000));
    ```

    ```ts
    // client/src/App.tsx (core idea)
    type Todo = { _id: string; title: string; completed: boolean };
    const [todos, setTodos] = useState<Todo[]>([]);
    useEffect(() => {
      fetch("/todos").then(r => r.json()).then((data: Todo[]) => setTodos(data));
    }, []);
    ```

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
