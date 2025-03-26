import { ProblemInfoSchema } from "@easyshell/problems/schema"

import data from "./problems.autogenerated.js"

import { z } from "zod"

const DataSchema = z.record(
  z.string(),
  z.object({
    info: ProblemInfoSchema,
  }),
)

const parsedData = DataSchema.parse(data)

export async function getProblemInfo(
  problem: string,
): Promise<z.infer<typeof ProblemInfoSchema>> {
  const config = parsedData[problem]?.info
  if (!config) throw new Error("Problem not found")
  return config
}

export async function getProblems() {
  return Object.keys(parsedData)
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
