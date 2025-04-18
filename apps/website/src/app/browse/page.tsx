import { auth } from "@/lib/server/auth"
import {
  getAllTags,
  getProblems,
  getPublicProblemInfo,
} from "@/lib/server/problems"
import { getUserSubmissionStats } from "@/lib/server/queries"

import { ProblemList, SeriesCarousel } from "./client"

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
      <div className="mb-4 font-clash-display text-neutral-500">
        Curated list of problems to master specific topics.
      </div>
      <SeriesCarousel submission_stats={submission_stats} />
      <ProblemList problems={problems} tags={tags} />
    </div>
  )
}
