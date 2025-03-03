import { getProblemBody } from "@easyshell/problems"
import { MDXRemote } from "next-mdx-remote-client/rsc"

import { customComponents } from "@/mdx-components"

export async function ProblemBody({ slug }: { slug: string }) {
  const text = await getProblemBody(slug)
  console.log(text)
  // return <div>{text}</div>
  return <MDXRemote source={text} components={customComponents} />
  return <div>bkjfdb</div>
}
