# Coding Convention

This document outlines the coding conventions for structuring our application. The goal is to maintain consistency, scalability, and easy of collaboration among team members. By adhering to theses conventions, we ensure that the codebase remains modular, maintainable, and easy to navigate as the project grows.

## Folder & Files Structure

To ensure clarity and organization, the following folder structure should be used:

```
project/
│
├── apps/                             # All Source code
│   ├── backend/                      # All Backend (Express)
│   │   ├── src/                      # All source codes
│   │   │   ├── modules/              # All modules
│   │   │   │   ├── common/           # All common modules
│   │   │   │   │   ├── middleware/   # All common middleware
│   │   │   │   ├── samples/          # Sample feature
│   │   │   │   │   ├── controllers/  # All controllers (Sample)
│   │   │   │   │   ├── models/       # All models (Sample)
│   │   │   │   │   ├── tests/        # All tests (Sample)
│   │   │   │   │   ├── routes.js     # All routes (Sample)
│   │   │   ├── utils/                # All utility functions
│   │   │   ├── app.js                # Express App
│   │   │   ├── db.js                 # Database function
│   │   ├── tests/                    # All test setup files
│   │
│   ├── frontend/                    # All Frontend (React)
│   │   ├── public/                  # Publicly available files
│   │   ├── src/                     # All source codes
│   │   │   ├── modules/             # All modules
│   │   │   │   ├── common/          # Commonly use module
│   │   │   │   ├── home/            # Home feature
│   │   │   │   ├── sample/           # Sample feature
│
├── package.json                  # Project metadata
```

## General Convention

- All file names should be in lowercase. This avoids issues with case sensitivity on different operating systems.
  - Example: `my-component.jsx`, `get-all-something.js`
- Use hyphens (`-`) to separate words.
- Avoid spaces, underscores (`_`) and camelCase.
- Be descriptive but concise.
- File and folder names should clearly describe what's inside.

## Component Naming

- Use **PascalCase** for component names.
- Match the **filename** to the main component (but in lowercase-dash-case).
- Use **named export**, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#description
- Use **function declaration**, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function
  - You can use arrow function inside the component but not the component itself

❌ PascalCase Filename

```jsx
// UserProfile.jsx
export function UserProfile() {
  ...
}
```

> Correct component but incorrect file name

❌ Dash-case filename but lowercase for component

```jsx
// user-profile.jsx
export function userprofile() {
  ...
}
```

> Correct filename but incorrect component name

❌ Using default export

```jsx
// user-profile.jsx
export default function UserProfile() {
  ...
}
```

> Avoid using default export

❌ Not using function declaration

```jsx
// my-component.jsx
export const MyComponent = () => {
  ...
}
```

> Avoid using arrow function

✅ PascalCase name, lowercase, and dash-case for file and named export

```jsx
// user-profile.jsx
export function UserProfile() {
  ...
}
```

✅ Use function declaration

```jsx
export function MyComponent() {
  ...
  // you can use arrow inside
  const myFunc = () => {}
}
```

## Importing

- Use **absolute paths**

❌ Avoid using relative path as much as possible

```js
import { useHook } from '../../hooks';
import { MyMainComponent } from '../../dashboard/components';
```

✅ Use absolute path

```js
import { useHook } from '@/app/hooks';
import { MyMainComponent } from '@/app/components';
```

⚠️ One level of relative path is acceptable

```js
import { NestedComponent } from './components';
```

## Export Convention

- Use **named exports** for mostly everything
  - Except router and express app for the `backend`

❌ Using export default

```jsx
export default Button;
```

✅ Using named export

```jsx
export function Button() { ... }
```

✅ Using default on Express Router

```js
const router = new Router();
router.get(...);

export default router;
```

## Import the named from `react`

- Always import **only what you need**

❌ Avoid importing `React`

```jsx
import React from 'react';
// or
import * as React from 'react';
...
React.useState();
```

✅ Import the specific hook/types/etc

```jsx
import { useState } from 'react';
```

## Commeting and Documentation

- **Avoid obvious comments** (the code should explain itself).
- Use comments only when explaining **why**, not what.
- Use `@todo:` and `@fixme:` with your name and date if leaving technical debt
  - Add `// eslint-disable-next-line` on top so sonar will not make it a big deal

```js
// eslint-disable-next-line
// @todo: (jag) refactor this once we have the new API (2025-09-22)
```

## Variables and Functions

- Be **descriptive**, not clever.
- Avoid abbreviations unless they're extremely common (`id`, `API`, `URL`).

❌ Hard to understand variable name

```js
const ta = calc(items);
```

✅ Descriptive variable name

```js
const totalAmount = calculateTotal(items);
```

## Boolean Naming

- Start boolean variable names with `is`, `has`, `can` or `should`.

❌ Bad

```js
const loading = true;
const permission = false;
```

✅ Good

```js
const isLoading = true;
const hasPermission = false;
```

## Constants and Enum

- Extract magic strings/numbers to constants.
- Use enums object for fixed sets of values

❌ Bad

```js
await fetch('/api/users');
const role = 'user';
```

✅ Good

```js
const USER_URL = '/api/users';
// Use Enum Object
const ROLE_TYPE = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

await fetch(USER_URL);
const role = ROLE_TYPE.USER;
```

## Modularity

- Keep different concerns (e.g., routing, business logic, validation) in separate modules or folders for better maintainability.

## Middleware Files

- Use descriptive names based on the functionality.
- Always use named exports for middleware functions

## Validation Middleware

- Use middleware for validating request bodies, query parameters, or headers.
- You can add libraries to help you.

Example:

```js
export function sample(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  next();
}
```

## Error handling

- Always handle errors in controllers and middleware if necessary.
- Provide meaningful error messages in the response to help diagnose issues.
- Use a proper status for each response.
