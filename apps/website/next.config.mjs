import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"
import createMDX from "@next/mdx"
import { join } from "path"

// if (!process.env.SKIP_ENV_VALIDATION && process.env.APP !== "website")
//   throw new Error("Invalid APP variable")
//

/** @type {import('next').NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: false,
  experimental: {
    mdxRs: true,
  },
  // outputFileTracingRoot: process.env.PWD,
  // outputFileTracingRoot: join(process.env.PWD ?? "/app", "../../"),
}

const withMDX = createMDX({})

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform()
}

export default withMDX(config)
