import * as schema from "@easyshell/db/schema"

import { env } from "@/env"

import axios from "axios"
import { drizzle } from "drizzle-orm/pg-proxy"

const endpoint = `${env.DRIZZLE_PROXY_URL}/query`
const authHeader = `Bearer ${env.DRIZZLE_PROXY_TOKEN}`

export const db = drizzle(
  async (sql, params, method) => {
    try {
      // I have no idea why this doesn't work with fetch()
      const rows: { data: unknown[] } = await axios.post(
        endpoint,
        { sql, params, method },
        {
          headers: {
            Authorization: authHeader,
          },
        },
      )

      return { rows: rows.data }
    } catch (e) {
      console.error("Error during db query", e)
      return { rows: [] }
    }
  },
  {
    schema: schema,
  },
)
