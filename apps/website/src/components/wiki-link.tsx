import { getWikiMetadata } from "@/lib/server/wiki"
import { cn } from "@/lib/utils"

import { EasyTooltip } from "./ui/tooltip"

import moment from "moment"
import Link from "next/link"

export async function WikiLink({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const metadata = await getWikiMetadata(slug)

  return (
    <EasyTooltip
      tip={
        metadata ? (
          <div className="flex flex-col justify-center">
            <div className="font-clash-display text-2xl font-bold">
              {metadata.title}
            </div>
            <div className="flex justify-between font-clash-display text-xs text-neutral-500">
              <div>{moment(metadata.lastEdited).format("MMMM Do YYYY")}</div>
              <div>{metadata.type === "editorial" ? "EDITORIAL" : null}</div>
            </div>
          </div>
        ) : null
      }
    >
      <Link
        href={`/problems/${slug}`}
        className={cn(
          "ml-1 inline w-fit space-x-1 rounded-md border bg-neutral-100 px-2 py-1 whitespace-nowrap shadow-xs",
          className,
        )}
      >
        <span className="font-clash-display text-xs font-medium text-neutral-400">
          WIKI
        </span>
        <span className={cn("inline font-geist-mono text-xs font-medium", {})}>
          {slug}
        </span>
      </Link>
    </EasyTooltip>
  )
}
