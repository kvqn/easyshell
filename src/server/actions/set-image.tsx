"use server"

import { encode } from "base64-arraybuffer"
import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"
import sharp from "sharp"

import { ensureAuth } from "@/server/auth"
import { db } from "@/server/db"
import { images, users } from "@/server/db/schema"

export async function setUserImage(file: File): Promise<{
  success: boolean
  message: string
}> {
  try {
    const { id: userId } = await ensureAuth()

    const processedImageBlob: Buffer = await sharp(await file.arrayBuffer())
      .resize(400, 400)
      .toFormat("jpeg")
      .toBuffer()

    const base64 = encode(processedImageBlob.buffer as ArrayBuffer)

    const name = `${randomUUID()}.jpg`

    await db.insert(images).values({
      name,
      base64,
      uploadedBy: userId,
    })

    await db
      .update(users)
      .set({
        image: `/images/${name}`,
      })
      .where(eq(users.id, userId))

    return {
      success: true,
      message: "Image uploaded successfully",
    }
  } catch (e) {
    console.error(e)
    return {
      success: false,
      message: "Failed to upload image",
    }
  }
}
