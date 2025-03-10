import { getProblemSlugFromId } from "@easyshell/problems"

import {
  getActiveTerminalSession,
  getTerminalSessionLogs,
  insertTerminalSession,
} from "@/lib/server/queries"

import { containerManagerCreate } from "./container-manager"

export async function runTerminalSession({
  problemId,
  testcaseId,
  sessionId,
}: {
  problemId: string
  testcaseId: string
  sessionId: number
}) {
  const problemSlug = await getProblemSlugFromId(parseInt(problemId))
  if (!problemSlug) throw new Error("Problem not found")

  await containerManagerCreate({
    image: `easyshell-${problemSlug}-${testcaseId}`,
    container_name: `easyshell-${problemSlug}-${testcaseId}-session-${sessionId}`,
  })
}

export async function getTerminalSession({
  userId,
  problemId,
  testcaseId,
}: {
  userId: string
  problemId: number
  testcaseId: number
}) {
  let session = await getActiveTerminalSession({
    userId,
    problemId,
    testcaseId,
  })
  if (!session) {
    await createTerminalSession({ userId, problemId, testcaseId })
    session = await getActiveTerminalSession({ userId, problemId, testcaseId })
  }

  if (!session) throw new Error("Failed to create terminal session")

  const logs = await getTerminalSessionLogs(session.id)

  return {
    id: session.id,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    deletedAt: session.deletedAt,
    logs: logs,
  }
}

export async function createTerminalSession({
  userId,
  problemId,
  testcaseId,
}: {
  userId: string
  problemId: number
  testcaseId: number
}) {
  const sessionId = await insertTerminalSession({
    userId: userId,
    problemId: problemId,
    testcaseId: testcaseId,
  })

  await runTerminalSession({
    problemId: problemId.toString(),
    testcaseId: testcaseId.toString(),
    sessionId: sessionId,
  })
}
