# Generate Blog Post

Create a blog post about a feature or bug fix for your personal site.

## Instructions

1. **Understand the work** — Review the recent changes via `git diff` and `git log`, or use context from the current conversation about what was built/fixed
2. **Create folder structure** — Create a folder in `blog-posts/` named after the commit/feature (kebab-case, e.g., `add-post-editor`)
3. **Write the blog post** — Create a `.md` file inside that folder with a readable blog post title as the filename (e.g., `building-the-post-editor.md`)

## Blog Post Format

```markdown
---
title: "Human-Readable Title Here"
excerpt: "A one or two sentence hook that summarizes what this post is about and why it matters."
---

# Title

[Introduction paragraph — what I built or fixed, and why it matters]

## The Problem / The Goal

[Explain the bug that existed or the feature that was needed. Be specific.]

## The Solution

[Walk through how I approached it. Include code examples where helpful.]

\`\`\`tsx
// Example code with syntax highlighting
const example = "show relevant snippets";
\`\`\`

[Explain what the code does and why I made these choices.]

## Key Takeaways

[What I learned, what was tricky, or what others might find useful]

---

[Optional: closing thought or link to the PR]
```

## Writing Style

- **First person singular** — Write as "I" not "we" (this is your personal blog)
- **Conversational but technical** — Explain things clearly, don't be overly formal
- **Show real code** — Include actual code snippets from the changes
- **Explain the why** — Not just what changed, but why it was the right approach
- **Be specific** — Mention file names, function names, specific behaviors

## Output Structure

```
blog-posts/
└── add-post-editor/
    └── building-the-post-editor.md
```

## Input

$ARGUMENTS - Optional: Topic hint, or specify which commit/feature to write about. If not provided, will use the most recent work in context.
