# easyshell - overview

**easyshell** is a platform for trying, learning and mastering shell commands. See it for yourself - [easyshell.xyz](https://easyshell.xyz).

## Quick Links

- Overview
  - [Architecture and Features](#architecture-and-features)
- Services
  - [Website](apps/website/README.md)
  - [Queue Processor](apps/queue-processor/README.md)
  - [Session Manager](apps/session-manager/README.md)
  - [Entrypoint](apps/entrypoint/README.md)
- [Development Guide](#development-guide)
  - [Pre-Requisites](#pre-requisites)
  - [Environment Variables](#environment-variables)
  - [Scripts](#scripts)

## Architecture and Features

There are a few microservices that work together to make the platform work.

![architecture.svg](./.github/assets/architecture.svg)

- ### Website

  Frontend for [easyshell.xyz](https://easyshell.xyz). See [Website](apps/website/README.md) for more information.

- ### Session Manager

  Manages the terminal sessions. See [Session Manager](apps/session-manager/README.md) for more information.

- ### Queue Processor

  Processes the submissions. See [Queue Processor](apps/queue-processor/README.md) for more information.

- ### Entrypoint

  Entrypoint for the all the docker containers. See [Entrypoint](apps/entrypoint/README.md) for more information.

---

# Development Guide

In this section,

- [Pre-Requisites](#pre-requisites)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

## Pre-Requisites

- Node (v22.14.0) and NPM (10.9.2) (can be installed using `nvm install 22`. see [nvm](https://github.com/nvm-sh/nvm))
- Go (1.23.6)
- Docker

## Environment Variables

The following environment variables might be required

- [`APP`](#app)
- [`PROJECT_ROOT`](#project_root)
- [`DOCKER_REGISTRY`](#docker_registry)
- [`DATABASE_URL`](#database_url)
- [`SESSION_MANAGER_URL`](#nextauth_url)
- [`NEXTAUTH_URL`](#nextauth_url)
- [`NEXTAUTH_SECRET`](#nextauth_secret)
- [`NEXTAUTH_URL`](#nextauth_url)
- [`DISCORD_CLIENT_ID`](#discord_client_id)
- [`DISCORD_CLIENT_SECRET`](#discord_client_secret)
- [`GITHUB_CLIENT_ID`](#github_client_id)
- [`GITHUB_CLIENT_SECRET`](#github_client_secret)
- [`GOOGLE_CLIENT_ID`](#google_client_id)
- [`GOOGLE_CLIENT_SECRET`](#google_client_secret)

### `APP`

This is a helper variable that is used to determine which environment variables to load and verify.
Possible values are - `queue-processor`, `website` and `script`.

This is **required**. However, if you execute scripts in the [package.json](package.json) using `npm run`, you might not need to set this.

### `PROJECT_ROOT`

In order to run some scripts, the code needs to determine the _project root_ (the root of the git repository). If executing the scripts in the git context, the project root is inferred using `git rev-parse --show-toplevel`. However, if the script is executed outside the git context, the `PROJECT_ROOT` environment variable needs to be set.

### `DOCKER_REGISTRY`

The docker registry to use for pushing images. This is required for pushing images to the registry. If unset, the images will not be pushed.

If you are using a registry, then make sure you are already logged in.

### `DATABASE_URL`

The database connection string. Currently set this to a NeonDB instance.

### `SESSION_MANAGER_URL`

This is the URL of the session manager. For cloudflare deployment, this cannot be a fixed IP address.

This is **required** for running the nextjs application.

### `NEXTAUTH_URL`

### `NEXTAUTH_SECRET`

### `DISCORD_CLIENT_ID`

### `DISCORD_CLIENT_SECRET`

### `GITHUB_CLIENT_ID`

### `GITHUB_CLIENT_SECRET`

### `GOOGLE_CLIENT_ID`

### `GOOGLE_CLIENT_SECRET`

These are the [NextAuth](https://authjs.dev) configuration variables. These are **required** for running the nextjs application.

## Scripts

Many scripts have been defined in the [package.json](package.json).
This section will go over these scripts and the additional steps or environment variables required for their execution.

Also see [NextJS Scripts](apps/website/README.md#scripts), [Queue Processor Scripts](apps/queue-processor/README.md#scripts) and [Script Scripts](apps/script/README.md#scripts) for more information.

- [`lint:tsc`](#linttsc)
- [`lint:next`](#lintnext)
- [`format:check`](#formatcheck)
- [`format:write`](#formatwrite)
- [`problems:new`](#problemsnew)
- [`problems:lint`](#problemslint)
- [`problems:build`](#problemsbuild)
- [`problems:build-pkg`](#problemsbuild-pkg)

### `lint:tsc`

Lint the entire TS/JS codebase using `tsc`.

### `lint:next`

Lint the NextJS codebase using `next lint`.

### `format:check`

Check formatting for the entire codebase using `prettier` and `gofmt`.

### `format:write`

Format the entire codebase using `prettier` and `gofmt`.

### `problems:new`

Create a new problem.

Might require the following environment variables.

- `APP=script`
- `PROJECT_ROOT` might need to be defined if the script is not run from within the git repository.

### `problems:lint`

Lint the problem configuration files.

Might require the following environment variables.

- `APP` - This is required and should be set to `script`. Already set in [package.json](package.json).
- `PROJECT_ROOT` might need to be defined if the script is not run from within the git repository.

### `problems:test`

Test the problem images using tests defined in the problem configs.

Might require the following environment variables.

- `APP` - This is required and should be set to `queue-processor`. Already set in [package.json].
- `PROJECT_ROOT` might need to be defined if the script is not run from within the git repository.

### `problems:build`

Build (and push) the problem images.

Might require the following environment variables.

- `APP` - This is required and should be set to `script`. Already set in [package.json](package.json).
- `PROJECT_ROOT` might need to be defined if the script is not run from within the git repository.
- `DOCKER_REGISTRY` might need to be defined if the images need to be pushed to a registry.

### `problems:build-pkg`

NextJs cannot do dynamically import problems from the problems directory when deployed on the edge. A problems cache is generated containing only the information needed by the nextjs application. This command generates that cache.

Might require the following environment variables.

- `APP` - This is required and should be set to `script`. Already set in [package.json](package.json).
- `PROJECT_ROOT` might need to be defined if the script is not run from within the git repository.
