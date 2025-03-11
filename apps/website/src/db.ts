import * as schema from "@easyshell/db/schema"

import { env } from "@/env"

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

const conn = neon(env.DATABASE_URL)

export const db = drizzle({ client: conn, schema, logger: false })
