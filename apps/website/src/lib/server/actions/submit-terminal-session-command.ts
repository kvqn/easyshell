"use server"

import { terminalSessions } from "@easyshell/db/schema"

import { db } from "@/db"
import { ensureAuth } from "@/lib/server/auth"
import { getProblemSlugFromId } from "@/lib/server/problems"
import { insertTerminalSessionLog } from "@/lib/server/queries"
import { sessionManagerExec } from "@/lib/server/session-manager"

import type { getTerminalSession } from "./get-terminal-session"

import { and, eq, isNull } from "drizzle-orm"

export async function submitTerminalSessionCommand({
  sessionId,
  command,
}: {
  sessionId: number
  command: string
}): Promise<
  | {
      status: "success"
      log: Awaited<ReturnType<typeof getTerminalSession>>["logs"][0]
    }
  | ({
      status: "error"
    } & Awaited<ReturnType<typeof sessionManagerExec>>)
> {
  const user = await ensureAuth()

  const terminalSession = await db
    .select()
    .from(terminalSessions)
    .where(
      and(
        eq(terminalSessions.id, sessionId),
        eq(terminalSessions.userId, user.id),
        isNull(terminalSessions.deletedAt),
      ),
    )
    .limit(1)
  if (!terminalSession[0]) {
    throw new Error("Session not found")
  }

  const problemSlug = await getProblemSlugFromId(terminalSession[0].problemId)

  const container_name = `easyshell-${problemSlug}-${terminalSession[0].testcaseId}-session-${sessionId}`

  const startedAt = new Date()
  const execResponse = await sessionManagerExec({
    containerName: container_name,
    command,
  })
  const finishedAt = new Date()

  if (execResponse.status === "error") {
    return execResponse
  }

  const { stdout, stderr } = execResponse

  const logId = await insertTerminalSessionLog({
    sessionId,
    stdin: command,
    stdout,
    stderr,
    startedAt,
    finishedAt,
  })

  return {
    status: "success",
    log: { id: logId, stdin: command, stdout, stderr, startedAt, finishedAt },
  }
}
