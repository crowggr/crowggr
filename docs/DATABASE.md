# Database Schema

## Overview

better-blog uses PostgreSQL with Drizzle ORM. The schema supports multi-tenancy with Organizations, Sites, and role-based access control.

## Entity Relationship Diagram

```
┌──────────────────┐     ┌──────────────────┐
│   organizations  │────<│      users       │
└──────────────────┘     └──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│      sites       │
└──────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌────────┐
│ posts  │  │ media  │
└────────┘  └────────┘
    │
    │ N:M
    ▼
┌────────┐
│  tags  │
└────────┘
```

## Tables

### organizations

Workspaces that contain users and sites.

```typescript
export const organizations = pgTable('organizations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  plan: text('plan').default('free'), // free, pro, enterprise
  polarCustomerId: text('polar_customer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### users

User accounts managed by Better Auth.

```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### members

Organization membership with roles.

```typescript
export const members = pgTable('members', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('author'), // owner, admin, editor, author
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### sites

Individual blogs within an organization.

```typescript
export const sites = pgTable('sites', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  domain: text('domain'), // Custom domain
  description: text('description'),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### posts

Blog posts with MDX content.

```typescript
export const posts = pgTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  content: text('content'), // MDX content
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  status: text('status').default('draft'), // draft, published, archived
  publishedAt: timestamp('published_at'),
  authorId: text('author_id').notNull().references(() => users.id),
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### tags

Post categorization.

```typescript
export const tags = pgTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### post_tags

Many-to-many relation between posts and tags.

```typescript
export const postTags = pgTable('post_tags', {
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}));
```

### media

Uploaded files (images, etc).

```typescript
export const media = pgTable('media', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  size: integer('size').notNull(), // bytes
  mimeType: text('mime_type').notNull(),
  width: integer('width'),
  height: integer('height'),
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  uploadedBy: text('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### api_keys

API keys for SDK access.

```typescript
export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  key: text('key').notNull().unique(), // hashed
  keyPrefix: text('key_prefix').notNull(), // First 8 chars for display
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  createdBy: text('created_by').references(() => users.id),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

## Indexes

```typescript
// Fast lookups
CREATE INDEX idx_posts_site_status ON posts(site_id, status);
CREATE INDEX idx_posts_site_published ON posts(site_id, published_at DESC);
CREATE INDEX idx_posts_slug ON posts(site_id, slug);
CREATE INDEX idx_tags_site ON tags(site_id);
CREATE INDEX idx_media_site ON media(site_id);
CREATE INDEX idx_members_user ON members(user_id);
CREATE INDEX idx_members_org ON members(organization_id);
```

## Migrations

```bash
# Generate migration from schema changes
bun db:generate

# Run pending migrations
bun db:migrate

# Open Drizzle Studio
bun db:studio
```
