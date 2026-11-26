# Docker, CI/CD, Git & Testing – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

##### 1. What is the difference between Git and GitHub?

*(Asked 2×: HashedIn by Deloitte, rtCamp)*

==> **Git** is the version control tool on your machine. **GitHub** is a website that hosts Git
repos and adds team features on top.

```text
+---------------+----------------------------------+--------------------------------------------+
| Feature       | Git                              | GitHub                                     |
+===============+==================================+============================================+
| What          | Version control tool (CLI)       | Hosting service for Git repos              |
+---------------+----------------------------------+--------------------------------------------+
| Where         | Installed on your computer       | In the cloud (github.com)                  |
+---------------+----------------------------------+--------------------------------------------+
| Works offline | Yes                              | No                                         |
+---------------+----------------------------------+--------------------------------------------+
| Main use      | Commits, branches, merges,       | Pull requests, code review, issues,        |
|               | history                          | GitHub Actions (CI/CD)                     |
+---------------+----------------------------------+--------------------------------------------+
```

```bash
git init && git commit -m "first"          # Git only – no internet needed
git remote add origin https://github.com/me/app.git
git push -u origin main                     # now the code is on GitHub
```

In short: Git is the tool; GitHub is a place to host Git repos and collaborate.

---

##### 2. Common and advanced Git commands

*(Asked 2×: HashedIn by Deloitte, Interview, no company)*

==> **Daily commands:**

```bash
git init                      # start a new repo
git clone <url>               # copy a remote repo
git status                    # see changed / staged files
git add .                     # stage changes
git commit -m "message"       # save a snapshot
git push origin main          # send commits to the remote
git pull                      # fetch + merge remote changes
git switch -c feature-x       # create + switch branch (old way: git checkout -b)
git merge feature-x           # merge a branch into the current one
git log --oneline             # short history
git diff                      # see line changes
```

**Advanced commands:**

```bash
git rebase main               # replay my commits on top of main
git stash                     # park unfinished work...
git stash pop                 # ...and bring it back
git cherry-pick <commit>      # copy one commit to the current branch
git reset --soft HEAD~1       # undo last commit, keep the changes staged
git revert <commit>           # new commit that undoes an old one (safe on shared branches)
git reflog                    # history of HEAD – recover "lost" commits
git bisect start              # binary search for the commit that added a bug
git tag v1.0.0                # mark a release
```

---

##### 3. Have you worked on Docker? Explain

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> Sample answer: "Yes. I containerized our APIs with Docker. I wrote the Dockerfiles, used
**Docker Compose** to run the API with its database locally, and in the CI/CD pipeline we build the
image, push it to a registry and deploy it."

**Key points:**
- **Docker** packages the app + runtime + libraries into an **image**, so it runs the same on every
  machine – no more "works on my machine".
- A running image is a **container** – lightweight, starts in seconds, isolated from other
  containers.

```bash
docker build -t my-api .
docker run -d -p 3000:3000 my-api
docker ps
# Output: CONTAINER ID  IMAGE   ...  PORTS                   NAMES
#         a1b2c3d4e5f6  my-api  ...  0.0.0.0:3000->3000/tcp  eager_turing
```

In short: Docker = build once, run the same everywhere.

---

##### 4. Docker architecture

*(Asked 1×: Inorg Global)*

==> Docker uses a **client–server** architecture:
- **Docker Client** – the `docker` CLI where you type commands.
- **Docker Daemon (`dockerd`)** – background service that builds images and runs containers. The
  CLI talks to it through a **REST API**.
- **Images** – read-only templates built from a Dockerfile, made of **layers**.
- **Containers** – running instances of images.
- **Registry** – stores images (e.g. Docker Hub).

```text
docker CLI --REST API--> Docker Daemon --> Images --run--> Containers
                               |
                               +--pull / push--> Registry (Docker Hub)
```

Example: `docker run nginx` → the CLI asks the daemon → the daemon pulls `nginx` from Docker Hub
if it's not local → creates and starts the container.

In short: CLI sends commands, the daemon does the work, the registry stores images.

---

##### 5. What is a Docker registry?

*(Asked 1×: Inorg Global)*

==> A Docker registry is a **storage place for Docker images**.
- Public: **Docker Hub**. Private: a registry only your team can access.
- `docker push` uploads an image, `docker pull` downloads it.
- Inside a registry, a **repository** holds all versions of one image, marked by **tags** (e.g.
  `my-api:1.0`). No tag means `:latest`.

