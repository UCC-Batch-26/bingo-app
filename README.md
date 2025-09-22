# Team Project

Welcome to our Team Project! This guide is designed to help you get started with setting up the project on your local machine. If you encounter any issues along the way, remember that it's all part of the learning process. Let's get started.

## ✅ Prerequisites

Before you begin, make sure you have the following installed on your system:

- [pnpm](https://pnpm.io)

## 🛠️ Installation

Install dependencies by running this on the root directory. Meaning, no need to go into the folders, just run:

```sh
pnpm install
```

## 🌏 Environment

To configure environment varialbes for your project, follow these steps:

### 1️⃣ Run this command

```sh
pnpm environment
```

This will create a copy of `.env.example` to `.env` to its respective apps.

### 2️⃣ Update the `.env` file

Open the `.env` file and update the values based on the your project's preferences

## 👟 Run the App

With the dependencies installed, you're now ready to run the application.

```sh
pnpm dev
```

## 🏋️‍♀️ Code Consistency

To ensure our code is consistent and well-formatted.

### Linting

Linting helps identify and fix errors or warnings in the code. To run the linting process and automatically apply fixes, run:

```sh
pnpm lint
```

### Auto-magically Fix

To automatically format your code and apply fixable linting rules, run:

```sh
pnpm fix
```

## 🚀 Congrats

You've set up the project on your local machine. You're now ready to start exploring and contributing to the project. If you have any questions or run into issues, do not hesitate to ask for help from your team or search online for solutions. Happy coding!
