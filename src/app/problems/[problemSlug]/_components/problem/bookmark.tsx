"use client"

import { useState } from "react"
import { PiBookmarkSimple, PiBookmarkSimpleDuotone } from "react-icons/pi"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { toggleBookmark } from "@/server/actions/toggle-bookmark"

export function ProblemBookmark({
  problemId,
  isBookmarked,
}: {
  problemId: number
  isBookmarked: boolean
}) {
  const [bookmarked, setBookmarked] = useState(isBookmarked)
  const [inBetween, setInBetween] = useState(false)

  async function handle() {
    setInBetween(true)
    const { newBookmarkState } = await toggleBookmark(problemId)
    if (newBookmarkState) toast.success("Problem Bookmarked")
    else toast.success("Bookmark Removed")
    setInBetween(false)
    setBookmarked(newBookmarkState)
  }

  return (
    <div className="relative group cursor-pointer w-fit h-fit" onClick={handle}>
      <PiBookmarkSimple className="text-3xl" />
      <PiBookmarkSimpleDuotone
        className={cn(
          "absolute text-3xl transition-opacity top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          {
            "opacity-0": !bookmarked,
            "opacity-25": inBetween && bookmarked,
            "opacity-75": inBetween && !bookmarked,
            "opacity-100": bookmarked,
          },
        )}
      />
    </div>
  )
}
