import { Footer } from "@/app/_components/footer"
import { ProblemStatus } from "@/components/problem-status"
import { Card } from "@/components/ui/card"
import { auth } from "@/lib/server/auth"
import { getProblemDifficulty, getProblemStatus } from "@/lib/server/problems"
import { getWikiPages } from "@/lib/server/wiki"
import { cn } from "@/lib/utils"

import Link from "next/link"

export const metadata = {
  title: "easyshell - wiki",
  description: "Wiki for easyshell",
}

export default async function Page() {
  const pages = await getWikiPages()
  const userId = (await auth())?.user.id

  return (
    <div className="flex h-full flex-col items-center gap-8">
      <div
        className="w-full bg-gray-50 p-10 lg:p-10 dark:bg-emerald-950"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      >
        <h1 className="text-center font-clash-display text-3xl font-bold lg:text-6xl dark:text-emerald-100">
          Wiki
        </h1>
      </div>
      <div className="flex w-2/3 flex-col">
        {pages.map((page) => (
          <WikiPageCard key={page.slug} page={page} userId={userId} />
        ))}
      </div>
      <Footer className="mt-auto" />
    </div>
  )
}

function WikiPageCard({
  page,
  userId,
}: {
  page: Awaited<ReturnType<typeof getWikiPages>>[number]
  userId?: string
}) {
  if (page.type === "editorial") {
    return (
      <WikiEditorialCard title={page.title} slug={page.slug} userId={userId} />
    )
  }
  return null
}

async function WikiEditorialCard({
  title,
  slug,
  userId,
}: {
  title: string
  slug: string
  userId?: string
}) {
  const status = userId ? await getProblemStatus(slug, userId) : undefined
  const difficulty = await getProblemDifficulty(slug)
  return (
    <Link href={`/wiki/${slug}`}>
      <Card className="flex w-full flex-col gap-4 border p-4">
        <div className="font-clash-display text-2xl font-semibold">{title}</div>
        <div className="ml-auto flex items-center gap-2">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Editorial for
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-md border px-2 py-1 shadow-xs",
              {
                "bg-green-100": difficulty === "easy",
                "border-orange-400 bg-orange-100 shadow-orange-400 dark:border-orange-600 dark:bg-orange-900 dark:shadow-orange-600":
                  difficulty === "medium",
              },
            )}
          >
            <Link
              href={`/problems/${slug}`}
              className={cn("font-geist-mono text-xs font-medium", {
                "text-orange-600 dark:text-orange-400": difficulty === "medium",
              })}
            >
              {slug}
            </Link>
            <ProblemStatus status={status} />
          </div>
        </div>
      </Card>
    </Link>
  )
}
