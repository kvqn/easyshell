import { env } from "@easyshell/env"
import createMDX from "@next/mdx"
import { NextConfig } from "next"

if (!process.env.SKIP_ENV_VALIDATION && env.APP !== "website")
  throw new Error("Invalid APP variable")

const config: NextConfig = {
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
