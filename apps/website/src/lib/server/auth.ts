import { db } from "@easyshell/db"
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@easyshell/db/schema"
import { env } from "@easyshell/env"

import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { count, eq } from "drizzle-orm"
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from "next-auth"
import { type Adapter } from "next-auth/adapters"
import DiscordProvider from "next-auth/providers/discord"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { redirect } from "next/navigation"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"]
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
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
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)

export async function getServerUser() {
  const session = await getServerAuthSession()
  return session?.user
}

export async function ensureAuth() {
  const _user = await getServerUser()
  if (!_user) redirect("/login")
  const user = (
    await db.select().from(users).where(eq(users.id, _user.id)).limit(1)
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
