import { getProblemInfo, getProblems } from "@easyshell/problems"
import { runSubmissionAndGetOutput } from "@easyshell/queue-processor/utils"
import { PROJECT_ROOT } from "@easyshell/utils"
import { randomBytes } from "crypto"

import { assertDirExists, assertFileExists } from "./_utils"

async function runSubmissionTests(slug: string) {
  const PROBLEM_DIR = `${PROJECT_ROOT}/problems/${slug}`

  await assertDirExists(PROBLEM_DIR)
  await assertDirExists(`${PROBLEM_DIR}/testcases`)
  await assertDirExists(`${PROBLEM_DIR}/hints`)
  await assertFileExists(`${PROBLEM_DIR}/page.mdx`)
  await assertFileExists(`${PROBLEM_DIR}/config.ts`)

  const problemInfo = await getProblemInfo(slug)

  let passedCount = 0
  let failedCount = 0

  if (!problemInfo.tests || problemInfo.tests.length === 0) {
    console.warn(`No tests have been defined for ${slug}`)
    return
  }

  const tests: Array<{ testcase: number; input: string; pass: boolean }> = []
  for (const { testcase, input, pass } of problemInfo.tests) {
    if (testcase === "all") {
      for (const { id: testcaseId } of problemInfo.testcases) {
        tests.push({ testcase: testcaseId, input, pass })
      }
    } else {
      tests.push({ testcase, input, pass })
    }
  }

  for (const { testcase, input, pass } of tests) {
    const { passed } = await runSubmissionAndGetOutput({
      problemSlug: slug,
      testcaseId: testcase,
      input,
      suffix: `test-${randomBytes(8).toString("hex")}`,
    })
    if (passed === pass) {
      passedCount++
      console.log(`Testcase ${testcase} passed`)
    } else {
      failedCount++
      console.log(`Testcase ${testcase} failed`)
    }
  }
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error(
    "Provide a problem slug to test. Type 'all'to test all problems.",
  )
  process.exit(1)
}

if (args.length > 1) {
  console.error("Too many arguments provided.")
  process.exit(1)
}

const arg = args[0]!

if (arg === "all") {
  const problems = await getProblems()
  for (const problem of problems) {
    console.log(`Testing ${problem}`)
    await runSubmissionTests(problem)
  }
} else {
  await runSubmissionTests(arg)
}

// await runSubmissionTests("say-hello")
