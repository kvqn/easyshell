import { SeriesList } from "@easyshell/problems/data/series"

import { TextBackground } from "@/components/backgrounds/text-background"
import { ProblemStatus } from "@/components/problem-status"
import { Progress } from "@/components/ui/progress"
import { ensureAuth } from "@/lib/server/auth"
import { getProblems, getPublicProblemInfo } from "@/lib/server/problems"
import { getUserSubmissionStats } from "@/lib/server/queries"

import Link from "next/link"

export const metadata = {
  title: "easyshell - browse",
}

export default async function Page() {
  const user = await ensureAuth()
  const submission_stats = await getUserSubmissionStats(user.id)

  const problems = (
    await Promise.all(
      (await getProblems()).map(async (problem) => {
        const info = await getPublicProblemInfo(problem)
        return {
          ...info,
          status: submission_stats.problems[info.slug],
        }
      }),
    )
  ).sort((a, b) => a.id - b.id)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {SeriesList.map((series) => (
          <SeriesCard
            key={series.slug}
            series={series}
            num_solved={
              series.problems.filter(
                (p) => submission_stats.problems[p] === "solved",
              ).length
            }
          />
        ))}
      </div>
      <div className="w-full divide-y rounded-xl border overflow-hidden border-neutral-400">
        <div className="divide-x divide-neutral-300 *:p-2 flex font-semibold bg-gray-200 border-b border-b-neutral-400">
          <div className="w-20 text-center">#</div>
          <div className="grow">Title</div>
          <div className="w-10 lg:w-20 text-center">Status</div>
        </div>
        <div className="divide-y">
          {problems.map((problem) => (
            <Problem key={problem.id} info={problem} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SeriesCard({
  series,
  num_solved,
}: {
  series: (typeof SeriesList)[number]
  num_solved: number
}) {
  const progress = Math.round((num_solved * 100) / series.problems.length)
  return (
    <Link
      href={`/series/${series.slug}`}
      key={series.slug}
      className="border rounded-xl w-60 flex flex-col hover:bg-neutral-50 transition-colors overflow-hidden"
    >
      <TextBackground text={series.slug} className="h-18" />
      <div className="px-4 py-2 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="font-clash-display font-semibold">{series.name}</div>
          <div className="text-sm font-geist-mono font-semibold">
            {progress}%
          </div>
        </div>
        <div className="text-sm text-neutral-600 text-justify">
          {series.description}
        </div>
        <Progress
          className="my-2 *:bg-emerald-600 bg-emerald-100"
          value={progress}
        />
      </div>
    </Link>
  )
}

function Problem({
  info,
}: {
  info: Awaited<ReturnType<typeof getPublicProblemInfo>> & {
    status?: "attempted" | "solved"
  }
}) {
  return (
    <Link
      href={`/problems/${info.slug}`}
      className="cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100 flex"
    >
      <div className="w-20 text-center">{info.id}</div>
      <div className="grow">{info.slug}</div>
      <div className="w-10 lg:w-20 flex items-center justify-center">
        <ProblemStatus status={info.status} />
      </div>
    </Link>
  )
}
