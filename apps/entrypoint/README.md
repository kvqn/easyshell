# Entrypoint

## Overview

This is a Go application that serves as the entrypoint for testcase containers.

## Scripts

There isn't a script management system for this service. Use the following commands to achieve what you want.

- Format

  ```sh
  gofmt -w .
  ```

- Lint

  ```sh
  golangci-lint run
  ```

**Note:** You aren't supposed to build and execute this service directly. It is intended to be used as the entrypoint for the testcase docker images. The process of building images is handled by the [problems:build](../../README.md#problemsbuild) script.
