"use server"

import { users } from "@easyshell/db/schema"

import { db } from "@/db"
import { auth, isUsernameValid } from "@/lib/server/auth"

import { eq } from "drizzle-orm"

export async function changeUsername(username: string): Promise<{
  success: boolean
  message: string
}> {
  const user = (await auth())?.user
  if (!user) return

  if (username === user.username)
    return {
      success: false,
      message: "You already have that username.",
    }

  const valid = await isUsernameValid({
    username: username,
    checkUnique: false,
  })

  if (!valid.valid)
    return {
      success: false,
      message: `Invalid Username (${valid.error})`,
    }

  const existing =
    (
      await db
        .select({})
        .from(users)
        .where(eq(users.username, username))
        .limit(1)
    ).length > 0
  if (existing)
    return {
      success: false,
      message: "Username already taken.",
    }

  await db
    .update(users)
    .set({
      username: username,
    })
    .where(eq(users.id, user.id))

  return {
    success: true,
    message: "Username updated.",
  }
}
