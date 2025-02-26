"use server"

import { and, eq } from "drizzle-orm"

import { ensureAuth } from "@/server/auth"
import { db } from "@/server/db"
import { isProblemBookmarked } from "@/server/db/queries"
import { bookmarks } from "@/server/db/schema"

export async function toggleBookmark(problemId: number): Promise<{
  newBookmarkState: boolean
}> {
  const { id: userId } = await ensureAuth()
  const isBookmarked = await isProblemBookmarked({ problemId, userId })
  if (isBookmarked) {
    await db
      .delete(bookmarks)
      .where(
        and(eq(bookmarks.problemId, problemId), eq(bookmarks.userId, userId)),
      )
    return { newBookmarkState: false }
  }

  await db.insert(bookmarks).values({ problemId, userId })
  return { newBookmarkState: true }
}
