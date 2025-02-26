import { ProblemBody } from "./body"
import { ProblemHeading } from "./heading"
import { ProblemHints } from "./hints"

export function Problem({ slug }: { slug: string }) {
  return (
    <div>
      <ProblemHeading slug={slug} />
      <ProblemBody slug={slug} />
      <ProblemHints slug={slug} />
    </div>
  )
}
