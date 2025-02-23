import { db } from "@/server/db"
import {
  submissionTestcases,
  submissions,
  submissionTestcaseQueue,
} from "@/server/db/schema"
import { getProblemInfo, getProblemSlugFromId } from "@/server/utils/problem"
import { unzip } from "@/server/utils/unzip"
import { and, eq, sql } from "drizzle-orm"
import { $ } from "execa"
import { mkdir } from "fs/promises"
import { readFile } from "fs/promises"
import { writeFile } from "fs/promises"
import { z } from "zod"

async function getQueueItem() {
  const item = db.$with("item").as(
    db
      .select({
        submissionId: submissionTestcaseQueue.submissionId,
        testcaseId: submissionTestcaseQueue.testcaseId,
      })
      .from(submissionTestcaseQueue)
      .where(eq(submissionTestcaseQueue.status, "pending"))
      .limit(1),
  )

  const updated_item = await db
    .with(item)
    .update(submissionTestcaseQueue)
    .set({ status: "running" })
    .where(
      and(
        eq(
          submissionTestcaseQueue.submissionId,
          sql`(select ${item.submissionId} from ${item})`,
        ),
        eq(
          submissionTestcaseQueue.testcaseId,
          sql`(select ${item.testcaseId} from ${item})`,
        ),
      ),
    )
    .returning({
      submissionId: submissionTestcaseQueue.submissionId,
      testcaseId: submissionTestcaseQueue.testcaseId,
      input: submissionTestcaseQueue.input,
    })

  if (updated_item.length === 0) return null

  return updated_item[0]
}

const OutputJsonSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
  exit_code: z.number(),
  fs_zip_base64: z.string(),
})

async function processQueueItem(
  item: NonNullable<Awaited<ReturnType<typeof getQueueItem>>>,
) {
  console.log("Processing queue item", item)
  const problemId = (
    await db
      .select({ problemId: submissions.problemId })
      .from(submissions)
      .where(eq(submissions.id, item.submissionId))
      .limit(1)
  )[0]?.problemId
  if (!problemId) throw new Error("Submission not found")

  const problemSlug = await getProblemSlugFromId(problemId)

  const problem = await getProblemInfo(problemSlug)

  const containerName = `easyshell-${problemSlug}-${item.testcaseId}-submission-${item.submissionId}`
  const inputFilePath = `.easyshell/inputs/${containerName}.sh`
  const outputFilePath = `.easyshell/outputs/${containerName}.json`
  const image = `easyshell-${problemSlug}-${item.testcaseId}`

  await writeFile(inputFilePath, item.input)
  await writeFile(outputFilePath, "")

  console.log("Running submission", containerName)
  const startedAt = new Date()

  const inputFilePathForDocker = process.env.DIND_HOST_PREFIX
    ? `${process.env.DIND_HOST_PREFIX}/${inputFilePath}`
    : inputFilePath

  const outputFilePathForDocker = process.env.DIND_HOST_PREFIX
    ? `${process.env.DIND_HOST_PREFIX}/${outputFilePath}`
    : outputFilePath

  await $`docker run --rm --name ${containerName} -v ${inputFilePathForDocker}:/input.sh -v ${outputFilePathForDocker}:/output.json --entrypoint /submission-runner --net easyshell -m 10m --cpus 0.1 ${image}`
  const finishedAt = new Date()
  console.log("Submission complete", containerName)

  const output = OutputJsonSchema.parse(
    JSON.parse(await readFile(outputFilePath, { encoding: "utf-8" })),
  )

  console.log("Output", output)

  const fs =
    output.fs_zip_base64.length === 0
      ? await unzip(output.fs_zip_base64)
      : undefined

  const testcase = problem.testcases.find((t) => t.id === item.testcaseId)
  if (!testcase) throw new Error("Testcase not found")

  let passed = true
  if (passed && testcase.expected_stdout !== undefined)
    passed = output.stdout === testcase.expected_stdout

  if (passed && testcase.expected_stderr !== undefined)
    passed = passed && output.stderr === testcase.expected_stderr

  if (passed && testcase.expected_exit_code !== undefined)
    passed = output.exit_code === testcase.expected_exit_code

  if (passed && testcase.expected_fs !== undefined) {
    if (fs === undefined) {
      passed = false
    } else {
      for (const [path, expected] of Object.entries(testcase.expected_fs)) {
        const actual = fs[path]
        if (actual !== expected) {
          passed = false
          break
        }
      }
    }
  }

  await db.insert(submissionTestcases).values({
    submissionId: item.submissionId,
    testcaseId: item.testcaseId,
    input: item.input,
    stdout: output.stdout,
    stderr: output.stderr,
    exitCode: output.exit_code,
    fsZipBase64: output.fs_zip_base64,
    startedAt,
    finishedAt,
    passed,
  })

  await db
    .update(submissionTestcaseQueue)
    .set({ status: "finished" })
    .where(
      and(
        eq(submissionTestcaseQueue.submissionId, item.submissionId),
        eq(submissionTestcaseQueue.testcaseId, item.testcaseId),
      ),
    )
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function init() {
  await mkdir(".easyshell/inputs", { recursive: true })
  await mkdir(".easyshell/outputs", { recursive: true })
}

async function loop() {
  while (true) {
    const item = await getQueueItem()
    if (!item) {
      await sleep(5000)
      continue
    }
    await processQueueItem(item)
  }
}

async function main() {
  await init()
  await loop()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
