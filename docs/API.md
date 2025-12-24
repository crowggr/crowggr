# API Reference

## Overview

better-blog provides a REST-like API via oRPC. All endpoints are type-safe and return JSON.

**Base URL:** `https://api.better.blog` (cloud) or `http://localhost:3000/api` (self-hosted)

## Authentication

### SDK (Public API)

Use an API key in the Authorization header:

```
Authorization: Bearer bb_live_xxxxxxxxxxxxx
```

### Dashboard (Private API)

Uses Better Auth sessions (cookies). Not accessible externally.

## Endpoints

### Posts

#### List Posts

```
GET /api/posts.list
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| limit | number | Max posts to return (default: 10, max: 100) |
| offset | number | Pagination offset |
| status | string | Filter by status: `published`, `draft`, `archived` |
| tag | string | Filter by tag slug |
| author | string | Filter by author ID |

**Response:**

```json
{
  "posts": [
    {
      "id": "abc123",
      "title": "My First Post",
      "slug": "my-first-post",
      "excerpt": "This is my first post...",
      "coverImage": "https://...",
      "status": "published",
      "publishedAt": "2024-01-15T10:00:00Z",
      "author": {
        "id": "user123",
        "name": "John Doe",
        "avatar": "https://..."
      },
      "tags": [
        { "id": "tag1", "name": "Tutorial", "slug": "tutorial" }
      ],
      "createdAt": "2024-01-14T09:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 25,
  "hasMore": true
}
```

#### Get Post

```
GET /api/posts.get
```

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| slug | string | Post slug (required) |

**Response:**

```json
{
  "id": "abc123",
  "title": "My First Post",
  "slug": "my-first-post",
  "content": "# Hello World\n\nThis is my post content in MDX...",
  "excerpt": "This is my first post...",
  "coverImage": "https://...",
  "status": "published",
  "publishedAt": "2024-01-15T10:00:00Z",
  "author": {
    "id": "user123",
    "name": "John Doe",
    "avatar": "https://..."
  },
  "tags": [
    { "id": "tag1", "name": "Tutorial", "slug": "tutorial" }
  ],
  "createdAt": "2024-01-14T09:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Tags

#### List Tags

```
GET /api/tags.list
```

**Response:**

```json
{
  "tags": [
    {
      "id": "tag1",
      "name": "Tutorial",
      "slug": "tutorial",
      "postCount": 5
    },
    {
      "id": "tag2",
      "name": "News",
      "slug": "news",
      "postCount": 12
    }
  ]
}
```

### Authors

#### List Authors

```
GET /api/authors.list
```

**Response:**

```json
{
  "authors": [
    {
      "id": "user123",
      "name": "John Doe",
      "avatar": "https://...",
      "bio": "Software developer and writer",
      "postCount": 10
    }
  ]
}
```

### Site Info

#### Get Site

```
GET /api/site.get
```

**Response:**

```json
{
  "id": "site123",
  "name": "My Blog",
  "slug": "my-blog",
  "description": "A blog about technology",
  "domain": "blog.example.com"
}
```

## SDK Usage

### @better-blog/client

```typescript
import { createClient } from '@better-blog/client';

const blog = createClient({
  siteId: 'your-site-id',
  apiKey: 'bb_live_xxxxxxxxxxxxx',
  // Optional: custom API URL for self-hosted
  baseUrl: 'https://your-domain.com/api',
});

// List posts
const { posts, total, hasMore } = await blog.posts.list({
  limit: 10,
  status: 'published',
});

// Get single post
const post = await blog.posts.get('my-post-slug');

// List tags
const { tags } = await blog.tags.list();

// List authors
const { authors } = await blog.authors.list();

// Get site info
const site = await blog.site.get();
```

### @better-blog/react

```typescript
import { BlogProvider, usePosts, usePost, useTags } from '@better-blog/react';

// Wrap your app
function App() {
  return (
    <BlogProvider siteId="xxx" apiKey="xxx">
      <Blog />
    </BlogProvider>
  );
}

// Use hooks
function Blog() {
  const { data: posts, isLoading } = usePosts({ limit: 10 });
  const { data: tags } = useTags();

  // ...
}

function Post({ slug }) {
  const { data: post, isLoading, error } = usePost(slug);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <article>{post.content}</article>;
}
```

## Error Responses

All errors return a consistent shape:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Post not found"
  }
}
```

**Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `FORBIDDEN` | 403 | API key doesn't have access |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limits

| Plan | Requests/minute |
|------|-----------------|
| Free | 60 |
| Pro | 600 |
| Enterprise | Unlimited |

Rate limit headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 55
X-RateLimit-Reset: 1704067200
```
