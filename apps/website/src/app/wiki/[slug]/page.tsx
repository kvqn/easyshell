import { Footer } from "@/app/_components/footer"
import { ProblemStatus } from "@/components/problem-status"
import { auth } from "@/lib/server/auth"
import { getProblemDifficulty, getProblemStatus } from "@/lib/server/problems"
import { getWikiFull, getWikiMetadata } from "@/lib/server/wiki"
import { cn } from "@/lib/utils"

import { Markdown } from "./_components/markdown"

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
    <>
      <div className="mx-auto flex w-[95%] flex-col md:w-[90%] lg:w-2/3">
        <div className="flex flex-col justify-center py-8">
          <div className="font-clash-display text-5xl font-bold">
            {metadata.title}
          </div>
          <div className="flex justify-between font-clash-display text-neutral-500">
            <div>{moment(metadata.lastEdited).format("MMMM Do YYYY")}</div>
            <div>{metadata.type === "editorial" ? "EDITORIAL" : null}</div>
          </div>
        </div>
        {metadata.type === "editorial" ? (
          <SpoilerWarning slug={slug} userId={userId} />
        ) : null}
        <div>
          <Markdown source={metadata.body} />
        </div>
      </div>
      <Footer className="mt-8" />
    </>
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
    <div className="mb-4 bg-neutral-100 px-4 py-2 text-center dark:bg-neutral-800">
      <span className="font-clash-display font-semibold text-neutral-700 dark:text-neutral-300">
        {`SPOILER WARNING: `}
      </span>
      <span className="font-clash-display text-neutral-700 dark:text-neutral-300">
        {`This wiki page contains spoilers for the problem `}
      </span>
      <Link
        href={`/problems/${slug}`}
        className={cn("ml-1 w-fit rounded-md border px-2 py-1 shadow-xs", {
          "bg-green-100": difficulty === "easy",
          "border-orange-400 bg-orange-100 shadow-orange-400 dark:border-orange-600 dark:bg-orange-900 dark:shadow-orange-600":
            difficulty === "medium",
        })}
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
