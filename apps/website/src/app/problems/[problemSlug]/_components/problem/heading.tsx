import { EasyTooltip } from "@/components/ui/tooltip"
import { ensureAuth } from "@/lib/server/auth"
import {
  getProblemDifficulty,
  getProblemInfo,
  getProblemStatus,
} from "@/lib/server/problems"
import { isProblemBookmarked } from "@/lib/server/queries"
import { cn } from "@/lib/utils"

import { ProblemBookmark } from "./bookmark"

import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { TbProgress } from "react-icons/tb"
import { TbCircleDotted } from "react-icons/tb"

export async function ProblemHeading({ slug }: { slug: string }) {
  const { id: userId } = await ensureAuth()
  const { id, title, description } = await getProblemInfo(slug)
  const isBookmarked = await isProblemBookmarked({ userId, problemId: id })
  const difficulty = await getProblemDifficulty(slug)
  const status = await getProblemStatus(slug, userId)
  return (
    <div
      className={cn(
        "mx-2 rounded-t-md rounded-b-xl border-2 border-black bg-neutral-100 px-4 py-2 shadow-sm",
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
        <div className="flex grow flex-col">
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="font-mono text-sm text-neutral-500">{slug}</p>
        </div>
        <div className="flex items-center">
          {status === "solved" ? (
            <EasyTooltip tip="Solved">
              <IoIosCheckmarkCircleOutline className="text-2xl" />
            </EasyTooltip>
          ) : status === "attempted" ? (
            <EasyTooltip tip="Attempted">
              <TbProgress className="text-2xl" />
            </EasyTooltip>
          ) : (
            <EasyTooltip tip="Not Attempted">
              <TbCircleDotted className="text-2xl" />
            </EasyTooltip>
          )}
          <ProblemBookmark isBookmarked={isBookmarked} problemId={id} />
        </div>
      </div>
      <p className="px-4 text-center italic">{description}</p>
    </div>
  )
}
