# Commit Changes

Help the user commit their changes following the project conventions.

## Steps

1. **Run pre-commit checks**:
   ```bash
   bun check
   ```
   Fix any linting or formatting issues before proceeding.

2. **Check git status** to see what files have changed:
   ```bash
   git status
   git diff
   ```

3. **Stage the appropriate files**:
   ```bash
   git add <files>
   ```

4. **Create a commit** using conventional commit format:
   ```
   <type>: <description>

   [optional body]
   ```

   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation only
   - `refactor`: Code change that neither fixes a bug nor adds a feature
   - `chore`: Maintenance tasks
   - `test`: Adding or updating tests

5. **If creating a new feature branch**, create it from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/your-feature-name
   ```

   Branch naming:
   - `feat/description` - New features
   - `fix/description` - Bug fixes
   - `docs/description` - Documentation
   - `refactor/description` - Refactoring

Now analyze the user's changes and help them commit properly.
