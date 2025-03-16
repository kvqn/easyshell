import {
  accounts,
  bookmarks,
  submissionTestcaseQueue,
  submissionTestcases,
  submissions,
  terminalSessionLogs,
  terminalSessions,
} from "@easyshell/db/schema"

import { db } from "@/db"
import { getProblemSlugFromId } from "@/lib/server/problems"
import { sessionManagerIsRunning } from "@/lib/server/session-manager"

import { and, asc, desc, eq, isNull } from "drizzle-orm"

export async function getActiveTerminalSession({
  userId,
  problemId,
  testcaseId,
}: {
  userId: string
  problemId: number
  testcaseId: number
}) {
  const problemSlug = await getProblemSlugFromId(problemId)

  const session = await db
    .select()
    .from(terminalSessions)
    .where(
      and(
        eq(terminalSessions.userId, userId),
        eq(terminalSessions.problemId, problemId),
        eq(terminalSessions.testcaseId, testcaseId),
        isNull(terminalSessions.deletedAt),
      ),
    )
    .limit(1)

  if (!session[0]) return null

  const container_name = `easyshell-${problemSlug}-${testcaseId}-session-${session[0].id}`
  const isRunning = await sessionManagerIsRunning(container_name)

  if (isRunning) return session[0]
  await db
    .update(terminalSessions)
    .set({ deletedAt: new Date() })
    .where(eq(terminalSessions.id, session[0].id))

  return null
}

export async function getTerminalSessionLogs(sessionId: number) {
  let logs = await db
    .select({
      id: terminalSessionLogs.id,
      stdin: terminalSessionLogs.stdin,
      stdout: terminalSessionLogs.stdout,
      stderr: terminalSessionLogs.stderr,
      startedAt: terminalSessionLogs.startedAt,
      finishedAt: terminalSessionLogs.finishedAt,
    })
    .from(terminalSessionLogs)
    .where(eq(terminalSessionLogs.sessionId, sessionId))
    .orderBy(asc(terminalSessionLogs.id))

  logs = logs.map((log) => ({
    ...log,
    stdout: Buffer.from(log.stdout, "latin1").toString("utf-8"),
    stderr: Buffer.from(log.stderr, "latin1").toString("utf-8"),
  }))
  return logs
}

export async function insertTerminalSession({
  problemId,
  userId,
  testcaseId,
}: {
  userId: string
  problemId: number
  testcaseId: number
}) {
  const inserted = await db
    .insert(terminalSessions)
    .values({
      userId: userId,
      problemId: problemId,
      testcaseId: testcaseId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })
    .returning({ id: terminalSessions.id })
  if (!inserted[0]) {
    throw new Error("Failed to insert terminal session")
  }
  return inserted[0].id
}

export async function insertTerminalSessionLog({
  sessionId,
  stdin,
  stdout,
  stderr,
  startedAt,
  finishedAt,
}: {
  sessionId: number
  stdin: string
  stdout: string
  stderr: string
  startedAt: Date
  finishedAt: Date
}) {
  const log = await db
    .insert(terminalSessionLogs)
    .values({
      sessionId: sessionId,
      stdin: stdin,
      stdout: stdout,
      stderr: stderr,
      startedAt: startedAt,
      finishedAt: finishedAt,
    })
    .returning({ id: terminalSessionLogs.id })
  if (!log[0]) {
    throw new Error("Failed to insert terminal session log")
  }
  return log[0].id
}

export async function getUserSubmissions({
  problemId,
  userId,
}: {
  problemId: number
  userId: string
}) {
  const past_submissions = await Promise.all(
    (
      await db
        .select({
          id: submissions.id,
          submittedAt: submissions.submittedAt,
        })
        .from(submissions)
        .where(
          and(
            eq(submissions.problemId, problemId),
            eq(submissions.userId, userId),
          ),
        )
        .orderBy(desc(submissions.submittedAt))
    ).map(async (submission) => {
      const testcases = await db
        .select({
          id: submissionTestcaseQueue.testcaseId,
          status: submissionTestcaseQueue.status,
          passed: submissionTestcases.passed,
        })
        .from(submissionTestcaseQueue)
        .leftJoin(
          submissionTestcases,
          and(
            eq(
              submissionTestcaseQueue.submissionId,
              submissionTestcases.submissionId,
            ),
            eq(
              submissionTestcaseQueue.testcaseId,
              submissionTestcases.testcaseId,
            ),
          ),
        )
        .where(eq(submissionTestcaseQueue.submissionId, submission.id))

      const running = testcases.some((testcase) => testcase.passed === null)
      const passed = !running && testcases.every((testcase) => testcase.passed)

      const resp = {
        ...submission,
        status: running
          ? ("running" as const)
          : passed
            ? ("passed" as const)
            : ("failed" as const),
      }

      return resp
    }),
  )

  return past_submissions
}

export async function isProblemBookmarked({
  problemId,
  userId,
}: {
  problemId: number
  userId: string
}) {
  const result = await db
    .select()
    .from(bookmarks)
    .where(
      and(eq(bookmarks.problemId, problemId), eq(bookmarks.userId, userId)),
    )
    .limit(1)
  return result.length > 0
}

export async function getUserProviders(userId: string) {
  const results = await db
    .select({
      provider: accounts.provider,
    })
    .from(accounts)
    .where(eq(accounts.userId, userId))

  const providers = {
    github: results.some((result) => result.provider === "github"),
    discord: results.some((result) => result.provider === "discord"),
    google: results.some((result) => result.provider === "google"),
  }

  return providers
}
