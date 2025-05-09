"use server"

import { getWikiMetadata as _getWikiMetadata } from "@/lib/server/wiki"

export async function getWikiMetadata(slug: string) {
  return await _getWikiMetadata(slug)
}
