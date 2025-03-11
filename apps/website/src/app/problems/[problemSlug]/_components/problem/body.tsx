import { Markdown } from "@/components/markdown"
import { getProblemBody } from "@/lib/server/problems"

export async function ProblemBody({ slug }: { slug: string }) {
  const text = await getProblemBody(slug)
  return <Markdown source={text} />
}
