import { env } from "@/env"

import * as schema from "./schema"

import { Pool } from "@prisma/pg-worker"
import { drizzle } from "drizzle-orm/node-postgres"

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle({ client: pool, schema, logger: false })
