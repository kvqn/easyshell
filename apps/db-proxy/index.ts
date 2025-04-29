import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { Client } from "pg"

const PORT = 8008

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

const TOKEN = process.env.TOKEN
if (!TOKEN) {
  throw new Error("TOKEN is not defined")
}

const app = new Hono()
const client = new Client(DATABASE_URL)

/**
 * Initializes the PostgreSQL client, sets up the Hono server with a secured `/query` endpoint, and starts listening for requests.
 *
 * The `/query` endpoint accepts POST requests with a JSON body containing a SQL query, parameters, and a method. It requires a valid Bearer token in the `Authorization` header. Depending on the specified method, it executes the query and returns the results as JSON.
 *
 * @remark
 * The SQL query is sanitized by removing semicolons to prevent execution of multiple statements. Unauthorized requests or unknown methods result in error responses.
 */
async function main() {
  await client.connect()

  app.post("/query", async (c) => {
    const key = c.req.header("Authorization")
    if (key !== `Bearer ${TOKEN}`) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    const { sql, params, method } = await c.req.json()

    // prevent multiple queries
    const sqlBody = sql.replace(/;/g, "")

    try {
      if (method === "all") {
        const result = await client.query({
          text: sqlBody,
          values: params,
          rowMode: "array",
        })
        return c.json(result.rows)
      }

      if (method === "execute") {
        const result = await client.query({
          text: sqlBody,
          values: params,
        })
        return c.json(result.rows)
      }

      return c.json({ error: "Unknown method value" }, 500)
    } catch (e) {
      return c.json({ error: "error" }, 500)
    }
  })

  console.log(`Listening on port ${PORT}`)

  serve({
    fetch: app.fetch,
    port: PORT,
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
