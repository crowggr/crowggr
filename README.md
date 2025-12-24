# better-blog

Open source headless blog CMS for modern web developers.

## What is better-blog?

better-blog is a headless blog platform designed for TanStack Start and Next.js developers. Write your content in a beautiful dashboard, fetch it via API or SDK in your app.

**Open source.** Self-host it or use our cloud version at [better.blog](https://better.blog).

## Features

- **Headless API** - Fetch your posts from any frontend
- **MDX Support** - Write with Markdown + React components
- **Image Uploads** - Drag & drop media library with CDN
- **Multi-site** - Manage multiple blogs from one dashboard
- **Team Support** - Invite authors and collaborators
- **SEO Ready** - Meta tags, OG images, slugs
- **Self-hostable** - Docker Compose one-liner deploy

## Tech Stack

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- [Drizzle](https://orm.drizzle.team) - TypeScript ORM
- [Postgres](https://postgresql.org) - Database
- [Better Auth](https://better-auth.com) - Authentication
- [Coss UI](https://coss-ui.com) - UI components
- [oRPC](https://orpc.unnoq.com) - Type-safe API
- [Polar](https://polar.sh) - Subscriptions & payments

## Quick Start

### Cloud (Recommended)

Sign up at [better.blog](https://better.blog) and start writing in minutes.

### Self-Hosted

```bash
curl -fsSL https://better.blog/install.sh | sh
```

Or with Docker Compose:

```bash
git clone https://github.com/better-blog/better-blog
cd better-blog
cp .env.example .env
docker compose up -d
```

## SDK

Install the SDK in your project:

```bash
bun add @better-blog/client
# or
bun add @better-blog/react
```

### Vanilla Client

```typescript
import { createClient } from '@better-blog/client';

const blog = createClient({
  siteId: 'your-site-id',
  apiKey: 'your-api-key',
});

// Get all posts
const posts = await blog.posts.list();

// Get single post
const post = await blog.posts.get('my-post-slug');
```

### React Hooks

```typescript
import { usePosts, usePost } from '@better-blog/react';

function Blog() {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

function Post({ slug }) {
  const { data: post } = usePost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

### TanStack Start

```typescript
import { blogLoader } from '@better-blog/tanstack';

export const Route = createFileRoute('/blog/$slug')({
  loader: blogLoader(({ params }) => ({
    post: blog.posts.get(params.slug),
  })),
  component: Post,
});
```

## Project Structure

```
better-blog/
├── apps/
│   ├── dashboard/     # Admin UI
│   ├── docs/          # Documentation
│   └── website/       # Landing page
├── packages/
│   ├── api/           # oRPC API
│   ├── db/            # Drizzle schema
│   ├── client/        # @better-blog/client
│   ├── react/         # @better-blog/react
│   ├── tanstack/      # @better-blog/tanstack
│   └── ui/            # Shared components
└── docker-compose.yml
```

## Development

```bash
# Install dependencies
bun install

# Start development
bun dev

# Run database migrations
bun db:migrate

# Build all packages
bun build
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.
