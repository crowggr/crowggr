# CLAUDE.md

This file provides guidance to Claude Code when working with the better-blog codebase.

## Project Overview

better-blog is an open-source headless blog CMS for TanStack Start and Next.js developers. Users write content in a dashboard and fetch it via API/SDK in their apps.

**Repository:** https://github.com/better-blog/better-blog
**Website:** https://better.blog
**Docs:** https://docs.better.blog

## Tech Stack

- **Framework:** TanStack Start
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** Better Auth (organization plugin)
- **API:** oRPC (type-safe RPC)
- **UI:** Coss UI (shadcn-like components)
- **Payments:** Polar
- **Email:** Resend
- **Storage:** S3/R2 for media uploads
- **Runtime:** Bun
- **Monorepo:** Turborepo

## Project Structure

```
better-blog/
├── apps/
│   ├── dashboard/          # Admin UI (TanStack Start)
│   ├── docs/               # Documentation site
│   └── website/            # Marketing/landing page
│
└── packages/
    ├── api/                # oRPC API routes
    ├── db/                 # Drizzle schema & migrations
    ├── client/             # @better-blog/client (vanilla SDK)
    ├── react/              # @better-blog/react (React hooks)
    ├── tanstack/           # @better-blog/tanstack (framework integration)
    ├── ui/                 # Shared UI components
    └── utils/              # Common utilities
```

## Commands

```bash
bun install              # Install dependencies
bun dev                  # Run dashboard in dev mode
bun build                # Build all packages
bun typecheck            # Run TypeScript checks
bun lint                 # Run linting
bun format               # Format code

# Database
bun db:generate          # Generate Drizzle client
bun db:migrate           # Run migrations
bun db:studio            # Open Drizzle Studio

# Docker
docker compose up -d     # Start all services
docker compose down      # Stop services
```

## Database Schema

Core tables:
- `organizations` - Multi-tenant workspaces
- `users` - User accounts (via Better Auth)
- `sites` - Individual blogs within an org
- `posts` - Blog posts with MDX content
- `tags` - Post categorization
- `post_tags` - Many-to-many relation
- `media` - Uploaded images/files

## API Structure (oRPC)

```
posts.list       # Get posts (paginated)
posts.get        # Get post by slug
posts.create     # Create new post
posts.update     # Update post
posts.delete     # Delete post
posts.publish    # Publish draft

tags.list        # Get all tags
tags.create      # Create tag
tags.delete      # Delete tag

media.upload     # Upload file to S3
media.list       # List media files
media.delete     # Delete media

sites.list       # Get user's sites
sites.create     # Create new site
sites.update     # Update site settings

auth.*           # Better Auth routes
```

## Code Style

### TypeScript
- Use `interface` over `type` for object shapes
- Avoid `any` - use `unknown` if needed
- Named imports only

### React / TanStack
- Server components/loaders first
- Client components only when needed
- Use TanStack Query for data fetching
- Prefer loaders over useEffect

### Database
- Use Drizzle for all queries
- Always use transactions for multi-step operations
- Reference `packages/db/schema.ts` for models

### API
- All routes go through oRPC
- Validate input with Zod
- Return consistent error shapes

### Forms
- Use TanStack Form or native form actions
- Validate client-side and server-side
- Show inline errors

## Environment Variables

```bash
# Database
DATABASE_URL=postgres://...

# Auth
BETTER_AUTH_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Storage
S3_BUCKET=...
S3_REGION=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Payments
POLAR_ACCESS_TOKEN=...

# Email
RESEND_API_KEY=...
```

## Before Committing

1. Run `bun typecheck` - fix any errors
2. Run `bun lint` - fix any issues
3. Run `bun format` - format code

## Commit Format

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
chore: Maintenance
refactor: Code restructure
```
