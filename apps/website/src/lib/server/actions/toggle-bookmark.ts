"use server"

import { bookmarks } from "@easyshell/db/schema"

import { db } from "@/db"
import { ensureAuth } from "@/lib/server/auth"
import { isProblemBookmarked } from "@/lib/server/queries"

import { and, eq } from "drizzle-orm"

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
