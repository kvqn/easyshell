import { SeriesList } from "@easyshell/problems/data/series"

import { Back } from "@/components/back"
import { ProblemStatus } from "@/components/problem-status"
import { Problems } from "@/components/problems"
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
      <div className="mb-10 font-clash-display text-2xl">
        {series.description}
      </div>
      <Problems problems={problems} />
    </div>
  )
}
