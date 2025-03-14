import { getProblemInfo, getProblems } from "@easyshell/problems"
import { PROJECT_ROOT } from "@easyshell/utils"

import { assertDirExists, assertFileExists } from "./_utils"

export async function checkProblems() {
  await assertDirExists(`${PROJECT_ROOT}/problems`)
  const problemSlugs = await getProblems()

  const existingProblemIds = new Set<number>()

  for (const problemSlug of problemSlugs) {
    console.log(`Checking problem: ${problemSlug}`)
    const PROBLEM_DIR = `${PROJECT_ROOT}/problems/${problemSlug}`

    await assertDirExists(PROBLEM_DIR)
    await assertFileExists(`${PROBLEM_DIR}/page.md`)
    await assertFileExists(`${PROBLEM_DIR}/config.ts`)

    const info = await getProblemInfo(problemSlug)

    if (info.slug !== problemSlug) {
      throw new Error(`Problem slug mismatch: ${info.slug} !== ${problemSlug}`)
    }

    if (existingProblemIds.has(info.id)) {
      throw new Error(`Duplicate problem ID: ${info.id}`)
    }

    const existingTestcases = new Set<number>()
    for (const testcase of info.testcases) {
      if (existingTestcases.has(testcase.id)) {
        throw new Error(`Duplicate testcase ID: ${testcase.id}`)
      }
      existingTestcases.add(testcase.id)
    }

    existingProblemIds.add(info.id)
  }

  console.log("Problems seem good.")
}

await checkProblems()
