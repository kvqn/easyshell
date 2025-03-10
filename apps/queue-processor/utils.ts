import { env } from "@easyshell/env"
import { getProblemInfo } from "@easyshell/problems"
import { unzip } from "@easyshell/utils"

import { $ } from "execa"
import { writeFile } from "fs/promises"
import { mkdir } from "fs/promises"
import { readFile } from "fs/promises"
import { z } from "zod"

await mkdir(`${env.WORKING_DIR_DOCKER}/inputs`, { recursive: true })
await mkdir(`${env.WORKING_DIR_DOCKER}/outputs`, { recursive: true })

const OutputJsonSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
  exit_code: z.number(),
  fs_zip_base64: z.string(),
})

export async function runSubmissionAndGetOutput({
  problemSlug,
  testcaseId,
  input,
  suffix,
}: {
  problemSlug: string
  testcaseId: number
  input: string
  suffix: string
}) {
  const problem = await getProblemInfo(problemSlug)

  const containerName = `easyshell-${problemSlug}-${testcaseId}-${suffix}`

  const inputFileName = `${containerName}.sh`
  const outputFileName = `${containerName}.json`

  const inputFilePath = `${env.WORKING_DIR_DOCKER}/inputs/${containerName}.sh`
  const outputFilePath = `${env.WORKING_DIR_DOCKER}/outputs/${containerName}.json`

  const image = `easyshell-${problemSlug}-${testcaseId}`

  await writeFile(inputFilePath, input)
  await writeFile(outputFilePath, "")

  const startedAt = new Date()

  const inputFilePathForDocker = `${env.WORKING_DIR_HOST}/inputs/${inputFileName}`
  const outputFilePathForDocker = `${env.WORKING_DIR_HOST}/outputs/${outputFileName}`

  await $`docker run --rm --name ${containerName} -v ${inputFilePathForDocker}:/input.sh -v ${outputFilePathForDocker}:/output.json --net easyshell -m 10m --cpus 0.1 ${image} -mode submission`
  const finishedAt = new Date()

  const output = OutputJsonSchema.parse(
    JSON.parse(await readFile(outputFilePath, { encoding: "utf-8" })),
  )

  const fs =
    output.fs_zip_base64.length !== 0 ? await unzip(output.fs_zip_base64) : {}

  const testcase = problem.testcases.find((t) => t.id === testcaseId)
  if (!testcase) throw new Error("Testcase not found")

  let passed = true
  if (passed && testcase.expected_stdout !== undefined)
    passed =
      output.stdout === testcase.expected_stdout ||
      output.stdout + "\n" === testcase.expected_stdout ||
      output.stdout === testcase.expected_stdout + "\n"

  if (passed && testcase.expected_stderr !== undefined)
    passed = passed && output.stderr === testcase.expected_stderr

  if (passed && testcase.expected_exit_code !== undefined)
    passed = output.exit_code === testcase.expected_exit_code

  if (passed && testcase.expected_fs !== undefined) {
    if (fs === undefined) {
      passed = false
    } else {
      if (Object.keys(fs).length !== Object.keys(testcase.expected_fs).length) {
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
  }

  // console.log("passed", passed)
  // console.log("expected_fs", testcase.expected_fs)
  // console.log("fs", fs)
  // console.log("---")

  return {
    startedAt,
    finishedAt,
    output,
    passed,
  }
}
