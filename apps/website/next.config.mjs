import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"
import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: false,
  experimental: {
    mdxRs: true,
  },
}

const withMDX = createMDX({})

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform()
}

export default withMDX(config)
