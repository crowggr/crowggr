# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

better-blog is an open-source headless blog CMS for TanStack Start and Next.js developers. Users write content in a dashboard and fetch it via API/SDK.

## Commands

```bash
bun install              # Install dependencies
bun dev                  # Run dev server (Turborepo)
bun build                # Build all packages
bun check                # Lint + format with Biome

# Database
bun db:push              # Push schema to database
bun db:generate          # Generate migrations
bun db:migrate           # Run migrations
bun db:studio            # Open Drizzle Studio
```

## Project Structure

```
better-blog/
├── apps/
│   └── dashboard/           # TanStack Start admin UI
│       └── src/
│           ├── routes/      # File-based routing
│           ├── components/  # React components
│           ├── functions/   # Server functions
│           └── lib/         # Utilities
├── packages/
│   ├── api/                 # oRPC procedures
│   ├── auth/                # Better Auth + Polar
│   ├── db/                  # Drizzle schema + PostgreSQL
│   └── config/              # Shared tsconfig
└── docs/                    # Project documentation
```

## Architecture

### Database (`packages/db`)
- Drizzle ORM with PostgreSQL
- Schema in `src/schema/`
- Exports `db` instance and schema

### Auth (`packages/auth`)
- Better Auth with email/password
- Polar integration for payments
- Uses Drizzle adapter with `@better-blog/db`

### oRPC API (`packages/api`)
- `publicProcedure` - No auth required
- `protectedProcedure` - Requires authenticated session
- Add routers in `src/routers/`

### TanStack Start (`apps/dashboard`)
- File-based routing in `src/routes/`
- API routes: `api/auth/$.ts` (auth), `api/rpc/$.ts` (oRPC)
- Auth client in `src/lib/auth-client.ts`

## Git Workflow

```
feature branches → develop → main
```

- `develop` is the default branch (PRs target this)
- `main` is production-ready code
- Branch naming: `feat/`, `fix/`, `docs/`, `refactor/`

## Code Style

- Use `interface` over `type` for object shapes
- Avoid `any` - use `unknown` if needed
- Biome handles linting/formatting
- Keep comments minimal
- Use named imports: `import { Component } from "..."`

## Code Organization

- **hooks/** - Custom React hooks
- **lib/** - Utility functions and helpers
- Organize lib into subfolders by domain (e.g., `lib/polar/`)
- Create reusable functions and hooks for scalability

## Component Patterns

- **SSR/Server Components first** - Minimize client-side code
- Only use `"use client"` when necessary
- Extract client logic into separate components

## Commit Format

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
chore: Maintenance
refactor: Code restructure
```
