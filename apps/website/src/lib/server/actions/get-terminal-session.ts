"use server"

import { ensureAuth } from "@/lib/server/auth"
import { getTerminalSession as _getTerminalSession } from "@/lib/server/terminal-session"

export async function getTerminalSession({
  problemId,
  testcaseId,
}: {
  problemId: number
  testcaseId: number
}) {
  const user = await ensureAuth()

  const session = await _getTerminalSession({
    userId: user.id,
    problemId,
    testcaseId,
  })
  return session
}
