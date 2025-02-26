import { ensureAuth } from "@/server/auth"
import { isProblemBookmarked } from "@/server/db/queries"
import { getProblemInfo } from "@/server/utils/problem"

import { ProblemBookmark } from "./bookmark"

export async function ProblemHeading({ slug }: { slug: string }) {
  const { id: userId } = await ensureAuth()
  const { id: problemId } = await getProblemInfo(slug)
  const isBookmarked = await isProblemBookmarked({ userId, problemId })
  const { id, title, description } = await getProblemInfo(slug)
  return (
    <div>
      <div className="flex items-center gap-4">
        <p className="text-6xl font-black">#{id}</p>
        <div className="flex flex-col grow">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="font-mono text-sm text-neutral-500">{slug}</p>
        </div>
        <ProblemBookmark isBookmarked={isBookmarked} problemId={problemId} />
      </div>
      <p className="px-4 text-center italic">{description}</p>
    </div>
  )
}
