# Docker, CI/CD, Git & Testing – Interview Questions & Answers

Questions that were really asked in interviews (company rounds, online interview reports, YouTube
interviews).
Ordered by priority: the question asked by the most interviewers comes first.

---

1. What is the difference between Git and GitHub?
   *(Asked 2×: HashedIn by Deloitte, rtCamp)*

==> Comparison:

    +---------------+----------------------------------+--------------------------------------------+
    | Feature       | Git                              | GitHub                                     |
    +===============+==================================+============================================+
    | What          | Version control tool             | Website/hosting service for Git repos      |
    +---------------+----------------------------------+--------------------------------------------+
    | Where         | Installed on your computer       | In the cloud (github.com)                  |
    +---------------+----------------------------------+--------------------------------------------+
    | Works offline | Yes                              | No                                         |
    +---------------+----------------------------------+--------------------------------------------+
    | Main use      | Track changes, branches, commits | Share code, pull requests, code review,    |
    |               |                                  | issues, GitHub Actions                     |
    +---------------+----------------------------------+--------------------------------------------+
    | Alternatives  | SVN, Mercurial                   | GitLab, Bitbucket                          |
    +---------------+----------------------------------+--------------------------------------------+

    In short: Git is the tool, GitHub is a place to host Git repositories and collaborate.

---

2. Common and advanced Git commands
   *(Asked 2×: HashedIn by Deloitte, Interview, no company)*

==> Common:

    ```bash
    git init                      # start a new repo
    git clone <url>               # copy a remote repo
    git status                    # see changed files
    git add .                     # stage changes
    git commit -m "message"       # save a snapshot
    git push origin main          # send commits to remote
    git pull                      # fetch + merge remote changes
    git branch feature-x          # create branch
    git checkout -b feature-x     # create + switch (or: git switch -c feature-x)
    git merge feature-x           # merge branch into current
    git log --oneline             # short history
    git diff                      # see line changes
    ```

    Advanced:

    ```bash
    git rebase main               # replay my commits on top of main
    git stash / git stash pop     # save unfinished work, bring it back
    git cherry-pick <commit>      # copy one commit to current branch
    git reset --soft HEAD~1       # undo last commit, keep changes
    git revert <commit>           # new commit that undoes an old one (safe for shared branches)
    git reflog                    # history of HEAD, recover "lost" commits
    git bisect                    # binary search to find the commit that added a bug
    git tag v1.0.0                # mark a release
    ```

---

3. Have you worked on Docker? Explain
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> Sample answer: "Yes. I containerized our Node.js APIs with Docker. I wrote the Dockerfiles, used
    docker-compose to run the API with MongoDB/Redis locally, and in CI/CD we build the image, push
    it to a registry (ECR / Docker Hub) and deploy it to ECS."
    Technical point:
    - **Docker** packages the app + its runtime + libraries into an **image**, so it runs the same
      on every machine ("works on my machine" problem solved).
    - A running image is a **container** – light, starts in seconds, isolated from others.

---

4. Docker architecture
   *(Asked 1×: Inorg Global)*

==> Docker uses a **client–server** architecture:
    - **Docker Client** – the `docker` CLI you type commands in.
    - **Docker Daemon (dockerd)** – background service that builds images and runs containers.
    - **Images** – read-only templates (built from a Dockerfile, in layers).
    - **Containers** – running instances of images.
    - **Registry** – stores images (Docker Hub, AWS ECR).

    ```
    docker CLI ──REST API──> Docker Daemon ──> Images ──run──> Containers
                                  │
                                  └──pull / push──> Registry (Docker Hub / ECR)
    ```

---

5. What is a Docker registry?
   *(Asked 1×: Inorg Global)*

==> A Docker registry is a **storage place for Docker images**, like GitHub but for images.
    - Public: **Docker Hub**. Private: **AWS ECR**, GitHub Container Registry, Azure ACR.
    - `docker push` uploads an image, `docker pull` downloads it.
    - Inside a registry, a **repository** holds versions of one image, marked by **tags** (e.g.
      `my-api:1.0`).

    ```bash
    docker tag my-api myuser/my-api:1.0
    docker push myuser/my-api:1.0
    docker pull myuser/my-api:1.0
    ```

---

6. Virtualization vs containerization
   *(Asked 1×: Inorg Global)*

