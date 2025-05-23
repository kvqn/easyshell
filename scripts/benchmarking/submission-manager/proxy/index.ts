import { runSubmissionAndGetOutput } from "@easyshell/submission-manager/utils"

import { serve } from "@hono/node-server"
import { Hono } from "hono"

const PORT = 8008

const app = new Hono()

async function main() {
  app.post("/query", async (c) => {
    const { problemSlug, testcaseId, input, suffix } = await c.req.json()

    const output = await runSubmissionAndGetOutput({
      problemSlug,
      testcaseId,
      input,
      suffix,
    })

    return c.json({
      passed: output.passed,
    })
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
