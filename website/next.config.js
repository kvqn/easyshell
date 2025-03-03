import createMDX from "@next/mdx"
import path from "path"

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
//await import("./src/env.js")

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: false,
  experimental: {
    mdxRs: true,
    turbo: {
      // ...
    },
  },
  outputFileTracingRoot: process.env.PWD,
}

const withMDX = createMDX({})

export default withMDX(config)
