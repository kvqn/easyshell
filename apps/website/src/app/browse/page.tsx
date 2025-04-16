import { SeriesList } from "@easyshell/problems/data/series"

import { TextBackground } from "@/components/backgrounds/text-background"
import { Progress } from "@/components/ui/progress"
import { auth } from "@/lib/server/auth"
import {
  getAllTags,
  getProblems,
  getPublicProblemInfo,
} from "@/lib/server/problems"
import { getUserSubmissionStats } from "@/lib/server/queries"

import { ProblemList } from "./client"

import Link from "next/link"

export const metadata = {
  title: "easyshell - browse",
}

export default async function Page() {
  const session = await auth()
  const user = session?.user
  const submission_stats = user ? await getUserSubmissionStats(user.id) : null

  const problems = (
    await Promise.all(
      (await getProblems()).map(async (problem) => {
        const info = await getPublicProblemInfo(problem)
        return {
          ...info,
          status: submission_stats
            ? submission_stats.problems[info.slug]
            : undefined,
        }
      }),
    )
  ).sort((a, b) => a.id - b.id)
  const tags = await getAllTags()

  return (
    <div className="flex flex-col">
      <div className="font-clash-display text-2xl font-semibold">Series</div>
      <div className="font-clash-display text-neutral-500">
        Curated list of problems to master specific topics.
      </div>
      <div className="mt-4 flex gap-4">
        {SeriesList.map((series) => (
          <SeriesCard
            key={series.slug}
            series={series}
            num_solved={
              series.problems.filter((p) =>
                submission_stats
                  ? submission_stats.problems[p] === "solved"
                  : false,
              ).length
            }
          />
        ))}
      </div>
      <div className="mt-4 font-clash-display text-2xl font-semibold">
        Problems
      </div>
      <div className="mb-4 font-clash-display text-neutral-500">
        Browse all problems and filter by tags.
      </div>
      <ProblemList problems={problems} tags={tags} />
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
      className="flex w-60 flex-col overflow-hidden rounded-xl border transition-colors hover:bg-neutral-50 dark:bg-neutral-950/75 dark:hover:bg-black"
    >
      <TextBackground text={series.slug} className="h-18" />
      <div className="flex flex-col px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="font-clash-display font-semibold">{series.name}</div>
          <div className="font-geist-mono text-sm font-semibold">
            {progress}%
          </div>
        </div>
        <div className="text-justify text-sm text-neutral-600 dark:text-neutral-500">
          {series.description}
        </div>
        <Progress
          className="my-2 bg-emerald-100 *:bg-emerald-600 dark:bg-emerald-950 dark:*:bg-emerald-800"
          value={progress}
        />
      </div>
    </Link>
  )
}
