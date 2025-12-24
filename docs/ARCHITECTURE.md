# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Website                          │
│  (TanStack Start / Next.js / any frontend)                     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  │ @better-blog/client
                                  │ @better-blog/react
                                  │
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

┌─────────────────────────────────────────────────────────────────┐
│                     better-blog Dashboard                       │
│                      (TanStack Start)                          │
├─────────────────────────────────────────────────────────────────┤
│  Write Posts  │  Manage Media  │  Team Settings  │  API Keys   │
└─────────────────────────────────────────────────────────────────┘
```

## Core Concepts

### Multi-Tenancy

```
Organization (workspace)
├── Users (team members)
├── Sites (blogs)
│   ├── Posts
│   ├── Tags
│   └── Media
└── API Keys
```

- **Organization**: A workspace that can have multiple users and sites
- **Site**: An individual blog with its own posts, tags, and media
- **User**: A team member with a role (owner, admin, editor, author)

### Authentication Flow

```
1. User signs up/logs in via Better Auth
2. User creates or joins an Organization
3. User creates Sites within the Organization
4. User generates API keys for their Sites
5. API keys are used in the SDK to fetch content
```

### Content Flow

```
1. Author writes post in Dashboard (MDX editor)
2. Post saved to Postgres (draft status)
3. Author publishes post
4. SDK fetches published posts via API
5. User's website renders the content
```

## Package Architecture

### @better-blog/client

Vanilla TypeScript client for any environment:

```typescript
const blog = createClient({ siteId, apiKey });

// Returns typed responses
const posts: Post[] = await blog.posts.list();
const post: Post = await blog.posts.get('slug');
```

### @better-blog/react

React hooks built on TanStack Query:

```typescript
// Wraps @better-blog/client with React Query
const { data, isLoading, error } = usePosts();
const { data: post } = usePost('slug');
```

### @better-blog/tanstack

TanStack Start integration:

```typescript
// Provides loader helpers for TanStack Start routes
export const loader = blogLoader(({ params }) => ({
  post: blog.posts.get(params.slug),
}));
```

## Data Flow

### Public API (SDK)

```
SDK Request
    ↓
API Route (oRPC)
    ↓
Validate API Key
    ↓
Check Site Access
    ↓
Query Postgres (Drizzle)
    ↓
Return JSON Response
```

### Dashboard

```
User Action (e.g., save post)
    ↓
TanStack Start Server Function
    ↓
Validate Session (Better Auth)
    ↓
Check Permissions (org/site access)
    ↓
Execute Query (Drizzle)
    ↓
Return Response
```

## Security

### API Keys

- Scoped to a single Site
- Read-only by default (SDK only needs to fetch)
- Can be rotated without affecting others
- Rate limited per key

### Authentication

- Better Auth handles sessions
- Organization plugin for team features
- Role-based access (owner, admin, editor, author)

### Authorization

- Users can only access their Organizations
- Sites are scoped to Organizations
- Posts are scoped to Sites
- API keys are scoped to Sites

## Deployment

### Cloud (better.blog)

- Vercel / Railway for the app
- Neon / Supabase for Postgres
- Cloudflare R2 for media storage
- Polar for subscriptions

### Self-Hosted

Docker Compose with:
- Dashboard container
- Postgres container
- MinIO for S3-compatible storage

```yaml
services:
  dashboard:
    image: ghcr.io/better-blog/dashboard
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://...

  postgres:
    image: postgres:16
    volumes: ["./data:/var/lib/postgresql/data"]

  minio:
    image: minio/minio
    volumes: ["./media:/data"]
```