```bash
docker tag my-api myuser/my-api:1.0
docker push myuser/my-api:1.0
docker pull myuser/my-api:1.0
```

In short: registry = image store; repository = one image; tag = its version.

---

##### 6. Virtualization vs containerization

*(Asked 1×: Inorg Global)*

==>

```text
+---------------------+---------------------------------+-------------------------------------+
| Feature             | Virtualization (VMs)            | Containerization (Docker)           |
+=====================+=================================+=====================================+
| What is virtualized | Hardware                        | Operating system                    |
+---------------------+---------------------------------+-------------------------------------+
| OS                  | Each VM has a full guest OS     | Containers share the host OS kernel |
+---------------------+---------------------------------+-------------------------------------+
| Managed by          | Hypervisor                      | Container engine (Docker)           |
+---------------------+---------------------------------+-------------------------------------+
| Size                | GBs                             | MBs                                 |
+---------------------+---------------------------------+-------------------------------------+
| Start time          | Minutes                         | Seconds                             |
+---------------------+---------------------------------+-------------------------------------+
| Isolation           | Stronger (separate kernel)      | Lighter (namespaces + cgroups)      |
+---------------------+---------------------------------+-------------------------------------+
```

- Docker isolates containers with Linux **namespaces** (own processes, network, files) and limits
  resources with **cgroups** (CPU, memory).

In short: VMs = many full computers on one machine; containers = isolated apps sharing one
kernel, so they are lighter and faster.

---

##### 7. Write a Dockerfile for a Node.js application

*(Asked 1×: Inorg Global)*

==>

```dockerfile
# 1. Base image with Node.js
FROM node:20-alpine

# 2. Working folder inside the container
WORKDIR /app

# 3. Copy package files first – this layer is cached until dependencies change
COPY package*.json ./

# 4. Install only production dependencies
RUN npm ci --omit=dev

# 5. Copy the rest of the code
COPY . .

# 6. Run as the non-root "node" user (safer)
USER node

# 7. Document the port the app listens on
EXPOSE 3000

# 8. Start the app
CMD ["node", "server.js"]
```

Add a **`.dockerignore`** so junk and secrets don't go into the image:

```text
node_modules
.env
.git
```

Build and run:

```bash
docker build -t my-node-app .
docker run -d -p 3000:3000 --name api my-node-app
curl localhost:3000
# Output: whatever your app returns, e.g. {"status":"ok"}
```

- **Layer caching**: copying `package*.json` before the code means `npm ci` reruns only when
  dependencies change, not on every code change.
- `EXPOSE` only documents the port; `-p 3000:3000` actually publishes it.

In short: small base image, copy package files first, `npm ci`, non-root user, `CMD` to start.

---

##### 8. What is a Docker volume?

*(Asked 1×: rtCamp)*

==> A **volume** is storage **outside the container's writable layer**, so data survives when the
container is deleted.
- Without a volume, files written inside a container are lost when you `docker rm` it.
- Types:
  - **Named volume** – managed by Docker.
  - **Bind mount** – a folder from the host mapped into the container.

```bash
docker volume create app-data
docker run -d -v app-data:/data my-app            # named volume
docker run -d -v $(pwd):/app my-app               # bind mount
docker volume ls
# Output: DRIVER  VOLUME NAME
#         local   app-data
```

In short: containers are throwaway; volumes keep the data.

---

##### 9. Docker image vs container

*(Asked 1×: rtCamp)*

==>

```text
+------------+--------------------------------+------------------------------+
| Feature    | Image                          | Container                    |
+============+================================+==============================+
| What       | Read-only template / blueprint | Running instance of an image |
+------------+--------------------------------+------------------------------+
| State      | Static, does not run           | Running (or stopped) process |
+------------+--------------------------------+------------------------------+
| Created by | docker build                   | docker run                   |
+------------+--------------------------------+------------------------------+
| Changeable | No (build a new one)           | Has a thin writable layer    |
+------------+--------------------------------+------------------------------+
| Analogy    | Class                          | Object                       |
+------------+--------------------------------+------------------------------+
```

One image can start many containers:

```bash
docker run -d --name api1 my-api
docker run -d --name api2 my-api     # same image, second container
```

In short: image = class, container = object.

---

