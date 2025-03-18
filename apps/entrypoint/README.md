# Entrypoint

## Overview

This is a Go application that serves as the entrypoint for testcase containers.

## Scripts

There isn't a script management system for this service. Use the following commands to achieve what you want.

- To format the code, run the following command.

  ```sh
  gofmt -w .
  ```

- To lint the code, run the following command.

  ```sh
  golangci-lint run
  ```

You aren't supposed to build and execute this service directly. It is intended to be used as the entrypoint for the testcase docker images. The process of building images is handled by the [problems:build](../../README.md#problemsbuild) script.
