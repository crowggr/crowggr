# MVP Checklist

## Phase 1: Project Setup

- [ ] Initialize monorepo with Bun + Turborepo
- [ ] Set up `apps/dashboard` with TanStack Start
- [ ] Set up `packages/db` with Drizzle
- [ ] Set up `packages/api` with oRPC
- [ ] Set up `packages/ui` with Coss UI
- [ ] Configure Docker Compose for local dev
- [ ] Create `.env.example`

## Phase 2: Database

- [ ] Define schema in `packages/db/schema.ts`
  - [ ] organizations
  - [ ] users (Better Auth)
  - [ ] members
  - [ ] sites
  - [ ] posts
  - [ ] tags
  - [ ] post_tags
  - [ ] media
  - [ ] api_keys
- [ ] Generate initial migration
- [ ] Set up Drizzle Studio

## Phase 3: Authentication

- [ ] Integrate Better Auth
- [ ] Email/password auth
- [ ] GitHub OAuth
- [ ] Google OAuth
- [ ] Organization plugin
- [ ] Invite flow
- [ ] Password reset

## Phase 4: Dashboard UI

### Layout
- [ ] Sidebar navigation
- [ ] Header with user menu
- [ ] Organization switcher
- [ ] Site switcher

### Auth Pages
- [ ] Login page
- [ ] Register page
- [ ] Forgot password page
- [ ] Accept invite page

### Posts
- [ ] Posts list view
- [ ] Post editor (MDX)
- [ ] Post preview
- [ ] Post settings (slug, excerpt, cover image)
- [ ] Publish/unpublish
- [ ] Delete post

### Media
- [ ] Media library grid
- [ ] Upload dropzone
- [ ] Image preview
- [ ] Delete media
- [ ] Copy URL

### Tags
- [ ] Tags list
- [ ] Create tag
- [ ] Edit tag
- [ ] Delete tag

### Authors/Team
- [ ] Team members list
- [ ] Invite member
- [ ] Change role
- [ ] Remove member

### Settings
- [ ] Site settings (name, description)
- [ ] API keys management
- [ ] Generate API key
- [ ] Delete API key

## Phase 5: Public API

- [ ] Set up oRPC routes
- [ ] API key validation middleware
- [ ] Rate limiting
- [ ] `posts.list`
- [ ] `posts.get`
- [ ] `tags.list`
- [ ] `authors.list`
- [ ] `site.get`

## Phase 6: SDK

### @better-blog/client
- [ ] `createClient()` factory
- [ ] `posts.list()`
- [ ] `posts.get()`
- [ ] `tags.list()`
- [ ] `authors.list()`
- [ ] `site.get()`
- [ ] Error handling
- [ ] TypeScript types

### @better-blog/react
- [ ] `BlogProvider`
- [ ] `usePosts()`
- [ ] `usePost()`
- [ ] `useTags()`
- [ ] `useAuthors()`
- [ ] `useSite()`

### @better-blog/tanstack
- [ ] `blogLoader()` helper
- [ ] Route integration example

## Phase 7: Website & Docs

### Landing Page
- [ ] Hero section
- [ ] Features section
- [ ] Pricing section
- [ ] Footer

### Documentation
- [ ] Getting started guide
- [ ] SDK reference
- [ ] API reference
- [ ] Self-hosting guide
- [ ] Examples

## Phase 8: Monetization

- [ ] Polar integration
- [ ] Subscription plans
- [ ] Usage limits
- [ ] Upgrade prompts

## Phase 9: Polish

- [ ] Error boundaries
- [ ] Loading states
- [ ] Empty states
- [ ] Responsive design
- [ ] Keyboard shortcuts
- [ ] Accessibility audit

## Phase 10: Launch

- [ ] GitHub repo public
- [ ] Docker images published
- [ ] better.blog live
- [ ] docs.better.blog live
- [ ] Product Hunt launch
- [ ] Twitter/X announcement
