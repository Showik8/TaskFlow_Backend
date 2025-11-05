## Contributing

### Workflow

- Fork and clone the repo.
- Create a feature branch: `git checkout -b feat/<short-name>`.
- Write changes with tests when possible.
- Run locally: `npm run dev` and `npm test`.
- Open a PR to `master` with a clear description.

### Code Style

- TypeScript, prefer explicit types on public APIs.
- Keep functions small and use guard clauses.
- Avoid catching errors without handling; return proper HTTP codes.

### Commits & PRs

- Commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.
- PR must describe what changed and why; add screenshots for API clients if helpful.

### Environment

- Create `.env` from `.env.example`.
- Use `npm run seed` for demo data.
