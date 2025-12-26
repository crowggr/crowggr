# better-blog - Code Review Guidelines

## What is better-blog?

better-blog is an open-source headless blog CMS for TanStack Start and Next.js developers. Users write content in a dashboard and fetch it via API/SDK.

**Core value:** Write once in the dashboard, fetch anywhere via typed SDK.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Monorepo | Bun + Turborepo |
| Dashboard | TanStack Start (React SSR) |
| Database | PostgreSQL + Drizzle ORM |
| API | oRPC (type-safe RPC) |
| Auth | Better Auth + Polar (payments) |
| Styling | Tailwind CSS v4 |
| UI Components | Base UI + custom components |
| Linting/Formatting | Biome |

## Project Structure

```
better-blog/
├── apps/
│   └── dashboard/           # TanStack Start admin UI
│       └── src/
│           ├── routes/      # File-based routing
│           ├── components/  # React components
│           ├── functions/   # Server functions
│           ├── hooks/       # Custom React hooks
│           └── lib/         # Utilities
├── packages/
│   ├── api/                 # oRPC procedures
│   ├── auth/                # Better Auth + Polar
│   ├── db/                  # Drizzle schema + PostgreSQL
│   └── config/              # Shared tsconfig
└── docs/                    # Project documentation
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Website                          │
│  (TanStack Start / Next.js / any frontend)                     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  │ @better-blog/client
                                  │ @better-blog/react
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        better-blog API                          │
│                          (oRPC)                                 │
├─────────────────────────────────────────────────────────────────┤
│  posts.list  │  posts.get  │  tags.list  │  media.upload       │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │ Postgres │  │   S3/R2  │  │  Resend  │
              │ (Drizzle)│  │ (Media)  │  │ (Email)  │
              └──────────┘  └──────────┘  └──────────┘
```

### Multi-Tenancy Model

```
Organization (workspace)
├── Users (team members with roles: owner, admin, editor, author)
├── Sites (blogs)
│   ├── Posts
│   ├── Tags
│   └── Media
└── API Keys
```

- **Organization**: A workspace that can have multiple users and sites
- **Site**: An individual blog with its own posts, tags, and media
- **User**: A team member with a role (owner, admin, editor, author)

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `organizations` | Workspaces with plans (free, pro, enterprise) |
| `users` | User accounts (Better Auth managed) |
| `members` | Org membership with roles |
| `sites` | Individual blogs within orgs |
| `posts` | Blog posts with MDX content |
| `tags` | Post categorization |
| `post_tags` | Many-to-many posts/tags |
| `media` | Uploaded files |
| `api_keys` | SDK access keys |

### Key Relationships

```
organizations 1:N members N:1 users
organizations 1:N sites
sites 1:N posts
sites 1:N tags
sites 1:N media
sites 1:N api_keys
posts N:M tags (via post_tags)
posts N:1 users (author)
```

## API Patterns

### Procedure Types

- `publicProcedure` - No auth required (SDK endpoints)
- `protectedProcedure` - Requires authenticated session (dashboard)

### SDK Authentication

```
Authorization: Bearer bb_live_xxxxxxxxxxxxx
```

API keys are:
- Scoped to a single Site
- Read-only by default
- Rate limited per key

### Error Response Shape

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Post not found"
  }
}
```

Error codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `RATE_LIMITED`, `INTERNAL_ERROR`

## Git Workflow

```
feature branches → develop → main
```

- `develop` is the default branch (PRs target this)
- `main` is production-ready code
- Branch naming: `feat/`, `fix/`, `docs/`, `refactor/`

### Commit Format

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
chore: Maintenance
refactor: Code restructure
```

---

# Code Review Rules

## TypeScript

- **Prefer `interface` over `type`** for object shapes
- **Never use `any`** - use `unknown` if type is uncertain
- **Use named imports**: `import { Component } from "..."` not default imports
- **Avoid type assertions** (`as`) unless absolutely necessary
- All function parameters and return types should be typed

## React & Components

- **Server Components first** - only add `"use client"` when necessary
- Extract client logic into separate components rather than making entire files client-side
- No inline styles - use Tailwind classes
- Avoid prop drilling - use context or composition
- No `console.log` in production code
- Handle loading, error, and empty states
- Use semantic HTML elements

## Auth & Security

- **Protected routes must use `beforeLoad`** with auth check
- **API procedures with user data must use `protectedProcedure`**, not `publicProcedure`
- **Never expose API keys, secrets, or credentials** in code
- **Validate all user inputs** with Zod schemas
- Sanitize data before database operations
- Check organization/site membership before data access

## Database (Drizzle)

- **Use Drizzle query builder** - no raw SQL unless necessary
- **Schema changes require corresponding migrations**
- Use transactions for multi-table operations
- Always handle potential null/undefined from queries
- Use proper indexes for frequently queried fields
- Cascade deletes appropriately

## oRPC API

- **Input must be validated with Zod schema**
- Return consistent error shapes
- Use `protectedProcedure` for authenticated endpoints
- Keep procedures focused - one responsibility per procedure
- Include proper pagination for list endpoints

## TanStack Start

- Server functions belong in `src/functions/` directory
- Use file-based routing conventions in `src/routes/`
- Prefer `useQuery` for data fetching, `useMutation` for modifications
- Use `beforeLoad` for route guards and data prefetching

## Monorepo

- **Import from package names** (`@better-blog/db`) not relative paths to other packages
- Don't import from `packages/*/src` directly - use package exports
- Shared types belong in appropriate packages, not duplicated

## Code Style

- Keep comments minimal - code should be self-documenting
- No unused variables or imports (Biome enforces this)
- Prefer early returns over nested conditionals
- Destructure props and objects when practical
- Use meaningful variable names
- Group related imports together

## Git & PRs

- Commit messages follow conventional format: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
- PRs should target `develop` branch, not `main`
- Keep PRs focused - one feature/fix per PR
- Include description of what changed and why

## Performance

- Avoid unnecessary re-renders - memoize expensive computations
- Don't fetch data in loops - batch requests
- Lazy load heavy components
- Optimize images (use proper formats, sizes)
- Use proper caching strategies

## Accessibility

- Interactive elements need proper labels
- Maintain keyboard navigation
- Use semantic HTML elements
- Provide alt text for images
- Ensure sufficient color contrast

## What to Flag in Reviews

### Must Fix
- [ ] Usage of `any` type
- [ ] Missing auth checks on protected routes/procedures
- [ ] Exposed secrets or credentials
- [ ] Missing input validation
- [ ] SQL injection vulnerabilities
- [ ] Direct imports from other packages' src folders

### Should Fix
- [ ] `type` used instead of `interface` for objects
- [ ] Unnecessary `"use client"` directives
- [ ] Missing error handling
- [ ] Missing loading/empty states
- [ ] Console.log statements
- [ ] Unused imports/variables

### Consider
- [ ] Could this be a server component?
- [ ] Is this properly memoized?
- [ ] Could this cause N+1 queries?
- [ ] Is the error message user-friendly?
