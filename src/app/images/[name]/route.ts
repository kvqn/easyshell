import { decode } from "base64-arraybuffer"
import { eq } from "drizzle-orm"

import { db } from "@/server/db"
import { images } from "@/server/db/schema"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params

  const base64 = (
    await db
      .select({ base64: images.base64 })
      .from(images)
      .where(eq(images.name, name))
      .limit(1)
  )[0]?.base64

  if (!base64) {
    return new Response(null, { status: 404 })
  }

  const bytes = decode(base64)

  return new Response(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  })
}
