import { Spoiler } from "@/components/spoiler"
import { Badge } from "@/components/ui/badge"
import { getProblemMetadata } from "@/lib/server/problems"

import Link from "next/link"

export async function ProblemAbout({ slug }: { slug: string }) {
  const { tags, series } = await getProblemMetadata(slug)
  return (
    <div className="border-t mt-8 mx-4">
      <div className="text-xl font-bold mt-6 mb-4">About this problem</div>
      <div className="border rounded-md divide-y bg-neutral-50 border-neutral-300 divide-neutral-300">
        <div className="flex gap-2 items-center">
          <div className="text-sm font-semibold w-20 px-2">Tags</div>
          <Spoiler className="border-l grow border-neutral-300">
            <div className="flex gap-4 px-4 pt-1.5 pb-2 items-center">
              {tags.map((tag, i) => (
                <Badge key={i}>{tag}</Badge>
              ))}
            </div>
          </Spoiler>
        </div>
        {series.length > 0 ? (
          <div className="flex gap-2 items-center">
            <div className="text-sm w-20 font-semibold px-2">Series</div>

            <div className="flex gap-4 px-4 pt-1 pb-2 border-l border-neutral-300 items-center">
              {series.map((s) => (
                <Link key={s.slug} href={`/series/${s.slug}`}>
                  <Badge>{s.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