##### 10. Docker vs Kubernetes

*(Asked 1×: Visa)*

==>

```text
+-----------------+----------------------------+----------------------------------------+
| Feature         | Docker                     | Kubernetes (K8s)                       |
+=================+============================+========================================+
| What            | Builds and runs containers | Manages (orchestrates) many containers |
+-----------------+----------------------------+----------------------------------------+
| Scope           | Usually one machine        | Cluster of many machines (nodes)       |
+-----------------+----------------------------+----------------------------------------+
| Scaling         | Manual (docker run again)  | Auto-scaling (HPA)                     |
+-----------------+----------------------------+----------------------------------------+
| Self-healing    | Only restart policies      | Restarts/replaces failed pods          |
+-----------------+----------------------------+----------------------------------------+
| Load balancing  | Basic                      | Built-in (Services)                    |
+-----------------+----------------------------+----------------------------------------+
| Rolling updates | No (plain Docker)          | Yes, with rollback                     |
+-----------------+----------------------------+----------------------------------------+
```

- In Kubernetes you describe the **desired state** in YAML (e.g. "3 replicas of my-api") and K8s
  keeps it that way.

In short: Docker makes the containers; Kubernetes runs and manages lots of them in production.
They are used together.

---

##### 11. Common Docker commands

*(Asked 1×: HashedIn by Deloitte)*

==>

```bash
docker build -t my-app .            # build image from Dockerfile
docker images                       # list images
docker run -d -p 3000:3000 my-app   # run container (detached, map host:container port)
docker ps                           # running containers (-a = all, including stopped)
docker logs -f <container>          # follow logs
docker exec -it <container> sh      # open a shell inside the container
docker stop <container>             # stop
docker rm <container>               # remove container
docker rmi <image>                  # remove image
docker pull node:20-alpine          # download image
docker push myuser/my-app:1.0       # upload image
docker compose up -d                # start all services in docker-compose.yml
docker compose down                 # stop and remove them
docker system prune                 # clean up unused containers, networks, images
```

In short: build → run → ps/logs/exec to inspect → stop/rm to clean up.

---

##### 12. What is git rebase?

*(Asked 1×: UST)*

==> `git rebase` takes your branch's commits and **replays them on top of another branch**. Result:
a straight, **linear history** with no merge commit.

```bash
git switch feature
git rebase main        # put feature commits on top of the latest main
git rebase -i HEAD~3   # interactive: squash / reword / drop the last 3 commits
```

```text
Before:  main:    A---B---C
                       \
         feature:       D---E

After:   main:    A---B---C
                           \
         feature:           D'---E'    (new commit ids)
```

Because rebase rewrites commit ids, never rebase a branch others are already using.

In short: rebase = replay your commits on top of another branch for a clean, linear history.

---

##### 13. How do you resolve merge conflicts in Git?

*(Asked 1×: American Express)*

