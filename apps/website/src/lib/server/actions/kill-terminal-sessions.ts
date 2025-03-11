"use server"

import { db } from "@/db"
import { terminalSessions } from "@easyshell/db/schema"

import { ensureAuth } from "@/lib/server/auth"

import { and, eq, isNull } from "drizzle-orm"

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
