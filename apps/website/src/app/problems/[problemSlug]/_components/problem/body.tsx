import { getProblemBody } from "@easyshell/problems"

import { customComponents } from "@/mdx-components"

import { MDXRemote } from "next-mdx-remote-client/rsc"

export async function ProblemBody({ slug }: { slug: string }) {
  const text = await getProblemBody(slug)
  return <MDXRemote source={text} components={customComponents} />
}
