"use server"

import { users } from "@easyshell/db/schema"

import { db } from "@/db"
import { ensureAuth, isUsernameValid } from "@/lib/server/auth"

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

  const valid = await isUsernameValid({ username: name, checkUnique: false })

  if (!valid.valid)
    return {
      success: false,
      message: `Invalid Username (${valid.error})`,
    }

  const existing =
    (await db.select({}).from(users).where(eq(users.username, name)).limit(1))
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
