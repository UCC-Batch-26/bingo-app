# Branching Instructions

This document provides a comprehensive guide on how to effectively manage branches within our project, ensure smooth collaboration and workflow.

Our project uses a specific branching strategy to streamline development and ensure that our main codebase remains stable. Understanding and following this strategy is crucial for all contributors to facilitate smooth collaboration and integration processes.

## Fetching the Latest Changes

Before starting your working, ensure you have the latest updates from the remote repository:

```sh
git fetch
```

> This command updates your local view of the remote branches without merging any changes into your local branches

## Main Branch

- **main** - This is the primary branch of the repository representing the source of truth for production-ready code. All development code is eventually merged into this branch after thorough testing and review.

## Supporting Branches

To support our development workflow, we use the following types of branches:

- **Feature Branches (`feat/*`)**
  - Created from `main`.
  - Used for small, focused features or tasks.
  - Deleted after being merged into `main`.
  - Example: `feat/add-login`.
- **Hotfix Branches (`fix/*`)**
  - Created from `main` when fixing critical production bugs.
  - Merged back into `main` after verification.
- All branches MUST be in **lowercase** to avoid conflict.

## Starting a New Task

1. Make sure you're on the latest `main` branch.

```sh
git checkout main
git pull
```

2. Create a new feature branch.

```sh
git checkout -b feat/your-task-name
```

3. Make small, meaningful commits regularly.

## Opening a Pull Request

1. Push your feature branch

```sh
git push -u origin $(git branch --show-current)
```

2. Open a pull request (PR) targeting to `main`
3. Requirements before merging:

- Code reviewed by a teammate
- All CI checks must pass

## Tips for Success

- **Keep it short** - Don't keep your branch going for too long. It's easier to work with smaller changes that big ones all at once.
- **Stay up to date** - Sometimes, other people's code will get added to `develop` while you're working. Make sure to update your branch with these changes so your code fits in smoothly.
- **Name clearly** - Use names for your branches that makes it easy for everyone to know what you're working on.

## Working on Your Branch

**Always** start by creating a new branch for your work, branching off from the appropriate base branch (_usually `develop` for new features and bug fixes_)

```sh
git checkout -b your-branch-name develop
```

> Replace `your-branch-name` with a descriptive name for your branch

## Merging vs Rebasing

![merge-vs-rebase](https://wac-cdn.atlassian.com/dam/jcr:1896adb1-5d49-419a-9b50-3a36adac186c/09.svg?cdnVersion=1427)

> https://www.atlassian.com/git/tutorials/merging-vs-rebasing

### Merging

To incorporate the latest changes from `develop` into your branch, you can use the merge approach:

```sh
git checkout your-branch-name
git merge origin/develop
```

### Rebasing

Alternatively, you might prefer to rebase your branch onto `develop` to maintain a cleaner project history:

```sh
git checkout your-branch-name
git rebase origin/develop
```

## Resolving Conflicts

Whether merging or rebasing, you might encounter conflicts. Resolve these by edting the conflicted files, then mark them as resolved:

```sh
git add .
# If rebasing
git rebase --continue
# If merging, commit the resolved changes
git commit
```

### Step 1: Identify the Conflicts

First, you need to know which files are in conflict. Git will tell you this during a merge or rebase operation. If you've already started a merge (_or a pull which involves a merge_) and encountered conflicts, Git will pause the operation, allowing you to fix those conflicts before completing the merge.

### Step 2: Edit the Conflicted Files

Open the conflicted files in your Code Editor. Git marks the conflicts in the file so you can easily find them. You'll see sections like this:

```diff
<<<<<<< HEAD
+This is the original text in your branch
=======
-This is the conflicting text from the branch you're merging in
>>>>>>> branch-name
```

- The `<<<<<<< HEAD` line marks the beginning of the conflicting area, showing the version of the current branch (e.g., `HEAD`).
- The `=======` line divides your changes from the changes in the other branch.
- The `>>>>>>> branch-name` line indicates the end of the conflicting area and shows where the changes from the other branch begin.

### Step 3: Resolve the Conflict

To resolve the conflict, you need to decide which changes to keep. You might choose one side, combine both changes, or write something new entirely. Edit the file to reflect the final decision, removing the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) in the process.

### Step 4: Mark the Conflict as Resolved

After you've edited the files to resolve the conflicts, you need to add these files to the staging area to indicate that the conflicts have been resolved:

```sh
git add filename
```

If you're in the middle of a rebase and not a merge, use the following command to continue the rebase after resolving the conflicts:

```sh
git rebase --continue
```

If you were merging (_or pulling_), you don't need a specific command to continue after adding the conflicted files -- Git knows to continue the merge once the conflicts are resolved.

### Step 5: Complete the Operation

- When Merging: Once all conflicts are resolved and the changes are staged, you can complete the merge by committing:

```sh
git commit
```

Git will usually prepopulate the commit message with information about the merge.

- When rebasing: After resolving all conflicts and using `git rebase --continue` for each one, the rebase operation will continue until it has applied all the changes.

### Additional Tips

- Use GUI tool including the ones built into IDEs like VS Code.
- Keep your branch updated with the base branch regularly to minimize conflicts.
- Coordinate with your team to manage changes to the same parts of the codebase, reducing the likelihood of conflicts.

## Pushing Changes

After resolving any conflicts and completing your work, push your branch to the remote repository:

```sh
git push -u origin your-branch-name
```

or dynamically

```sh
git push -u origin $(git branch --show-current)
```

## Tips for Successful Branching

- **Stay Current**: Regularly update your branch with changes from `develop` to minimize conflicts.
- **Communicate**: Coordinate with your team, especially when working on areas of the codebase that others are also modifying.
- **Name Clearly**: Use descriptive names for your branches to convey their purpose at a glance.
