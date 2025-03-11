"use server"

import { db } from "@/db"
import { users } from "@easyshell/db/schema"

import { ensureAuth } from "@/lib/server/auth"
import { checkValidUsername } from "@/lib/utils"

import { eq } from "drizzle-orm"

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

  const existing =
    (await db.select({}).from(users).where(eq(users.name, name)).limit(1))
      .length > 0
  if (existing)
    return {
      success: false,
      message: "Username already taken.",
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
