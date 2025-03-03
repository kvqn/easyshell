import { getProblemInfo, getProblems } from "@/server/utils/problem"

export async function checkProblems() {
  const problemSlugs = await getProblems()

  const existingProblemIds = new Set<number>()

  for (const problemSlug of problemSlugs) {
    const info = await getProblemInfo(problemSlug)

    if (info.slug !== problemSlug) {
      throw new Error(`Problem slug mismatch: ${info.slug} !== ${problemSlug}`)
    }

    if (info.id in existingProblemIds) {
      throw new Error(`Duplicate problem ID: ${info.id}`)
    }

    existingProblemIds.add(info.id)
  }

  console.log("Problems seem good.")
}

await checkProblems()
