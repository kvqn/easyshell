import { env } from "@easyshell/env"
import { readFile } from "fs/promises"
import { readdir } from "fs/promises"
import { z } from "zod"

//if (!process.env.PROBLEMS_DIR) throw "PROBLEMS_DIR is required"
const PROBLEMS_DIR = env.PROBLEMS_DIR ?? `./problems`
//const PROBLEMS_DIR = join(import.meta.dir, "../../problems")
const PROBLEMS_IMPORT_DIR = "./problems"

const FsSchema = z.record(z.union([z.string(), z.null()]))
export type FsType = z.infer<typeof FsSchema>

//const ProblemOutputSchema = z.object({ // TODO: remove this
//  stdout: z.string().optional(),
//  stderr: z.string().optional(),
//  exit_code: z.number().optional(),
//  fs: FsSchema.optional(),
//})

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
    testcases: z.array(
      z.object({
        id: z.number().positive(),
        folder: z.string(),
        public: z.boolean().default(false),
        expected_stdout: z.string().optional(),
        expected_stderr: z.string().optional(),
        expected_exit_code: z.number().optional(),
        expected_fs: FsSchema.optional(),
      }),
    ),
    tests: z
      .array(
        z.object({
          testcase: z.number().positive().or(z.literal("all")),
          input: z.string(),
          pass: z.boolean(),
        }),
      )
      .optional(),
  })
  .strict()

export type ProblemConfig = z.infer<typeof ProblemConfigSchema>
//export type ProblemOutput = z.infer<typeof ProblemOutputSchema> // TODO: remove this

/**
 * Read and return the problem config, making sure it is valid.
 */
async function _problemConfig(problem: string) {
  const parse_result = ProblemConfigSchema.safeParse(
    (
      (await import(`${PROBLEMS_IMPORT_DIR}/${problem}/config`)) as {
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
  const problems = await readdir(PROBLEMS_DIR)
  return problems
}

export async function getProblemSlugFromId(problemId: number) {
  const problems = await getProblems()
  for (const problem of problems) {
    const info = await getProblemInfo(problem)
    if (info.id === problemId) {
      return info.slug
    }
  }
  throw new Error("Problem not found")
}

export async function getPublicProblemInfo(slug: string) {
  const info = await getProblemInfo(slug)
  return {
    id: info.id,
    slug: info.slug,
    title: info.title,
    description: info.description,
    tags: info.tags,
  }
}

export async function getPublicTestcaseInfo(slug: string) {
  const info = await getProblemInfo(slug)
  return info.testcases
    .filter((tc) => tc.public)
    .map((tc) => ({
      id: tc.id,
      expected_stdout: tc.expected_stdout,
      expected_stderr: tc.expected_stderr,
      expected_fs: tc.expected_fs,
      expected_exit_code: tc.expected_exit_code,
    }))
}

export async function getProblemBody(slug: string): Promise<string> {
  const path = `${PROBLEMS_DIR}/${slug}/page.mdx`
  return await readFile(path, { encoding: "utf8" })
}

export async function getProblemHintBody(
  slug: string,
  hint: number,
): Promise<string> {
  const path = `${PROBLEMS_DIR}/${slug}/hints/${hint}.mdx`
  return await readFile(path, { encoding: "utf8" })
}

export async function getProblemHintCount(slug: string): Promise<number> {
  return (await readdir(`${PROBLEMS_DIR}/${slug}/hints`)).length
}
