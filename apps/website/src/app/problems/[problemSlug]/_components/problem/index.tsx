import { ProblemBody } from "./body"
import { ProblemHeading } from "./heading"
import { ProblemHints } from "./hints"

import { Suspense } from "react"

export function Problem({ slug }: { slug: string }) {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <div className="overflow-y-scroll h-[calc(100vh-80px)] p-4">
        <ProblemHeading slug={slug} />
        <ProblemBody slug={slug} />
        <ProblemHints slug={slug} />
      </div>
    </Suspense>
  )
}
