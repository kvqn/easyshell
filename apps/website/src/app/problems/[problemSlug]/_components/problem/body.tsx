import { Markdown } from "@/components/markdown"
import { getProblemBody } from "@/lib/server/problems"

export async function ProblemBody({ slug }: { slug: string }) {
  const text = await getProblemBody(slug)
  return (
    <div className="mx-4">
      <Markdown source={text} />
    </div>
  )
}
