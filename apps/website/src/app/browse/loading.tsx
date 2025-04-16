import { SeriesList } from "@easyshell/problems/data/series"

import { TextBackground } from "@/components/backgrounds/text-background"
import { Progress } from "@/components/ui/progress"

import { ProblemListSkeleton } from "./client"

import Link from "next/link"

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="font-clash-display text-2xl font-semibold">Series</div>
      <div className="font-clash-display text-neutral-500">
        Curated list of problems to master specific topics.
      </div>
      <div className="mt-4 flex gap-4">
        {SeriesList.map((series) => (
          <SeriesCardSkeleton key={series.slug} series={series} />
        ))}
      </div>
      <div className="font-clash-display mt-4 text-2xl font-semibold">
        Problems
      </div>
      <div className="font-clash-display mb-4 text-neutral-500">
        Browse all problems and filter by tags.
      </div>
      <ProblemListSkeleton />
    </div>
  )
}

function SeriesCardSkeleton({
  series,
}: {
  series: (typeof SeriesList)[number]
}) {
  return (
    <Link
      href={`/series/${series.slug}`}
      key={series.slug}
      className="flex w-60 flex-col overflow-hidden rounded-xl border transition-colors hover:bg-neutral-50"
    >
      <div className="h-18 animate-pulse bg-neutral-100"></div>
      <div className="flex flex-col px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="font-clash-display font-semibold">{series.name}</div>
        </div>
        <div className="text-justify text-sm text-neutral-600">
          {series.description}
        </div>
        <Progress className="my-2 animate-pulse bg-emerald-100" value={0} />
      </div>
    </Link>
  )
}
