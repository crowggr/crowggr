# Pricing

## Cloud Tiers (better.blog)

| Tier | Price | Sites | Users | Posts/mo | Storage |
|------|-------|-------|-------|----------|---------|
| **Free** | $0 | 1 | 1 | 5 | 500MB |
| **Pro** | $19/mo | 3 | 3 | 30/site | 5GB |
| **Team** | $49/mo | 10 | Unlimited | Unlimited | 25GB |

### Limits Explained

- **Sites**: Number of blogs/sites per organization
- **Users**: Team members who can access the dashboard
- **Posts/mo**: Posts published per month, per site
- **Storage**: Media uploads (images, files)

### What Triggers Upgrades

- "I want another site" → upgrade
- "I want to invite my editor" → upgrade
- "I hit my monthly post limit" → upgrade
- "Running out of media storage" → upgrade

## Self-Hosted

Self-hosted users can configure their own limits via environment variables.

### Default: Unlimited

```bash
# All limits default to unlimited if not set
LIMIT_SITES=
LIMIT_USERS=
LIMIT_POSTS_PER_MONTH=
LIMIT_STORAGE_MB=
```

### Custom Limits

```bash
# Example: Set your own limits
LIMIT_SITES=5
LIMIT_USERS=10
LIMIT_POSTS_PER_MONTH=100
LIMIT_STORAGE_MB=10000  # 10GB
```

### Use Cases

- **Personal use**: Leave defaults (unlimited)
- **Small team**: Set reasonable limits
- **Reselling to clients**: Configure tiers like the cloud version

## Implementation

The app checks limits in this order:

1. **Cloud**: Check organization's subscription tier in database
2. **Self-hosted**: Check environment variables (unlimited if not set)
