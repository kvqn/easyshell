"use server"

import { auth } from "@/lib/server/auth"
import { getProblemStatus as _getProblemStatus } from "@/lib/server/problems"

export async function getProblemStatus(slug: string) {
  const userId = (await auth())?.user.id
  if (!userId) return undefined

  const status = await _getProblemStatus(slug, userId)
  return status
}