==> Comparison:

    +---------------------+---------------------------------+-------------------------------------+
    | Feature             | Virtualization (VMs)            | Containerization (Docker)           |
    +=====================+=================================+=====================================+
    | What is virtualized | Hardware                        | Operating system                    |
    +---------------------+---------------------------------+-------------------------------------+
    | OS                  | Each VM has a full guest OS     | Containers share the host OS kernel |
    +---------------------+---------------------------------+-------------------------------------+
    | Managed by          | Hypervisor (VMware, VirtualBox) | Container engine (Docker)           |
    +---------------------+---------------------------------+-------------------------------------+
    | Size                | GBs                             | MBs                                 |
    +---------------------+---------------------------------+-------------------------------------+
    | Start time          | Minutes                         | Seconds                             |
    +---------------------+---------------------------------+-------------------------------------+
    | Isolation           | Stronger                        | Lighter (process level)             |
    +---------------------+---------------------------------+-------------------------------------+

    In short: VMs = many full computers on one machine; containers = isolated apps sharing one OS,
    so they are lighter and faster.

---

7. Write a Dockerfile for a Node.js application
   *(Asked 1×: Inorg Global)*

==>
    ```dockerfile
    # 1. Base image with Node.js
    FROM node:20-alpine

    # 2. Folder inside the container
    WORKDIR /app

    # 3. Copy package files first (better layer caching)
    COPY package*.json ./

    # 4. Install only production dependencies
    RUN npm ci --omit=dev

    # 5. Copy the rest of the code
    COPY . .

    # 6. Run as non-root user (safer)
    USER node

    # 7. Port the app listens on
    EXPOSE 3000

    # 8. Start the app
    CMD ["node", "server.js"]
    ```

    Also add a `.dockerignore` with `node_modules` and `.env`. Build and run:

    ```bash
    docker build -t my-node-app .
    docker run -d -p 3000:3000 --name api my-node-app
    ```

---

8. What is a Docker volume?
   *(Asked 1×: rtCamp)*

==> A volume is **storage outside the container** that keeps data even when the container is
    deleted.
    - Container files are lost when the container is removed; volumes keep them.
    - Used for databases (MongoDB/MySQL data), uploads, logs.
    - Types: **named volume** (managed by Docker), **bind mount** (a host folder, useful in
      development).

    ```bash
    docker volume create mongo-data
    docker run -d -v mongo-data:/data/db mongo        # named volume
    docker run -d -v $(pwd):/app my-node-app          # bind mount
    ```

---

9. Docker image vs container
   *(Asked 1×: rtCamp)*

==> Comparison:

    +------------+--------------------------------+------------------------------+
    | Feature    | Image                          | Container                    |
    +============+================================+==============================+
    | What       | Read-only template / blueprint | Running instance of an image |
    +------------+--------------------------------+------------------------------+
    | State      | Static, does not run           | Running (or stopped) process |
    +------------+--------------------------------+------------------------------+
    | Created by | `docker build`                 | `docker run`                 |
    +------------+--------------------------------+------------------------------+
    | Changeable | No (build a new one)           | Has a thin writable layer    |
    +------------+--------------------------------+------------------------------+
    | Analogy    | Class                          | Object                       |
    +------------+--------------------------------+------------------------------+

    One image can start many containers.

---

10. Docker vs Kubernetes
   *(Asked 1×: Visa)*

==> Comparison:

    +-----------------+----------------------------+----------------------------------------+
    | Feature         | Docker                     | Kubernetes (K8s)                       |
    +=================+============================+========================================+
    | What            | Builds and runs containers | Manages (orchestrates) many containers |
    +-----------------+----------------------------+----------------------------------------+
    | Scope           | Usually one machine        | Cluster of many machines               |
    +-----------------+----------------------------+----------------------------------------+
    | Scaling         | Manual                     | Auto-scaling                           |
    +-----------------+----------------------------+----------------------------------------+
    | Self-healing    | No                         | Restarts/replaces failed containers    |
    +-----------------+----------------------------+----------------------------------------+
    | Load balancing  | Basic                      | Built-in (Services)                    |
    +-----------------+----------------------------+----------------------------------------+
    | Rolling updates | No                         | Yes, with rollback                     |
    +-----------------+----------------------------+----------------------------------------+

    In short: Docker makes the containers; Kubernetes runs and manages lots of them in production.
    They are used together.

---

11. Common Docker commands
   *(Asked 1×: HashedIn by Deloitte)*

