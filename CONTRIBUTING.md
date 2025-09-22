# Contribute

We welcome contributions to this project! Please follow the guidelines below to contribute effectively.

## Create a Branch

Create a new branch to work on your changes. It is a good practice to name the branch according to the feature or bug fix you're working on

```sh
git checkout -b feat/short-description
```

> NOTE: To avoid conflict, use only lower-case characters

## Make Changes

1. Make your changes locally on the new branch
2. Follow the coding conventions of the repository
3. Test your changes to ensure they work correctly.

## Commit Your Changes

1. After making changes, stage the files you want to commit:

```sh
git add .
```

2. Commit your changes with a descriptive message:

```sh
git commit -m "feat: added new feature"
```

3. It's important to keep commits focused on a single change to make reviewing easier.

## Push Your Changes

Push your changes to the remote repository

```sh
git push -u origin feature/short-description
```

Or dynamically

```sh
git push -u origin $(git branch --show-current)
```

## Create a Pull Request

- Once your changes are pushed, go to the original repository on Github.
- You will see an option to **Create a Pull Request**. Click on it.
- In the pull request description, explain the purpose of the changes you made and any relevant information.
- Assign the pull request to the appropriate reviewer(s), your team members.

## Code Review

- Review the pull requests created by others. Give constructive feedback and ask questions if necessary.
- When reviewing, check for:
  - Code quality and readability
  - Correctness of the implementation
  - Following project conventions and guidelines
  - Tests for any new features or bug fixes

- Approve the pull request if everything looks good or request changes if necessary.

## Merge

- Once the pull request is approved, it can be **merged** into the main branch.
- If you have the necessary permissions, you can merge the pull request yourself.
- After merging, you can pick up another task.
