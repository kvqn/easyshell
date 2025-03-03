"use server"

import { db } from "@easyshell/db"
import { bookmarks } from "@easyshell/db/schema"
import { and, eq } from "drizzle-orm"

import { ensureAuth } from "@/server/auth"
import { isProblemBookmarked } from "@/server/queries"

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
