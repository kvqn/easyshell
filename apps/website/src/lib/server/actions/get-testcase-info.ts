"use server"

import { submissionTestcases, submissions } from "@easyshell/db/schema"

import { db } from "@/db"
import { getProblemInfo, getProblemSlugFromId } from "@/lib/server/problems"

import { getSubmissionInfo } from "./get-submission-info"

import { and, eq } from "drizzle-orm"

export async function getTestcaseInfo({
  submissionId,
  testcaseId,
}: {
  submissionId: number
  testcaseId: number
}) {
  const _dataFromDb = await db
    .select({
      input: submissions.input,
      stdout: submissionTestcases.stdout,
      stderr: submissionTestcases.stderr,
      exitCode: submissionTestcases.exitCode,
      fs: submissionTestcases.fs,
      startedAt: submissionTestcases.startedAt,
      finishedAt: submissionTestcases.finishedAt,
      passed: submissionTestcases.passed,
    })
    .from(submissionTestcases)
    .where(
      and(
        eq(submissionTestcases.submissionId, submissionId),
        eq(submissionTestcases.testcaseId, testcaseId),
      ),
    )
    .limit(1)
    .innerJoin(
      submissions,
      eq(submissions.id, submissionTestcases.submissionId),
    )

  if (_dataFromDb.length === 0) {
    throw new Error("Testcase not found")
  }

  const dataFromDb = _dataFromDb[0]!

  const submission = await getSubmissionInfo({ submissionId })

  const problemSlug = await getProblemSlugFromId(
    submission.submission.problemId,
  )

  const problem = await getProblemInfo(problemSlug)
  const testcase = problem.testcases.find((t) => t.id === testcaseId)
  if (!testcase)
    throw new Error("CRITITCAL: Testcase not found (This should not happen)")

  const testcaseInfo = {
    input: dataFromDb.input,
    stdout: dataFromDb.stdout,
    stderr: dataFromDb.stderr,
    exitCode: dataFromDb.exitCode,
    fs: dataFromDb.fs,
    passed: dataFromDb.passed,
    expected_stdout: testcase.expected_stdout,
    expected_stderr: testcase.expected_stderr,
    expected_exit_code: testcase.expected_exit_code,
    expected_fs: testcase.expected_fs,
  }

  return testcaseInfo
}
