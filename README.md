## TaskFlow Backend

Minimal Node.js + Express + TypeScript API for users, projects, and tasks.

### Quick Start

- Clone: `git clone https://github.com/Showik8/TaskFlow_Backend`
- Install: `npm install`
- Env: copy `.env.example` to `.env` and fill values (see below)
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`
- Test: `npm test`
- Seed demo data: `npm run seed`

### Environment Variables (.env)

Set these in `.env`:

- `PORT=5000`
- `MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`
- `JWT_SECRET=your-strong-secret`

An example file is provided at `.env.example`.

### Run Scripts

- `npm run dev` — start with live reload (ts-node + nodemon)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled server from `dist/`
- `npm test` — run Jest tests
- `npm run seed` — seed demo user, project, and tasks

### Demo User Credentials

If you run the seed script, a demo user is created:

- Email: `user@taskflow.com`
- Password: `User123!`

### Base URL

- Local: `http://localhost:5000`
- Production (example): `task-flow-backend-three.vercel.app`

### API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (auth)
- `PUT /api/auth/profile` (auth)
- `POST /api/project` (auth)
- `GET /api/project` (auth)
- `PUT /api/project/:id`
- `DELETE /api/project/:id`
- `GET /api/project/users-projects/:id`
- `GET /api/task/:id` (project tasks)
- `GET /api/task` (auth) — by `title` and `id` query
- `POST /api/task` (auth)
- `PUT /api/task/:id` (auth)
- `PUT /api/task/status/:id` (auth)
- `DELETE /api/task/:id` (auth)

For detailed request/response schemas, see `docs/openapi.yaml`.

### User Stories

- As a user, I can register and log in to receive a JWT.
- As a user, I can view and update my profile.
- As a creator, I can create a project and add members.
- As a user, I can list projects I created or joined.
- As a user, I can create tasks in a project and assign users.
- As a user, I can update task details and status.
- As a user, I can delete tasks and projects (where authorized).

### Local Development

1. Ensure MongoDB is reachable and `.env` is set.
2. Run `npm run dev` and visit `/` to see `{ "message": "hello" }`.
3. Use the OpenAPI in `docs/openapi.yaml` with your API client.

### License

ISC
