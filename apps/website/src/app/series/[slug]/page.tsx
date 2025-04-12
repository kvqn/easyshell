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
    <div className="mx-auto w-4/5 pt-20">
      <Back href="/browse" />
      <div className="mt-10 font-clash-display text-4xl font-bold">
        {series.name}
      </div>
      <div className="font-clash-display text-2xl">{series.description}</div>
      <div className="mt-10 w-full divide-y overflow-hidden rounded-xl border border-neutral-400">
        <div className="flex divide-x divide-neutral-300 border-b border-b-neutral-400 bg-gray-200 font-semibold *:p-2">
          <div className="w-20 text-center">#</div>
          <div className="grow">Title</div>
          <div className="w-10 text-center lg:w-20">Status</div>
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
      className="flex cursor-pointer divide-x transition-colors *:p-2 hover:bg-gray-100"
    >
      <div className="w-20 text-center">{info.id}</div>
      <div className="grow">{info.slug}</div>
      <div className="flex w-10 items-center justify-center lg:w-20">
        <ProblemStatus status={info.status} />
      </div>
    </Link>
  )
}
