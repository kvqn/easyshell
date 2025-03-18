# Overview

The website for [easyshell.xyz](https://easyshell.xyz) is made using [Next.js 15](https://nextjs.org/blog/next-15) and deployed on [Cloudflare Pages](https://pages.cloudflare.com/) using [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages).

Also Refer - [tailwind](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [react-icons](https://react-icons.github.io/react-icons/)

The website has no context of `docker` and so it uses other microservices for session and submission management. See [Session Manager](../session-manager/README.md) and [Queue Processor](../queue-processor/README.md) for more information. Also see [Architecture](../../README.md#architecture) for a more high-level overview.

Before running the server, you need to first build the problems cache using [`problems:build-pkg`](../../README.md#problemsbuild-pkg) script.

## Environment Variables

This app Requires the following environment variables. See [Environment Variables](../../README.md#environment-variables) for more information.

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `DATABASE_URL`
- `SESSION_MANAGER_URL`

## Scripts

These are the Next.js related scripts.

- [`lint`](#lint)
- [`dev`](#dev)
- [`build`](#build)
- [`start`](#start)
- [`pages:build`](#pagesbuild)
- [`preview`](#preview)
- [`deploy`](#deploy)

### `lint`

Lint the Next.js application using `next lint`.

### `dev`

Run the Next.js application in development mode.

### `build`

Build the Next.js application.

### `start`

Start the Next.js application.

### `pages:build`

Build the Next.js application for Cloudflare Pages.

### `preview`

Preview the Next.js application for Cloudflare Pages using wrangler.

### `deploy`

Deploy the Next.js application to Cloudflare Pages using wrangler.
