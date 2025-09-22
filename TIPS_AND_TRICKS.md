# Tips and Tricks

This document contains helpful tips and tricks for working with this monorepo template effectively.

## General Monorepo Tips

### Package Management

- Always use `pnpm` commands from the root directory
- Install shared dependencies at the root level
- Use `pnpm -F <app> add <package-name>` to run commands for specific packages/apps

Example:

```sh
# Install dependency for frontend app
pnpm -F frontend add redux

# Install dependency for backend app
pnpm -F backend add jsonwebtoken
```

### Workspace Navigation

- Use the `pnpm -F` command to run scripts in specific packages
- Navigate between workspaces efficiently using the workspace commands

Example:

```sh
# Run dev server for frontend
pnpm -F frontend dev

# Run dev server for backend
pnpm -F backend dev

# Run tests for a specific app
pnpm -F frontend test
```

### Development Workflow

- Always run `pnpm install` after pulling new changes
- Check the turborepo cache status to optimize build times

## Frontend-specific Tips

### Component Development

- Place shared components in `apps/frontend/src/modules/common/components`
- Keep page-specific components within their respective module folders
- Use the established folder structure to maintain consistency

### State Management

- Utilize custom hooks in the `hooks` directory of each module
- Keep API calls and business logic in hooks
- Follow the established patterns in `use-sample.js` and `use-ping.js`

### Routing

- Add new routes in a modular fashion
- Follow the existing pattern of using layout components when needed
- Use lazy loading for route components to optimize bundle size

## Backend-specific Tips

### API Development

- Follow the modular structure in `apps/backend/src/modules`
- Keep routes, controllers, and models organized by feature
- Use the established patterns in the samples module as reference
- Import modules using alias `#modules/<module-name>/path/to/file.js`

### Error Handling

- Utilize the common error handling middleware
- Follow the established error response format
- Use the logging utility from `#utils/log.js`

### Database Operations

- Keep database operations within model files
- Follow the patterns established in `models/sample.js`
- Use proper error handling for database operations

## Code Quality Tips

### 1. ESLint and Formatting

- Run `pnpm lint` before committing changes
- Fix lint errors using `pnpm fix`
  - This will fix the formatting as well
- Follow the code style defined in eslint configs

### 2. Testing

- Write tests for new features
- Run tests before creating pull requests (as much as possible)
- Use the testing utilities provided in the template
  - Add `.test` right before the filename extension (e.g. `add-sample.test.js`)
  - Add inside `tests/` folder or right beside the component

### 3. Git Workflow

- Follow the branching strategy defined in `BRANCHING_STRATEGY.md`
- Keep commits focused and well-described
- Reference issue numbers in commit messages when applicable

## Performance Tips

### 1. Build Optimization

- Leverage turborepo's caching for faster builds
- Use code splitting in the frontend
- Optimize asset sizes using appropriate tools

### 2. Development Environment

- Use the provided VS Code settings for consistent development
- Enable ESLint and Prettier integrations in your editor
- Use the recommended VS Code extensions

## Troubleshooting Common Issues

### 1. Dependencies

```bash
# Clear dependencies and reinstall
rm -rf node_modules
pnpm install

# Clear turborepo cache
pnpm dlx turbo clean
```

### 2. Port Conflicts

- Frontend default port: **5173**
- Backend default port: **3000**
- Modify in respective configuration files if needed

### 3. Build Issues

```bash
# Clean all builds
pnpm clean

# Rebuild everything
pnpm build
```

## Additional Resources

- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turborepo.org/docs)
- [Vite Documentation](https://vitejs.dev/)
