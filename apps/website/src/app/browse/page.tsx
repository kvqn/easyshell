import { SeriesList } from "@easyshell/problems/data/series"

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
          solved: submission_stats.problems[info.slug] === "solved",
        }
      }),
    )
  ).sort((a, b) => a.id - b.id)

  return (
    <div className="w-full divide-y rounded-xl border overflow-hidden border-neutral-400">
      <div>
        <div>Series</div>
        <div>
          {SeriesList.map((series) => (
            <div key={series.slug}>
              <div>{series.name}</div>
              <div>
                {series.problems.reduce(
                  (acc, p) =>
                    acc + (submission_stats.problems[p] === "solved" ? 1 : 0),
                  0,
                )}{" "}
                / {series.problems.length}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="divide-x divide-neutral-300 *:p-2 flex font-semibold bg-gray-200 border-b border-b-neutral-400">
        <div className="w-20 text-center">#</div>
        <div className="grow">Title</div>
        <div className="w-20 lg:w-40">Solved</div>
      </div>
      <div className="divide-y">
        {problems.map((problem) => (
          <Problem key={problem.id} info={problem} />
        ))}
      </div>
    </div>
  )
}

async function Problem({
  info,
}: {
  info: Awaited<ReturnType<typeof getPublicProblemInfo>> & { solved: boolean }
}) {
  return (
    <Link
      href={`/problems/${info.slug}`}
      className="cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100 flex"
    >
      <div className="w-20 text-center">{info.id}</div>
      <div className="grow">{info.slug}</div>
      <div className="w-20 lg:w-40">{info.solved ? "Yes" : "No"}</div>
    </Link>
  )
}
