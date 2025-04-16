import type { getPublicProblemInfo } from "@/lib/server/problems"

import { ProblemDifficulty, ProblemStatus } from "./problem-status"
import { Badge } from "./ui/badge"

import Link from "next/link"

export function Problems({
  problems,
  showTags,
}: {
  problems: Array<
    Awaited<ReturnType<typeof getPublicProblemInfo>> & {
      status?: "attempted" | "solved"
    }
  >
  showTags?: boolean
}) {
  return (
    <div className="flex h-fit w-full flex-col divide-y overflow-hidden rounded-xl border border-neutral-400 dark:divide-neutral-800 dark:border-neutral-800">
      <div className="flex divide-x divide-neutral-300 border-b border-b-neutral-400 bg-gray-50 font-semibold *:p-2 dark:divide-neutral-800 dark:border-b-neutral-800 dark:bg-neutral-900">
        <div className="w-20 text-center">#</div>
        <div className="flex grow items-center justify-between">
          <p className="grow">Title</p>
        </div>
        <div className="w-10 text-center lg:w-20">Status</div>
      </div>
      <div className="divide-y">
        {problems.length > 0 ? (
          problems.map((problem) => (
            <Problem key={problem.id} info={problem} showTags={!!showTags} />
          ))
        ) : (
          <div className="flex h-40 w-full items-center justify-center text-xl text-neutral-400">
            What are you looking for?
          </div>
        )}
      </div>
    </div>
  )
}

function Problem({
  info,
  showTags,
}: {
  info: Awaited<ReturnType<typeof getPublicProblemInfo>> & {
    status?: "attempted" | "solved"
  }
  showTags: boolean
}) {
  return (
    <Link
      href={`/problems/${info.slug}`}
      className="group flex cursor-pointer divide-x transition-all *:p-2 hover:bg-gray-100 dark:bg-neutral-950 dark:opacity-75 dark:hover:bg-black dark:hover:opacity-100"
    >
      <div className="flex w-20 items-center justify-center font-geist-mono">
        {info.id}
      </div>
      <div className="flex grow flex-col">
        <div className="flex items-center justify-between px-2">
          <span>{info.title}</span>
          <ProblemDifficulty difficulty={info.difficulty} />
        </div>
        {showTags && (
          <div className="flex items-center justify-between px-2">
            <div className="text-xs text-neutral-400">{info.slug}</div>
            <div className="flex items-center gap-2">
              {info.tags.map((t) => (
                <Badge className="px-2 py-0 text-xs" key={t}>
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex w-10 items-center justify-center lg:w-20">
        <ProblemStatus status={info.status} />
      </div>
    </Link>
  )
}
