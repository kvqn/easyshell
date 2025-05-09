import { Card } from "@/components/ui/card"
import {
  getProblemSlugFromId,
  getPublicProblemInfo,
} from "@/lib/server/problems"

import Link from "next/link"
import { PiBookmarkSimple, PiBookmarkSimpleDuotone } from "react-icons/pi"

export async function Bookmarks({
  bookmarks,
  loggedIn,
}: {
  bookmarks: Array<number>
  loggedIn: boolean
}) {
  if (!loggedIn) {
    return null
  }
  return (
    <div className="w-60">
      <div className="font-clash-display text-2xl font-semibold">
        Recent Activity
      </div>
      <div className="mb-4 font-clash-display text-sm text-neutral-500 md:text-base">
        Pick up where you left off
      </div>
      <div className="flex flex-col gap-2">
        {bookmarks.length === 0 ? (
          <div>Your bookmarks will show up here</div>
        ) : (
          bookmarks.map((id) => <BookmarkedProblem key={id} id={id} />)
        )}
      </div>
    </div>
  )
}

async function BookmarkedProblem({ id }: { id: number }) {
  const slug = await getProblemSlugFromId(id)
  const { title } = await getPublicProblemInfo(slug)
  return (
    <Link
      href={`/problems/${slug}`}
      className="flex items-center rounded-md border px-2 py-1 shadow hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
    >
      <PiBookmarkSimpleDuotone className="text-xl" />
      <div className="overflow-ellipsis whitespace-nowrap">{title}</div>
      <div className="ml-auto font-clash-display font-medium text-neutral-300 dark:text-neutral-700">
        #{id}
      </div>
    </Link>
  )
}
