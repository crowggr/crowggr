# Create Feature Branch

Help the user create a new feature branch following project conventions.

## Steps

1. **Ensure you're on develop and it's up to date**:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create the new branch** with proper naming:
   ```bash
   git checkout -b <type>/<description>
   ```

## Branch Naming Conventions

| Prefix | Use for |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring |
| `chore/` | Maintenance tasks |
| `test/` | Test additions/changes |

## Examples

- `feat/post-editor`
- `fix/auth-redirect`
- `docs/api-reference`
- `refactor/simplify-orpc-routes`

Ask the user what they're working on and help them create an appropriately named branch.
