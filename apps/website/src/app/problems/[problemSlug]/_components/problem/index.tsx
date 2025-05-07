import { ProblemAbout } from "./about"
import { ProblemBody } from "./body"
import { ProblemEditorial } from "./editorial"
import { ProblemHeading } from "./heading"
import { ProblemHints } from "./hints"
import { ProblemRelatedWiki } from "./wiki"

export function Problem({ slug }: { slug: string }) {
  return (
    <div className="h-[calc(100vh-80px)] py-2 dark:bg-neutral-900">
      <ProblemHeading slug={slug} />
      <div className="h-[calc(100vh-220px)] overflow-y-scroll">
        <ProblemEditorial slug={slug} />
        <ProblemBody slug={slug} />
        <ProblemHints slug={slug} />
        <ProblemAbout slug={slug} />
        <ProblemRelatedWiki slug={slug} />
      </div>
    </div>
  )
}