==>
    ```bash
    docker build -t my-app .            # build image from Dockerfile
    docker images                       # list images
    docker run -d -p 3000:3000 my-app   # run container (detached, map port)
    docker ps                           # running containers (-a = all)
    docker logs -f <container>          # view logs
    docker exec -it <container> sh      # open shell inside container
    docker stop <container>             # stop
    docker rm <container>               # remove container
    docker rmi <image>                  # remove image
    docker pull node:20-alpine          # download image
    docker push myuser/my-app:1.0       # upload image
    docker compose up -d                # start all services in docker-compose.yml
    docker compose down                 # stop them
    ```

---

12. What is git rebase?
   *(Asked 1×: UST)*

==> `git rebase` moves your branch's commits and **replays them on top of another branch**, giving a
    straight (linear) history without merge commits.

    ```bash
    git checkout feature
    git rebase main        # put feature commits on top of latest main
    git rebase -i HEAD~3   # interactive: squash / edit last 3 commits
    ```

    +-------------------------+--------------------------------+--------------------------+
    |                         | Merge                          | Rebase                   |
    +=========================+================================+==========================+
    | History                 | Keeps all, adds a merge commit | Linear, rewrites commits |
    +-------------------------+--------------------------------+--------------------------+
    | Safe on shared branches | Yes                            | No (changes commit ids)  |
    +-------------------------+--------------------------------+--------------------------+

    Interview tip: never rebase a branch others are already using (public/shared branch).

---

13. How do you resolve merge conflicts in Git?
   *(Asked 1×: American Express)*