==> A **conflict** happens when two branches change the same lines and Git can't decide which
one to keep.
1. Run `git merge` / `git pull` – Git lists the conflicted files (`git status` shows "both
   modified").
2. Open each file and find the **conflict markers**:

   ```text
   <<<<<<< HEAD
   my change
   =======
   their change
   >>>>>>> feature
   ```

3. Keep the right code (yours, theirs or both) and delete the markers.
4. `git add <file>` to mark it resolved.
5. `git commit` (or `git rebase --continue` during a rebase).
6. Run tests before pushing. To give up: `git merge --abort`.

In short: find the markers, pick the right code, `git add`, commit.

---

##### 14. Can we use Git without GitHub?

*(Asked 1×: rtCamp)*

==> **Yes.** Git is a standalone, **distributed** tool – every clone has the full history locally.
- `git init`, commit, branch, merge, log all work offline with no GitHub.
- To share code, use any other Git host, your own server, or even a shared folder as a remote.

```bash
git init --bare /shared/app.git          # a plain folder acting as the "server"
git remote add origin /shared/app.git
git push origin main
```

In short: GitHub is optional; Git works on its own.

---

##### 15. Where does Git store data?

*(Asked 1×: rtCamp)*

==> In the hidden **`.git` folder** at the root of the project.
- `.git/objects` – all content as objects: **blobs** (file contents), **trees** (folders),
  **commits**, tags. Each is named by its hash.
- `.git/refs` – branches and tags (pointers to commits).
- `.git/HEAD` – which branch you are on.
- `.git/config` – repo settings (remotes etc.).
- `.git/index` – the **staging area**.

```bash
cat .git/HEAD
# Output: ref: refs/heads/main
```

Delete `.git` and the folder is no longer a Git repo – the history is gone.

In short: everything lives in `.git`; your working files are just a checkout of it.

---

##### 16. What steps do you include in a CI/CD pipeline?

*(Asked 1×: Kyndryl)*

==> A CI/CD pipeline automatically **builds, tests and deploys** code on every change. Typical
steps:
1. **Trigger** – push or pull request.
2. **Install** dependencies.
3. **Lint / static analysis** – catch style issues and risky code.
4. **Unit tests** + coverage.
5. **Integration / API tests** – against a test database.
6. **Build** – compile and package the app (e.g. a container image).
7. **Security scan** – check dependencies and the build for known vulnerabilities.
8. **Publish** the build artifact (e.g. push the image to a registry).
9. **Deploy** to staging → smoke tests → approval → production.
10. **Monitor**, and roll back if something breaks.

In short: trigger → install → lint → test → build → scan → publish → deploy → monitor.

---

##### 17. What does a basic CI/CD workflow look like? (whiteboard)

*(Asked 1×: Visa)*

==> **CI (Continuous Integration)** = every push is built and tested automatically.
**CD (Continuous Delivery/Deployment)** = tested code is released automatically (Delivery stops
at a manual approval; Deployment goes to production with no manual step).

```text
Developer --push--> Git repo --trigger--> CI: install -> lint -> test -> build
                                                                    |
                                                       publish build artifact
                                                                    |
                                      CD: deploy staging -> tests -> approve -> deploy prod
                                                                    |
                                                          monitor / rollback
```

In short: push → CI tests and builds → CD deploys, each step only if the previous one passed.

---

##### 18. CI/CD, test automation and code review processes

*(Asked 1×: Hyland Software)*

==> Sample answer:
- **CI/CD:** every PR runs a CI pipeline – install, lint, unit + integration tests, build.
  Merge to `main` deploys to staging; production after approval.
- **Test automation:** unit tests and API tests run on every PR. The PR is blocked
  if tests fail or coverage drops.
- **Code review:** feature branch → pull request → 1–2 reviewers approve → merge. Reviewers check
  logic, naming, error handling, security and tests.
- **Branch protection** on `main`: no direct pushes, required status checks, required approvals.

In short: PR → automatic checks → human review → merge → automatic deploy.

---

##### 19. Do you configure CI/CD pipelines?

*(Asked 1×: Tech Mahindra (YT))*

==> Sample answer: "Yes. I have written CI/CD pipelines for our services: install, lint, test,
build, publish the build and deploy it. Secrets like cloud keys are stored in the CI tool's
**secret store**, not in code."

**Key point:** a pipeline is usually a config file (often YAML) in the repo, with **triggers**
(e.g. on push) and **jobs** made of **steps**.

In short: yes – pipeline config in the repo, secrets kept in the CI tool.

---

##### 20. How do you deploy your applications / microservices?

*(Asked 1×: Tech Mahindra (YT))*

==> Sample answer:
1. Each microservice has its own repo/folder, build config and pipeline.
2. On merge to `main`, CI runs tests and builds a container image **tagged with the commit SHA**.
3. The image is pushed to a **container registry**.
4. The pipeline updates the running service with the new image – a **rolling update**, so there
   is no downtime.
5. Load balancer **health checks** confirm the new version; if it fails, we roll back to the
   previous image.

Config and secrets come from environment variables / a secrets manager, never from the image.

In short: test → build image → push to registry → rolling update → health check or rollback.

---

##### 21. What is DevOps and which tools are used?

*(Asked 1×: HashedIn by Deloitte)*

==> **DevOps** = development and operations teams working together and **automating** build, test,
deploy and monitoring, so releases are faster and safer.

```text
+------------------------+--------------------------------------------+
| Area                   | Tools                                      |
+========================+============================================+
| Version control        | Git, GitHub, GitLab                        |
+------------------------+--------------------------------------------+
| CI/CD                  | GitHub Actions, Jenkins, GitLab CI, AWS    |
|                        | CodePipeline                               |
+------------------------+--------------------------------------------+
| Containers             | Docker                                     |
+------------------------+--------------------------------------------+
| Orchestration          | Kubernetes, AWS ECS                        |
+------------------------+--------------------------------------------+
| Infrastructure as Code | Terraform, CloudFormation, AWS CDK         |
+------------------------+--------------------------------------------+
| Config management      | Ansible                                    |
+------------------------+--------------------------------------------+
| Monitoring / logs      | CloudWatch, Prometheus, Grafana, ELK,      |
|                        | Datadog                                    |
+------------------------+--------------------------------------------+
```

In short: DevOps = culture + automation; Git → CI/CD → Docker/K8s → IaC → monitoring.

---

##### 22. What is your testing approach: TDD or after coding?

*(Asked 1×: Kyndryl)*

==> Two approaches:
- **TDD (Test-Driven Development):** write a failing test first → write just enough code to pass
  → refactor. This is the **red → green → refactor** cycle.
- **Test after coding:** write the feature first, then add tests.

```js
// TDD step 1 (red): test first – fails because applyDiscount doesn't exist yet
test('10% off on orders above 1000', () => {
  expect(applyDiscount(2000)).toBe(1800);
});

// step 2 (green): simplest code that passes
const applyDiscount = (total) => (total > 1000 ? total * 0.9 : total);
```

Sample answer: "I use a hybrid. For critical business logic (payments, calculations) I prefer
TDD. For UI or quick changes I write tests right after coding. Either way, every PR must include
tests and pass CI."

In short: TDD = test first, code second; I use it where bugs are expensive.

---

##### 23. Which unit testing frameworks have you used in Node.js?

*(Asked 1×: Tech Mahindra (YT))*

==> Sample answer: "Mainly **Jest**, with **Supertest** for API tests. I have also used **Mocha +
Chai** (with Sinon for mocks)."
- **Jest** – all-in-one: test runner, assertions, mocks, coverage.
- **Mocha** – test runner; **Chai** – assertions; **Sinon** – spies/stubs/mocks.
- **Supertest** – call HTTP routes in tests without starting a real server.
- Node.js also has a built-in runner: **`node:test`** (`node --test`).

```js
// sum.test.js (Jest)
const sum = (a, b) => a + b;

test('adds 2 + 3', () => {
  expect(sum(2, 3)).toBe(5);
});
```

```bash
npx jest
# Output:
#  PASS  ./sum.test.js
#   ✓ adds 2 + 3 (2 ms)
# Tests: 1 passed, 1 total
```

In short: Jest for unit tests, Supertest for APIs.

---

##### 24. How do you ensure code quality (no bugs)?

*(Asked 1×: Tech Mahindra (YT))*

==> No code is 100% bug-free, but I reduce bugs with layers of checks:
- **Tests** – unit, integration and API tests with good coverage.
- **Linting & formatting** – a linter and an auto-formatter; **static types** for type safety.
- **Pre-commit hooks** – run lint/tests before a commit.
- **Code reviews** – every PR reviewed before merge.
- **CI checks** – lint, tests and a code-quality gate must pass before merge.
- **Input validation and error handling** – validate inputs, handle errors in one central place.
- **Monitoring** – logs and alerts to catch production issues early.

In short: catch bugs early – types, lint, tests, review, CI – and watch production.

---

##### 25. What is code reusability?

*(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> Code reusability = **write code once and use it in many places** instead of copy-pasting
(**DRY**: Don't Repeat Yourself).
- Ways: functions, modules, classes, shared components, shared packages.
- Benefits: less code, fewer bugs, fix in one place, faster development.

```js
// utils/price.js – written once
export const withTax = (amount, rate = 0.18) => amount + amount * rate;

// reused in cart, checkout and invoice code
withTax(100);        // Output: 118
withTax(100, 0.05);  // Output: 105
```

In short: write it once, import it everywhere.

======================================================================================================================================

## What to study first

```
Git basics & commands     (every project starts with version control)
   ↓
Git rebase & merge conflicts   (working with a team on branches)
   ↓
Docker basics             (image, container, Dockerfile, volume, registry)
   ↓
Docker vs Kubernetes      (running many containers in production)
   ↓
Testing & code quality    (Jest, TDD, reviews)
   ↓
CI/CD & DevOps            (automate test, build and deploy)
```

Git and Docker basics are the foundation. Testing builds on clean code in Git, and CI/CD ties
everything together: it takes code from Git, runs the tests, builds the Docker image and deploys it.
