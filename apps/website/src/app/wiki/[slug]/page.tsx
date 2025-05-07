import { Markdown } from "@/components/markdown"
import { ProblemStatus } from "@/components/problem-status"
import { auth } from "@/lib/server/auth"
import { getProblemDifficulty, getProblemStatus } from "@/lib/server/problems"
import { getWikiFull, getWikiMetadata } from "@/lib/server/wiki"
import { cn } from "@/lib/utils"

import moment from "moment"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const metadata = await getWikiMetadata(slug)
  if (!metadata)
    return {
      title: "easyshell - not found",
    }

  if (metadata.type === "editorial")
    return {
      title: `editorial - ${slug}`,
    }

  return { title: `wiki - ${slug}` }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const metadata = await getWikiFull(slug)
  if (!metadata) notFound()

  const userId = (await auth())?.user.id

  return (
    <div className="mx-auto flex w-2/3 flex-col">
      <div className="flex flex-col justify-center py-8">
        <div className="font-clash-display text-5xl font-bold">
          {metadata.title}
        </div>
        <div className="font-clash-display text-neutral-500">
          {moment(metadata.lastEdited).format("MMMM Do YYYY")}
        </div>
      </div>
      {metadata.type === "editorial" ? (
        <SpoilerWarning slug={slug} userId={userId} />
      ) : null}
      <div>This is the editorial for</div>
      <div>
        <Markdown source={metadata.body} />
      </div>
    </div>
  )
}

export async function SpoilerWarning({
  slug,
  userId,
}: {
  slug: string
  userId?: string
}) {
  const difficulty = await getProblemDifficulty(slug)
  const status = userId ? await getProblemStatus(slug, userId) : undefined
  return (
    <div className="mb-8 flex items-center justify-center gap-2 bg-neutral-100 py-2 dark:bg-neutral-800">
      <span className="font-clash-display text-neutral-700 dark:text-neutral-300">
        {`SPOILER WARNING: This wiki page contains spoilers for the problem `}
      </span>
      <Link
        href={`/problems/${slug}`}
        className={cn(
          "flex items-center gap-2 rounded-md border px-2 py-1 shadow-xs",
          {
            "bg-green-100": difficulty === "easy",
            "border-orange-400 bg-orange-100 shadow-orange-400 dark:border-orange-600 dark:bg-orange-900 dark:shadow-orange-600":
              difficulty === "medium",
          },
        )}
      >
        <span
          className={cn("font-geist-mono text-xs font-medium", {
            "text-orange-600 dark:text-orange-400": difficulty === "medium",
          })}
        >
          {slug}
        </span>
        <ProblemStatus status={status} />
      </Link>
    </div>
  )
}
