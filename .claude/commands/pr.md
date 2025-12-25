# Create Pull Request

Help the user create a pull request following project conventions.

## Pre-flight Checks

1. **Run all checks**:
   ```bash
   bun check
   ```

2. **Ensure branch is up to date with develop**:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

3. **Push branch to remote**:
   ```bash
   git push -u origin <branch-name>
   ```

## PR Guidelines

- **Target branch**: `develop` (NOT `main`)
- **Title**: Use conventional commit format: `feat: Add post editor`
- **Body**: Use the PR template format below

## PR Template

```markdown
## Summary
<!-- 1-3 bullet points describing what this PR does -->

## Changes
-

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactor

## Testing
<!-- How did you test this? -->

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have run `bun check` and fixed any issues
- [ ] I have added tests if applicable
- [ ] I have updated documentation if needed
```

## Create the PR

Use the GitHub CLI:
```bash
gh pr create --base develop --title "<type>: <description>" --body "<body>"
```

Now help the user create their PR targeting `develop`.
