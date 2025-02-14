import { readdir } from "fs/promises"
import z from "zod"
import { dockerRun } from "./docker"
import { randomUUID } from "crypto"
import {
  getActiveTerminalSession,
  getTerminalSessionLogs,
  insertTerminalSession,
} from "../db/queries"

const ProblemOutputSchema = z.object({
  stdout: z.string().optional(),
  stderr: z.string().optional(),
  exit_code: z.number().optional(),
  fs: z.record(z.union([z.string(), z.null()])).optional(),
})

const ProblemConfigSchema = z
  .object({
    id: z.number(),
    slug: z.string().refine((val) => RegExp(/^[a-z0-9\-]*[a-z0-9]$/).test(val)),
    title: z
      .string()
      .nonempty()
      .refine((val) => !val.startsWith(" "))
      .refine((val) => !val.endsWith(" ")),
    description: z.string().nonempty(),
    tags: z
      .array(
        z
          .string()
          .nonempty()
          .refine((val) => !val.startsWith(" "))
          .refine((val) => !val.endsWith(" ")),
      )
      .default([]),
    capture_stdout: z.boolean().default(false),
    capture_stderr: z.boolean().default(false),
    capture_exit_code: z.boolean().default(false),
    capture_fs: z.boolean().default(false),
    testcases: z.array(
      z.object({
        id: z.number().positive(),
        folder: z.string(),
        public: z.boolean().default(false),
        expected_stdout: z.string().optional(),
        expected_stderr: z.string().optional(),
        expected_exit_code: z.number().optional(),
        expected_fs: z.record(z.union([z.string(), z.null()])).optional(),
      }),
    ),
  })
  .strict()

export type ProblemConfig = z.infer<typeof ProblemConfigSchema>
export type ProblemOutput = z.infer<typeof ProblemOutputSchema>

/**
 * Read and return the problem config, making sure it is valid.
 */
async function _problemConfig(problem: string) {
  const parse_result = ProblemConfigSchema.safeParse(
    (
      (await import(`~/problems/${problem}/config`)) as {
        default: unknown
      }
    ).default,
  )

  if (!parse_result.success) {
    console.error(parse_result.error)
    throw new Error("Invalid problem config")
  }

  const config = parse_result.data
  if (config.slug !== problem) {
    throw new Error(`Problem slug does not match`)
  }

  return config
}

const ProblemInfoSchema = z.object({
  ...ProblemConfigSchema.shape,
})

export async function getProblemInfo(
  problem: string,
): Promise<z.infer<typeof ProblemInfoSchema>> {
  const config = await _problemConfig(problem)
  return ProblemInfoSchema.parse({ ...config })
}

export async function getProblems() {
  const BASE_DIR = "./problems/"
  const problems = await readdir(BASE_DIR)
  return problems
}

export async function getTestcases(problem: string) {
  const BASE_DIR = `./problems/${problem}/testcases`
  const testcases = await readdir(BASE_DIR)
  return testcases
}

export async function runTerminalSession({
  problemId,
  testcaseId,
  sessionId,
}: {
  problemId: string
  testcaseId: string
  sessionId: string
}) {
  const problemSlug = await getProblemSlugFromId(parseInt(problemId))
  if (!problemSlug) throw new Error("Problem not found")

  await dockerRun({
    image: `easyshell-${problemSlug}-${testcaseId}`,
    entrypoint: "/container-io",
    name: `easyshell-${problemSlug}-${testcaseId}-${sessionId}`,
  })
}

export async function getTerminalSession({
  userId,
  problemId,
  testcaseId,
}: {
  userId: string
  problemId: number
  testcaseId: number
}) {
  let session = await getActiveTerminalSession({
    userId,
    problemId,
    testcaseId,
  })
  if (!session) {
    await createTerminalSession({ userId, problemId, testcaseId })
    session = await getActiveTerminalSession({ userId, problemId, testcaseId })
  }

  if (!session) throw new Error("Failed to create terminal session")

  const logs = await getTerminalSessionLogs(session.id)

  return {
    id: session.id,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    deletedAt: session.deletedAt,
    logs: logs,
  }
}

export async function createTerminalSession({
  userId,
  problemId,
  testcaseId,
}: {
  userId: string
  problemId: number
  testcaseId: number
}) {
  const sessionId = randomUUID()

  await insertTerminalSession({
    sessionId: sessionId,
    userId: userId,
    problemId: problemId,
    testcaseId: testcaseId,
  })

  await runTerminalSession({
    problemId: problemId.toString(),
    testcaseId: testcaseId.toString(),
    sessionId: sessionId,
  })
}

export async function getProblemSlugFromId(problemId: number) {
  const problems = await getProblems()
  for (const problem of problems) {
    const info = await getProblemInfo(problem)
    if (info.id === problemId) {
      return info.slug
    }
  }
  // TODO: throw if not null
  return null
}
