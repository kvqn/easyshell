"use server"

import { and, eq, isNull } from "drizzle-orm"

import { ensureAuth } from "@/server/auth"
import { db } from "@/server/db"
import { terminalSessions } from "@/server/db/schema"

export async function killTerminalSessions({
  problemId,
  testcaseId,
}: {
  problemId: number
  testcaseId: number
}) {
  const user = await ensureAuth()

  const updated = await db
    .update(terminalSessions)
    .set({
      deletedAt: new Date(),
    })
    .where(
      and(
        eq(terminalSessions.userId, user.id),
        eq(terminalSessions.problemId, problemId),
        eq(terminalSessions.testcaseId, testcaseId),
        isNull(terminalSessions.deletedAt),
      ),
    )
    .returning({ id: terminalSessions.id })

  return {
    deletedSessions: updated.length,
  }
}
