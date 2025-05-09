"use server"

import { getProblemDifficulty as _getProblemDifficulty } from "@/lib/server/problems"

export async function getProblemDifficulty(slug: string) {
  return await _getProblemDifficulty(slug)
}
