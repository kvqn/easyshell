"use server"

import { getProblemInfo as _getProblemInfo } from "@/server/utils/problem"

export async function getProblemInfo(slug: string) {
  const info = await _getProblemInfo(slug)
  return {
    id: info.id,
    slug: info.slug,
    title: info.title,
    description: info.description,
    tags: info.tags,
    testcases: info.testcases
      .filter((testcase) => testcase.public)
      .map((testcase) => ({
        id: testcase.id,
      })),
  }
}
