# Contributing to better-blog

Thanks for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- [Docker](https://docker.com) (for Postgres)
- [Node.js](https://nodejs.org) v20+ (optional, for some tooling)

### Getting Started

```bash
# Clone the repo
git clone https://github.com/better-blog/better-blog
cd better-blog

# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Start database
docker compose up -d postgres

# Run migrations
bun db:migrate

# Start dev server
bun dev
```

The dashboard will be available at `http://localhost:3000`.

## Project Structure

```
better-blog/
├── apps/
│   ├── dashboard/     # Main admin UI
│   ├── docs/          # Documentation site
│   └── website/       # Landing page
├── packages/
│   ├── api/           # oRPC API
│   ├── db/            # Drizzle schema
│   ├── client/        # @better-blog/client
│   ├── react/         # @better-blog/react
│   ├── tanstack/      # @better-blog/tanstack
│   └── ui/            # Shared components
└── docs/              # Project documentation
```

## Making Changes

### Branch Naming

- `feat/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits:

```
feat: Add post scheduling
fix: Correct date parsing in editor
docs: Update API reference
refactor: Simplify auth flow
chore: Update dependencies
```

### Code Style

- Use TypeScript
- Use `interface` over `type` for objects
- Avoid `any` types
- Run `bun lint` before committing
- Run `bun format` to format code

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `bun test`
5. Run linting: `bun lint`
6. Push and create a PR

### PR Description Template

```markdown
## Summary
Brief description of changes.

## Changes
- Change 1
- Change 2

## Testing
How did you test this?

## Screenshots (if UI changes)
```

## Areas to Contribute

### Good First Issues

Look for issues labeled `good first issue` - these are beginner-friendly.

### Documentation

- Improve existing docs
- Add examples
- Fix typos

### Features

- Check the roadmap/issues for planned features
- Discuss in an issue before starting large features

### Bug Fixes

- Check existing issues for bugs
- Add reproduction steps when reporting bugs

## Testing

```bash
# Run all tests
bun test

# Run specific package tests
bun test --filter=@better-blog/client

# Run with coverage
bun test --coverage
```

## Database Changes

When modifying the schema:

```bash
# Edit packages/db/schema.ts

# Generate migration
bun db:generate

# Apply migration
bun db:migrate

# Verify in Drizzle Studio
bun db:studio
```

## Questions?

- Open a [Discussion](https://github.com/better-blog/better-blog/discussions)
- Join our [Discord](https://discord.gg/better-blog)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
