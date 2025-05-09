import { ClientOnly } from "@/components/client-only"

import { MarkdownClient } from "./client"

import { serialize } from "next-mdx-remote/serialize"

export async function Markdown({ source }: { source: string }) {
  const serialized = await serialize(source)
  return (
    <ClientOnly>
      <MarkdownClient source={serialized} />
    </ClientOnly>
  )
}