==> A conflict happens when two branches change the same lines.
    1. Run `git merge` / `git pull` – Git lists the conflicted files.
    2. Open each file and find the conflict markers (shown below).
    3. Keep the right code (yours, theirs or both) and delete the markers. (VS Code shows "Accept
       Current / Incoming / Both".)
    4. `git add <file>` to mark it resolved.
    5. `git commit` (or `git rebase --continue` during a rebase).
    6. Run tests before pushing. To give up: `git merge --abort`.

    ```
    <<<<<<< HEAD
    my change
    =======
    their change
    >>>>>>> feature
    ```

    Interview tip: pull often and keep PRs small to avoid big conflicts.

---

14. Can we use Git without GitHub?
   *(Asked 1×: rtCamp)*

==> **Yes.** Git is a standalone tool that works fully on your local machine.
    - `git init`, commit, branch, merge all work offline with no GitHub.
    - For sharing, you can use other hosts (GitLab, Bitbucket, Azure Repos) or your own server, or
      even a shared folder as a remote.

---

15. Where does Git store data?
   *(Asked 1×: rtCamp)*

==> In the hidden **`.git` folder** at the root of the project.
    - `.git/objects` – all content as objects: blobs (file contents), trees (folders), commits,
      tags.
    - `.git/refs` – branches and tags (pointers to commits).
    - `.git/HEAD` – which branch you are on.
    - `.git/config` – repo settings (remotes etc.).
    Delete `.git` and the folder is no longer a Git repo (history is gone).

---

16. What steps do you include in a CI/CD pipeline?
   *(Asked 1×: Kyndryl)*

==>
    1. Code push / pull request (Git) triggers the pipeline.
    2. Install dependencies (`npm ci`).
    3. Lint and static analysis (ESLint, SonarQube).
    4. Unit tests (+ coverage).
    5. Integration tests.
    6. Build (e.g. TypeScript compile, Docker image) and security scan (`npm audit`).
    7. Push artifact/image to a registry (ECR / Docker Hub).
    8. Deploy to staging → smoke tests → approval → production.
    9. Monitoring and rollback if something breaks.

---

17. What does a basic CI/CD workflow look like? (whiteboard)
   *(Asked 1×: Visa)*

==> CI (Continuous Integration) = every push is built and tested automatically. CD (Continuous
    Delivery/Deployment) = tested code is deployed automatically.

    ```
    Developer ──push──> GitHub ──trigger──> CI: install → lint → test → build image
                                                                     │
                                                   push image to registry (ECR)
                                                                     │
                                       CD: deploy staging → tests → approve → deploy prod
                                                                     │
                                                           monitor / rollback
    ```

    Example with GitHub Actions:

    ```yaml
    # .github/workflows/ci-cd.yml
    name: CI-CD
    on:
      push:
        branches: [main]
      pull_request:

    jobs:
      build-test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: 20
              cache: npm
          - run: npm ci
          - run: npm run lint
          - run: npm test

      deploy:
        needs: build-test
        if: github.ref == 'refs/heads/main'
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - run: docker build -t my-api:${{ github.sha }} .
          - run: echo "push image to registry and deploy (e.g. ECS) here"
    ```

---

18. CI/CD, test automation and code review processes
   *(Asked 1×: Hyland Software)*

==> Sample answer:
    - **CI/CD:** every PR runs GitHub Actions – install, lint, unit + integration tests, build.
      Merge to `main` deploys to staging; production after approval.
    - **Test automation:** Jest unit tests and Supertest API tests run on every PR; the PR is
      blocked if tests fail or coverage drops.
    - **Code review:** feature branch → pull request → at least 1–2 reviewers approve → merge.
      Reviewers check logic, naming, error handling, security and tests. Branch protection stops
      direct pushes to `main`.

---

19. Do you configure CI/CD pipelines?
   *(Asked 1×: Tech Mahindra (YT))*

==> Sample answer: "Yes. I have written GitHub Actions workflows for our Node.js services: install,
    lint, test, build the Docker image, push to ECR and deploy to ECS / Lambda (with Serverless
    Framework). Secrets like AWS keys are stored in GitHub Secrets, not in code."
    Technical point: a pipeline is a YAML file in the repo (`.github/workflows/*.yml`,
    `.gitlab-ci.yml`, `Jenkinsfile`) with triggers (`on: push`) and jobs made of steps (see the YAML
    in question 17).

---

20. How do you deploy your applications / microservices?
   *(Asked 1×: Tech Mahindra (YT))*

==> Sample answer:
    1. Each microservice has its own repo/folder, Dockerfile and pipeline.
    2. On merge to `main`, CI runs tests and builds a Docker image tagged with the commit id.
    3. Image is pushed to **AWS ECR**.
    4. Pipeline updates the **ECS (Fargate) service** (or Kubernetes deployment) with the new image
       – a **rolling update**, so there is no downtime.
    5. Load balancer health checks confirm the new version; if it fails, roll back to the previous
       image.
    6. Serverless parts are deployed as Lambdas with Serverless Framework / SAM.
    Config and secrets come from environment variables / Secrets Manager.

---

21. What is DevOps and which tools are used?
   *(Asked 1×: HashedIn by Deloitte)*

==> DevOps is a way of working where **development and operations teams work together** and automate
    building, testing, deploying and monitoring, so software is released faster and more reliably.

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

---

22. What is your testing approach: TDD or after coding?
   *(Asked 1×: Kyndryl)*

==> Two approaches:
    - **TDD (Test-Driven Development):** write a failing test first → write code to pass it →
      refactor ("red, green, refactor").
    - **Test after coding:** write the feature first, then add tests.
    Sample answer: "I use a hybrid. For critical business logic (payments, calculations) I prefer
    TDD. For UI or quick changes I write tests right after coding. Either way, every PR must include
    tests and pass CI."

---

23. Which unit testing frameworks have you used in Node.js?
   *(Asked 1×: Tech Mahindra (YT))*

==> Sample answer: "Mainly **Jest**, with **Supertest** for API tests. I have also used **Mocha +
    Chai** (with Sinon for mocks)."
    - Jest – all-in-one: test runner, assertions, mocks, coverage.
    - Mocha – test runner; Chai – assertions; Sinon – spies/stubs/mocks.
    - Supertest – call Express routes in tests without starting a real server.
    - Node.js also has a built-in runner: `node:test`.

    ```js
    // sum.test.js (Jest)
    const sum = (a, b) => a + b;

    test("adds 2 + 3", () => {
      expect(sum(2, 3)).toBe(5);
    });
    ```

---

24. How do you ensure code quality (no bugs)?
   *(Asked 1×: Tech Mahindra (YT))*

==> No code is 100% bug-free, but I reduce bugs with:
    - **Tests** – unit, integration and API tests with good coverage (Jest, Supertest).
    - **Linting & formatting** – ESLint + Prettier; TypeScript for type safety.
    - **Code reviews** – every PR reviewed before merge.
    - **CI checks** – lint, tests and SonarQube must pass before merge.
    - **Input validation and error handling** – Joi/Zod, central error middleware.
    - **Monitoring** – logs and alerts to catch issues early in production.

---

25. What is code reusability?
   *(Asked 1×: EarlyCoder 5-yr Node (YT))*

==> Code reusability = **write code once and use it in many places**, instead of copy-pasting (DRY:
    Don't Repeat Yourself).
    - Ways: functions, modules, classes, middleware, React components, shared npm packages.
    - Benefits: less code, fewer bugs, fix in one place, faster development.

    ```js
    // utils/response.js – reused by every controller
    export const sendSuccess = (res, data, status = 200) =>
      res.status(status).json({ success: true, data });

    // in any controller
    sendSuccess(res, user);
    sendSuccess(res, order, 201);
    ```

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
