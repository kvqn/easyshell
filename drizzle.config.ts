import { type Config } from "drizzle-kit"

if (!process.env.DATABASE_URL) throw "DATABASE_URL is required"

export default {
  schema: "./packages/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  tablesFilter: ["easyshell_*"],
} satisfies Config
