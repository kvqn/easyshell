import { SeriesList } from "@easyshell/problems/data/series"

import { TextBackground } from "@/components/backgrounds/text-background"
import { Progress } from "@/components/ui/progress"

import { ProblemListSkeleton } from "./client"

import Link from "next/link"

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="font-clash-display text-2xl font-semibold">Series</div>
      <div className="text-neutral-500 font-clash-display">
        Curated list of problems to master specific topics.
      </div>
      <div className="flex gap-4 mt-4">
        {SeriesList.map((series) => (
          <SeriesCardSkeleton key={series.slug} series={series} />
        ))}
      </div>
      <div className="font-clash-display text-2xl font-semibold mt-4">
        Problems
      </div>
      <div className="text-neutral-500 font-clash-display mb-4">
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
      className="border rounded-xl w-60 flex flex-col hover:bg-neutral-50 transition-colors overflow-hidden"
    >
      <div className="h-18 animate-pulse bg-neutral-100"></div>
      <div className="px-4 py-2 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="font-clash-display font-semibold">{series.name}</div>
        </div>
        <div className="text-sm text-neutral-600 text-justify">
          {series.description}
        </div>
        <Progress className="my-2 bg-emerald-100 animate-pulse" value={0} />
      </div>
    </Link>
  )
}
