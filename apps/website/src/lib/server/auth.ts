import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@easyshell/db/schema"

import { db } from "@/db"
import { env } from "@/env"

import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { count, eq } from "drizzle-orm"
import { type DefaultSession } from "next-auth"
import NextAuth from "next-auth"
import { type Adapter } from "next-auth/adapters"
import DiscordProvider from "next-auth/providers/discord"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { redirect } from "next/navigation"
import { z } from "zod"

/**
 * Determine if the name is valid.
 * By default, also checks for uniqueness. Set checkUnique=false to disable this behavior.
 */
export async function isNameValid({
  name,
  checkUnique,
}: {
  name: string
  checkUnique: boolean
}): Promise<
  | { valid: true }
  | {
      valid: false
      error: "too-short" | "too-long" | "invalid-characters" | "already-exists"
    }
> {
  if (name.length > 20) return { valid: false, error: "too-long" }
  if (name.length < 3) return { valid: false, error: "too-short" }
  if (!/^[a-zA-Z][a-zA-Z\d_-]*[a-zA-Z]$/.test(name))
    return { valid: false, error: "invalid-characters" }

  if (checkUnique) {
    const exists = (
      await db.select({}).from(users).where(eq(users.name, name)).limit(1)
    )[0]
    if (exists !== undefined) return { valid: false, error: "already-exists" }
  }

  return { valid: true }
}

/**
 * Generates a valid username from an existing username that might be invalid.
 * It also checks for uniqueness, i.e. if the name already exists, a unique suffix is added.
 */
async function generateValidName(name: string): Promise<string> {
  let newName = ""
  for (const char of name) {
    if (/[a-zA-Z0-9_-]/.test(char)) {
      newName += char
    }
    if (char === " ") {
      newName += "_"
    } else {
      newName += "-"
    }
  }

  if (!(await isNameValid({ name: newName, checkUnique: false })).valid) {
    return await generateAnonymousName()
  }

  return newName
}

async function generateAnonymousName(): Promise<string> {
  const userCount = await db
    .select({
      count: count(),
    })
    .from(users)

  const name = `user-${userCount[0]!.count + 1}`
  return name
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      name: string
    } & DefaultSession["user"]
  }
}

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    session: (ctx) => {
      console.log("callback:session", ctx)
      const { session, user } = ctx
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      }
    },
    async signIn(ctx) {
      console.log("callback:signIn", ctx)
      const { user, account, profile, email, credentials } = ctx

      const parsedUser = UserSchema.safeParse(user)
      if (!parsedUser.success) return "/couldnt-sign-in"

      const parsedUserData = parsedUser.data

      const statusNameValid = await isNameValid({
        name: parsedUserData.name,
        checkUnique: false,
      })

      if (!statusNameValid.valid) {
        const newName = await generateValidName(parsedUserData.name)
        await db
          .update(users)
          .set({
            name: newName,
          })
          .where(eq(users.id, parsedUserData.id))
      }

      return true
    },
    async jwt(ctx) {
      console.log("callback:jwt", ctx)
      const { token, user, account, profile, isNewUser } = ctx
      return token
    },
  },
  events: {
    async signIn(event) {
      console.log("event:signIn", event)
    },
    async signOut(event) {
      console.log("event:signOut", event)
    },
    async createUser(event) {
      console.log("event:createUser", event)
    },
    async updateUser(event) {
      console.log("event:updateUser", event)
    },
    async linkAccount(event) {
      console.log("event:linkAccount", event)
    },
    async session(event) {
      console.log("event:session", event)
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
})

/**
 * DEPRECATED
 */
export async function ensureAuth(callbackUrl = "/") {
  const session = await auth()
  if (!session) redirect(`/login?callback=${callbackUrl}`)
  const user = (
    await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)
  )[0]
  if (!user) redirect("/login")
  if (!user.name) {
    const userCount = await db
      .select({
        count: count(),
      })
      .from(users)

    user.name = `user-${userCount[0]!.count + 1}`
    await db
      .update(users)
      .set({
        name: user.name,
      })
      .where(eq(users.id, user.id))
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image ?? undefined,
  }
}
