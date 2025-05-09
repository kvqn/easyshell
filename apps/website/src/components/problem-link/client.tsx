"use client"

import { ProblemStatus } from "@/components/problem-status"
import { EasyTooltip } from "@/components/ui/tooltip"
import { getProblemDifficulty } from "@/lib/server/actions/get-problem-difficulty"
import { getProblemStatus } from "@/lib/server/actions/get-problem-status"
import { cn } from "@/lib/utils"

import Link from "next/link"
import { useEffect, useState } from "react"

export function ProblemLink({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | undefined
  >(undefined)
  const [status, setStatus] = useState<"solved" | "attempted" | undefined>(
    undefined,
  )

  useEffect(() => {
    void (async () => {
      setDifficulty(await getProblemDifficulty(slug))
      setStatus(await getProblemStatus(slug))
    })()
  }, [slug])

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
