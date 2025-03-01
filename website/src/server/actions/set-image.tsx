"use server"

import { encode } from "base64-arraybuffer"
import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"
import sharp from "sharp"

import { neverThrow } from "@/lib/utils"
import { ensureAuth } from "@/server/auth"
import { db } from "@/server/db"
import { images, users } from "@/server/db/schema"

export async function setUserImage(file: File): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (file.size > 1024 * 1024) {
      return {
        success: false,
        message: "Image size must be less than 1MB",
      }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Invalid file type.",
      }
    }

    const { id: userId } = await ensureAuth()

    const { data: processedImageBlob, error: processingError } =
      await neverThrow(
        sharp(await file.arrayBuffer())
          .resize(400, 400)
          .toFormat("jpeg")
          .toBuffer(),
      )

    if (processingError)
      return {
        success: false,
        message: "Could not process the image.",
      }

    const base64 = encode(processedImageBlob.buffer as ArrayBuffer)
    const name = `${randomUUID()}.jpg`

    await db.transaction(async (tx) => {
      await tx.insert(images).values({
        name,
        base64,
        uploadedBy: userId,
      })

      await tx
        .update(users)
        .set({
          image: `/images/${name}`,
        })
        .where(eq(users.id, userId))
    })

    return {
      success: true,
      message: "Image uploaded successfully.",
    }
  } catch {
    return {
      success: false,
      message: "An unknown error occured.",
    }
  }
}
