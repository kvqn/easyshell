import { ProblemAbout } from "./about"
import { ProblemBody } from "./body"
import { ProblemHeading } from "./heading"
import { ProblemHints } from "./hints"

export function Problem({ slug }: { slug: string }) {
  return (
    <div className="h-[calc(100vh-80px)] py-2">
      <ProblemHeading slug={slug} />
      <div className="overflow-y-scroll h-[calc(100vh-220px)]">
        <ProblemBody slug={slug} />
        <ProblemHints slug={slug} />
        <ProblemAbout slug={slug} />
      </div>
    </div>
  )
}
