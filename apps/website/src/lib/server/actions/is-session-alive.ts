"use server"

import { terminalSessions } from "@easyshell/db/schema"

import { db } from "@/db"

import { eq } from "drizzle-orm"

export async function isSessionAlive(sessionId: number) {
  const session = await db
    .select()
    .from(terminalSessions)
    .where(eq(terminalSessions.id, sessionId))

  if (!session[0]) {
    return false
  }

  if (session[0].deletedAt) {
    return false
  }

  return false
}
