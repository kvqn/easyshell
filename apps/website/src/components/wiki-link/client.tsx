"use client"

import { getWikiMetadata } from "@/lib/server/actions/get-wiki-metadata"

import { WikiLinkBase } from "."

import { useEffect, useState } from "react"

export function WikiLink({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const [metadata, setMetadata] =
    useState<Awaited<ReturnType<typeof getWikiMetadata>>>(null)

  useEffect(() => {
    void (async () => {
      setMetadata(await getWikiMetadata(slug))
    })()
  }, [slug])

  return <WikiLinkBase slug={slug} metadata={metadata} className={className} />
}
