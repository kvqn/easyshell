"use server"

import { db } from "@/db"
import { submissionTestcaseQueue, submissions } from "@easyshell/db/schema"

import { ensureAuth } from "@/lib/server/auth"
import { getProblemInfo, getProblemSlugFromId } from "@/lib/server/problems"

export async function newSubmission({
  problemId,
  input,
}: {
  problemId: number
  input: string
}) {
  const user = await ensureAuth()
  const problemSlug = await getProblemSlugFromId(problemId)

  const submissionId = (
    await db
      .insert(submissions)
      .values({
        problemId: problemId,
        userId: user.id,
        input: input,
      })
      .returning({ id: submissions.id })
  )[0]?.id

  if (!submissionId) {
    throw new Error("Failed to create submission")
  }

  const problem = await getProblemInfo(problemSlug)
  // TODO: parallelize this
  for (const testcase of problem.testcases) {
    await db.insert(submissionTestcaseQueue).values({
      submissionId: submissionId,
      testcaseId: testcase.id,
      status: "pending",
    })
  }

  return {
    submissionId: submissionId,
  }
}
