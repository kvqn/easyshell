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
    await assertDirExists(`${PROBLEM_DIR}/testcases`)
    await assertDirExists(`${PROBLEM_DIR}/hints`)
    await assertFileExists(`${PROBLEM_DIR}/page.mdx`)
    await assertFileExists(`${PROBLEM_DIR}/config.ts`)

    const info = await getProblemInfo(problemSlug)

    if (info.slug !== problemSlug) {
      throw new Error(`Problem slug mismatch: ${info.slug} !== ${problemSlug}`)
    }

    if (existingProblemIds.has(info.id)) {
      throw new Error(`Duplicate problem ID: ${info.id}`)
    }

    existingProblemIds.add(info.id)
  }

  console.log("Problems seem good.")
}

await checkProblems()
