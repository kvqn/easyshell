import { SeriesList } from "@easyshell/problems/data/series"

import { Back } from "@/components/back"
import { ProblemStatus } from "@/components/problem-status"
import { ensureAuth } from "@/lib/server/auth"
import { getPublicProblemInfo } from "@/lib/server/problems"
import { getUserSubmissionStats } from "@/lib/server/queries"

import Link from "next/link"
import { notFound } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const series = SeriesList.find((s) => s.slug === slug)
  if (!series) {
    notFound()
  }

  const user = await ensureAuth()
  const userStats = await getUserSubmissionStats(user.id)

  const problems = (
    await Promise.all(
      series.problems.map(async (problem) => {
        const info = await getPublicProblemInfo(problem)
        return {
          ...info,
          status: userStats.problems[info.slug],
        }
      }),
    )
  ).sort((a, b) => a.id - b.id)

  return (
    <div className="w-4/5 mx-auto pt-20">
      <Back href="/browse" />
      <div className="text-4xl font-bold mt-10 font-clash-display">
        {series.name}
      </div>
      <div className="text-2xl font-clash-display">{series.description}</div>
      <div className="mt-10 w-full divide-y rounded-xl border overflow-hidden border-neutral-400">
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
