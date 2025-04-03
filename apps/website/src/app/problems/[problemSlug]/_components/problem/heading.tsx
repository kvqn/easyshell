import { ensureAuth } from "@/lib/server/auth"
import { getProblemDifficulty, getProblemInfo } from "@/lib/server/problems"
import { isProblemBookmarked } from "@/lib/server/queries"
import { cn } from "@/lib/utils"

import { ProblemBookmark } from "./bookmark"

export async function ProblemHeading({ slug }: { slug: string }) {
  const { id: userId } = await ensureAuth()
  const { id, title, description } = await getProblemInfo(slug)
  const isBookmarked = await isProblemBookmarked({ userId, problemId: id })
  const difficulty = await getProblemDifficulty(slug)
  return (
    <div
      className={cn(
        "bg-neutral-100 px-4 mx-2 py-2 border-black border-2 rounded-t-md rounded-b-xl shadow-sm",
        {
          "bg-linear-to-b from-emerald-100 via-emerald-50 via-10% to-neutral-100":
            difficulty === "easy",
          "bg-linear-to-b from-orange-100 via-orange-50 via-10% to-neutral-100":
            difficulty === "medium",
          "bg-linear-to-b from-rose-100 via-rose-50 via-10% to-neutral-100":
            difficulty === "hard",
        },
      )}
    >
      <div className="flex items-center gap-4">
        <p className="text-6xl font-black">#{id}</p>
        <div className="flex flex-col grow">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="font-mono text-sm text-neutral-500">{slug}</p>
        </div>
        <ProblemBookmark isBookmarked={isBookmarked} problemId={id} />
      </div>
      <p className="px-4 text-center italic">{description}</p>
    </div>
  )
}
