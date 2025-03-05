import { getProblemInfo, getProblems } from "@easyshell/problems"
import { runSubmissionAndGetOutput } from "@easyshell/queue-processor/utils"
import { PROJECT_ROOT, sleep } from "@easyshell/utils"
import { randomBytes } from "crypto"

import { assertDirExists, assertFileExists } from "./_utils"

async function baseAsserts(
  slug: string,
): Promise<[true, undefined] | [false, string]> {
  const PROBLEM_DIR = `${PROJECT_ROOT}/problems/${slug}`

  try {
    await assertDirExists(PROBLEM_DIR)
    await assertDirExists(`${PROBLEM_DIR}/testcases`)
    await assertDirExists(`${PROBLEM_DIR}/hints`)
    await assertFileExists(`${PROBLEM_DIR}/page.mdx`)
    await assertFileExists(`${PROBLEM_DIR}/config.ts`)
  } catch (error) {
    if (error instanceof Error) return [false, error.message]
    return [false, "An error occurred"]
  }
  return [true, undefined]
}

async function constructTests(slug: string) {
  const tests: Array<{
    name: string
    callable: () => Promise<[true, undefined] | [false, string]>
  }> = []

  tests.push({
    name: `(${slug}) base asserts`,
    callable: async () => baseAsserts(slug),
  })

  const problemInfo = await getProblemInfo(slug)

  if (!problemInfo.tests) problemInfo.tests = []
  problemInfo.tests.push({ testcase: "all", pass: false, input: "" })

  for (const { testcase, input, pass } of problemInfo.tests) {
    if (testcase === "all") {
      for (const { id: testcaseId } of problemInfo.testcases) {
        tests.push({
          name: `(${slug}) testcase-${testcaseId}`,
          callable: async () =>
            runSubmissionTest(slug, testcaseId, input, pass),
        })
      }
    } else if (testcase instanceof Array) {
      for (const testcaseId of testcase) {
        tests.push({
          name: `(${slug}) testcase-${testcaseId}`,
          callable: async () =>
            runSubmissionTest(slug, testcaseId, input, pass),
        })
      }
    } else {
      tests.push({
        name: `(${slug}) testcase-${testcase}`,
        callable: async () => runSubmissionTest(slug, testcase, input, pass),
      })
    }
  }

  return tests
}

async function runSubmissionTest(
  slug: string,
  testcase: number,
  input: string,
  pass: boolean,
): Promise<[true, undefined] | [false, string]> {
  const { passed } = await runSubmissionAndGetOutput({
    problemSlug: slug,
    testcaseId: testcase,
    input,
    suffix: `test-${randomBytes(8).toString("hex")}`,
  })
  if (passed !== pass)
    return [false, `expected to ${pass ? "pass" : "fail"} with input: ${input}`]
  return [true, undefined]
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

const tests: Awaited<ReturnType<typeof constructTests>> = []

if (arg === "all") {
  for (const problem of await getProblems()) {
    tests.push(...(await constructTests(problem)))
  }
} else {
  tests.push(...(await constructTests(arg)))
}

let total = tests.length
let failed = 0
let passed = 0

const PARALLEL_LIMIT = 20

let parallel = 0
let index = 0

async function runTest(test: (typeof tests)[number]) {
  const [result, message] = await test.callable()
  if (result) {
    passed++
  } else {
    failed++
    console.error(`\rFailed Test : ${test.name}\n\t${message}`)
  }
  parallel--
}

const promises: Array<Promise<void>> = []

const startedAt = new Date()

while (index < total) {
  while (parallel >= PARALLEL_LIMIT) await sleep(100)
  parallel++
  promises.push(runTest(tests[index]!))
  index++
}

await Promise.all(promises)

const endedAt = new Date()

console.log(`Total: ${total}, Passed: ${passed}, Failed: ${failed}`)
console.log(`Took ${(endedAt.getTime() - startedAt.getTime()) / 1000} seconds`)

if (failed > 0) {
  process.exit(1)
}
