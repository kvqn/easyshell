"use server"

import { db } from "@/server/db"
import { submission_testcases } from "../db/schema"
import { and, eq } from "drizzle-orm"
import { getSubmissionInfo } from "./get-submission-info"
import { getProblemInfo, getProblemSlugFromId } from "../utils/problem"
import { unzip } from "../utils/unzip"

export async function getTestcaseInfo({
  submissionId,
  testcaseId,
}: {
  submissionId: number
  testcaseId: number
}) {
  const _dataFromDb = await db
    .select({
      input: submission_testcases.input,
      stdout: submission_testcases.stdout,
      stderr: submission_testcases.stderr,
      exitCode: submission_testcases.exitCode,
      fsZipBase64: submission_testcases.fsZipBase64,
      startedAt: submission_testcases.startedAt,
      finishedAt: submission_testcases.finishedAt,
      passed: submission_testcases.passed,
    })
    .from(submission_testcases)
    .where(
      and(
        eq(submission_testcases.submissionId, submissionId),
        eq(submission_testcases.testcaseId, testcaseId),
      ),
    )
    .limit(1)

  if (_dataFromDb.length === 0) {
    throw new Error("Testcase not found")
  }

  const dataFromDb = _dataFromDb[0]!

  const fs = dataFromDb.fsZipBase64
    ? await unzip(dataFromDb.fsZipBase64)
    : undefined

  const submission = await getSubmissionInfo({ submissionId })

  const problemSlug = await getProblemSlugFromId(
    submission.submission.problemId,
  )
  if (!problemSlug) throw new Error("Problem not found")

  const problem = await getProblemInfo(problemSlug)
  const testcase = problem.testcases.find((t) => t.id === testcaseId)
  if (!testcase)
    throw new Error("CRITITCAL: Testcase not found (This should not happen)")

  const testcaseInfo = {
    input: dataFromDb.input,
    stdout: dataFromDb.stdout,
    stderr: dataFromDb.stderr,
    exitCode: dataFromDb.exitCode,
    fs,
    passed: dataFromDb.passed,
    expected_stdout: testcase.expected_stdout,
    expected_stderr: testcase.expected_stderr,
    expected_exit_code: testcase.expected_exit_code,
    expected_fs: testcase.expected_fs,
  }

  return testcaseInfo
}
