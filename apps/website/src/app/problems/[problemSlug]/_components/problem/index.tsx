import { ProblemAbout } from "./about"
import { ProblemBody } from "./body"
import { ProblemHeading } from "./heading"
import { ProblemHints } from "./hints"

export function Problem({ slug }: { slug: string }) {
  return (
    <div className="h-[calc(100vh-80px)] py-2 dark:bg-neutral-900">
      <ProblemHeading slug={slug} />
      <div className="h-[calc(100vh-220px)] overflow-y-scroll">
        <ProblemBody slug={slug} />
        <ProblemHints slug={slug} />
        <ProblemAbout slug={slug} />
      </div>
    </div>
  )
}
