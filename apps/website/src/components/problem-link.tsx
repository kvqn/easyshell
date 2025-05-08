import { auth } from "@/lib/server/auth"
import { getProblemDifficulty, getProblemStatus } from "@/lib/server/problems"
import { cn } from "@/lib/utils"

import { ProblemStatus } from "./problem-status"
import { EasyTooltip } from "./ui/tooltip"

import Link from "next/link"

export async function ProblemLink({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const userId = (await auth())?.user.id
  const difficulty = await getProblemDifficulty(slug)
  const status = userId ? await getProblemStatus(slug, userId) : undefined

  return (
    <EasyTooltip
      tip={
        status === "solved"
          ? "Solved"
          : status === "attempted"
            ? "Attempted"
            : "Not Attempted"
      }
    >
      <Link
        href={`/problems/${slug}`}
        className={cn(
          "ml-1 inline w-fit space-x-1 rounded-md border px-2 py-1 whitespace-nowrap shadow-xs",
          {
            "bg-green-100": difficulty === "easy",
            "border-orange-400 bg-orange-100 shadow-orange-400 dark:border-orange-600 dark:bg-orange-900 dark:shadow-orange-600":
              difficulty === "medium",
          },
          className,
        )}
      >
        <span
          className={cn("inline font-geist-mono text-xs font-medium", {
            "text-orange-600 dark:text-orange-400": difficulty === "medium",
          })}
        >
          {slug}
        </span>
        <ProblemStatus status={status} tooltip={false} />
      </Link>
    </EasyTooltip>
  )
}
