# Contributing to SkillSwap

Thank you for your interest in contributing to SkillSwap! We welcome contributions from developers of all skill levels.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/your-feature`
4. **Make changes** and commit with conventional commit messages
5. **Push** to your fork
6. **Open a Pull Request** to `dev` branch

---

## Development Workflow

### Branch Strategy

```
main (production) ← dev (integration) ← feature/* (your work)
```

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): description      # New feature
fix(scope): description       # Bug fix
chore(scope): description     # Maintenance
docs(scope): description      # Documentation
style(scope): description     # Code style (no logic change)
refactor(scope): description  # Code restructuring
test(scope): description      # Test additions
```

**Examples:**
```
feat(match): add cosine similarity scoring
fix(auth): resolve JWT refresh token bug
chore(infra): update docker-compose redis version
docs(api): add session endpoint documentation
```

### Code Style

- **JavaScript/TypeScript:** Run `npm run lint` before pushing
- **Formatting:** Prettier auto-formats on commit
- **Tests:** Add tests for new features (`npm run test`)

---

## Making Changes

### Frontend Changes (`apps/web/`)

1. Start dev server: `npm run dev`
2. Component lives in `components/`
3. Test at `http://localhost:3000`
4. Update [DESIGN.md](./DESIGN.md) if adding new components

### Backend Changes (`services/*/`)

1. Make changes in `src/`
2. Test locally: `docker-compose up -d` then `npm run dev`
3. Add unit tests in `__tests__/`
4. Update [ARCHITECTURE.md](./ARCHITECTURE.md) if changing data model

### Shared Code (`shared/`)

- Types: `shared/types/index.ts`
- Events: `shared/events/index.js`
- Utils: `shared/utils/`

---

## Testing

```bash
# Run all tests
npm run test

# Run tests for specific package
npm run test --filter=user-service

# Watch mode
npm run test -- --watch
```

### Test Guidelines

- Write tests for new features
- Aim for 80%+ coverage
- Mock external dependencies (APIs, databases)
- Test both happy path and error cases

---

## Pull Request Process

1. **Update [README.md](./README.md)** if adding new features
2. **Add tests** for your changes
3. **Run linting:** `npm run lint`
4. **Run tests:** `npm run test`
5. **Create PR** with description:
   ```
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [x] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation
   
   ## How to Test
   Steps to test the changes
   
   ## Checklist
   - [x] Tests added/updated
   - [x] Code linted
   - [x] Documentation updated
   ```

---

## Code Review

- Be respectful and constructive
- Ask questions if something is unclear
- Suggest improvements, don't demand them
- Request changes only for significant issues

---

## Documentation

- Update [README.md](./README.md) for user-facing changes
- Update [API.md](./API.md) for API changes
- Update [DESIGN.md](./DESIGN.md) for UI changes
- Update [ARCHITECTURE.md](./ARCHITECTURE.md) for system changes
- Add inline comments for complex logic

---

## Common Tasks

### Adding a New Page to Frontend

```bash
# Create page
touch apps/web/app/(app)/newpage/page.tsx

# Add to navigation (if needed)
# Update components/layout/Sidebar.tsx

# Test
npm run dev
```

### Adding a New API Endpoint

1. Create route handler in service
2. Add to gateway proxy config
3. Document in [API.md](./API.md)
4. Add tests

### Updating Database Schema

1. Create migration file: `services/*/scripts/migrate.js`
2. Update types in `shared/types/index.ts`
3. Test migration locally
4. Document in [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Troubleshooting

### Services not starting?
```bash
# Check logs
docker-compose logs service-name

# Restart all services
docker-compose down && docker-compose up -d
```

### Port already in use?
```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Database connection issues?
```bash
# Check PostgreSQL is running
psql -U postgres -h localhost -d skillswap

# Reset database
npm run db:migrate -- --reset
```

---

## Questions or Need Help?

- Open an issue with label `question`
- Comment on related PRs
- Join discussions in GitHub Discussions

---

Thank you for contributing! 🚀
