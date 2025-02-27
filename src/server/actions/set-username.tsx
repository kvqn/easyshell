"use server"

import { eq } from "drizzle-orm"

import { checkValidUsername } from "@/lib/utils"
import { ensureAuth } from "@/server/auth"
import { db } from "@/server/db"
import { users } from "@/server/db/schema"

export async function setUsername(name: string): Promise<{
  success: boolean
  message: string
}> {
  const user = await ensureAuth()

  if (name === user.name)
    return {
      success: false,
      message: "You already have that username.",
    }

  const valid = checkValidUsername(name)

  if (!valid)
    return {
      success: false,
      message: "Invalid username.",
    }

  await db
    .update(users)
    .set({
      name: name,
    })
    .where(eq(users.id, user.id))

  return {
    success: true,
    message: "Username updated.",
  }
}
