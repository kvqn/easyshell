import { Back } from "@/components/back"
import { Problems } from "@/components/problems"
import { auth } from "@/lib/server/auth"
import { getPublicProblemInfo } from "@/lib/server/problems"
import { getUserSubmissionStats } from "@/lib/server/queries"
import { getSeries } from "@/lib/server/series"

import { notFound } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const series = await getSeries(slug)
  if (!series) {
    notFound()
  }

  const session = await auth()
  const user = session?.user
  const userStats = user ? await getUserSubmissionStats(user.id) : null

  const problems = (
    await Promise.all(
      series.problems.map(async (problem) => {
        const info = await getPublicProblemInfo(problem)
        return {
          ...info,
          status: userStats ? userStats.problems[info.slug] : undefined,
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
