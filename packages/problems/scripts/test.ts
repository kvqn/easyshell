import { env } from "@easyshell/env"
import { getProblemInfo, getProblems } from "@easyshell/problems"
import { runSubmissionAndGetOutput } from "@easyshell/queue-processor/utils"
import { neverThrow } from "@easyshell/utils"
import { PROBLEMS_DIR, PROJECT_ROOT, WIKI_DIR } from "@easyshell/utils/build"

import { SeriesList } from "../data/series"
import { wiki_pages } from "../data/wiki"
import {
  RunParallelStuff,
  Task,
  assertDirExists,
  assertFileExists,
} from "./_utils"

import { randomBytes } from "crypto"
import { readFile } from "fs/promises"

type Test = {
  name: string
  dependsOn?: string[]
  callable: () => Promise<string | undefined>
}

type TestTree = {
  tests: Test[]
  children?: Array<TestTree | Test>
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error(
      "Provide a problem slug to test. Type 'all' to test all problems. Type 'base' to run base tests.",
    )
    process.exit(1)
  }

  if (args.length > 1) {
    console.error("Too many arguments provided.")
    process.exit(1)
  }

  if (process.env.SKIP_SUBMISSION_TESTS) {
    console.info(
      "Skipping submission tests because SKIP_SUBMISSION_TESTS is set.",
    )
  }

  const arg = args[0]!

  const tests: Array<Test> = await base_tests()

  if (arg === "base") {
    // do nothing
  } else if (arg === "all") {
    for (const problem of await getProblems()) {
      tests.push(...(await construct_tests(problem)))
    }
  } else {
    tests.push(...(await construct_tests(arg)))
  }

  let total = tests.length
  let failed = 0
  let passed = 0

  function test_to_task(test: (typeof tests)[number]): Task {
    return {
      name: test.name,
      callable: async () => {
        const response = await test.callable()
        if (response === undefined) {
          passed++
        } else {
          failed++
          return `${response}`
        }
      },
    }
  }

  const tasks = tests.map(test_to_task)

  const startedAt = new Date()

  await RunParallelStuff({
    tasks,
    parallel_limit: env.PARALLEL_LIMIT_TEST,
  })

  const endedAt = new Date()

  console.log(`Total: ${total}, Passed: ${passed}, Failed: ${failed}`)
  console.log(
    `Took ${(endedAt.getTime() - startedAt.getTime()) / 1000} seconds`,
  )

  if (failed > 0) {
    process.exit(1)
  }
}

function TestTreeToTests(tree: TestTree): Array<Test> {
  const final_tests = Array<Test>()

  function traverse(tree: TestTree, dependsOn: string[] = []) {
    const { tests, children } = tree
    for (const test of tests) {
      final_tests.push({
        name: test.name,
        dependsOn,
        callable: test.callable,
      })
    }
    for (const child of children || []) {
      if ("tests" in child)
        traverse(
          child,
          tests.map((test) => test.name),
        )
      else
        final_tests.push({
          name: child.name,
          dependsOn: tests.map((test) => test.name),
          callable: child.callable,
        })
    }
  }

  traverse(tree)
  return final_tests
}

async function base_tests(): Promise<Array<Test>> {
  const tree: TestTree = {
    tests: [],
    children: [
      {
        name: "assert problems dir exists",
        callable: async () => {
          const { error } = await neverThrow(assertDirExists(PROBLEMS_DIR))
          if (error) return error.message
        },
      },
      {
        name: "series",
        callable: async () => {
          if (
            new Set(SeriesList.map((s) => s.slug)).size !== SeriesList.length
          ) {
            return "duplicate series slugs"
          }

          const problems = await getProblems()
          for (const series of SeriesList) {
            if (new Set(series.problems).size !== series.problems.length) {
              return `(series: ${series.slug}) duplicate problem slugs`
            }

            for (const problemSlug of series.problems) {
              if (!problems.includes(problemSlug))
                return `(series: ${series.slug}) problem slug ${problemSlug} not found`
            }
          }
        },
      },
      {
        name: "(unique problem slugs)",
        callable: async () => {
          const problems = await getProblems()
          const problem_slugs = new Set<string>()
          const duplicates = new Set<string>()
          for (const problem of problems) {
            if (problem_slugs.has(problem)) {
              duplicates.add(problem)
            }
            problem_slugs.add(problem)
          }
          if (duplicates.size > 0)
            return `duplicate problem slugs: ${Array.from(duplicates).join(
              ", ",
            )}`
        },
      },
      {
        name: "(unique problem ids)",
        callable: async () => {
          const problems = await getProblems()
          const id_map = new Map<number, Set<string>>()
          for (const problem of problems) {
            const { error, data } = await neverThrow(getProblemInfo(problem))
            if (error) return error.message
            if (!data) return `no data found for problem ${problem}`
            if (id_map.has(data.id)) {
              id_map.get(data.id)!.add(problem)
            } else {
              id_map.set(data.id, new Set([problem]))
            }
          }
          const duplicates = Array.from(id_map.entries()).filter(
            ([_, problems]) => problems.size > 1,
          )
          if (duplicates.length > 0) {
            return `duplicates found: ${duplicates
              .map(
                ([id, problems]) => `${id}: ${Array.from(problems).join(", ")}`,
              )
              .join("; ")}`
          }
        },
      },
      {
        tests: [
          {
            name: "assert wiki index.ts exists",
            callable: async () => {
              const { error } = await neverThrow(
                assertFileExists(`${WIKI_DIR}/index.ts`),
              )
              if (error) return error.message
            },
          },
          {
            name: "assert wiki pages exists",
            callable: async () => {
              const { error } = await neverThrow(
                assertDirExists(`${WIKI_DIR}/pages`),
              )
              if (error) return error.message
            },
          },
        ],
        children: wiki_pages.map((page) => ({
          tests: [
            {
              name: `(wiki ${page.slug}) assert valid body`,
              callable: async () => {
                const body_path = `${WIKI_DIR}/pages/${page.slug}.mdx`
                const { error } = await neverThrow(assertFileExists(body_path))
                if (error) return error.message

                const text = await readFile(body_path, { encoding: "utf-8" })
                if (text.trim().length === 0) return "body is empty"
              },
            },
            {
              name: `(wiki ${page.slug}) assert valid title`,
              callable: async () => {
                if (page.title.length === 0) return "title is empty"
              },
            },
            {
              name: `(wiki ${page.slug}) assert valid type`,
              callable: async () => {
                if (page.type === "editorial") {
                  if (!(await getProblems()).includes(page.slug))
                    return "corresponding problem does not exist for editorial"
                }
              },
            },
          ],
        })),
      },
    ],
  }

  return TestTreeToTests(tree)
}

async function construct_tests(slug: string): Promise<Array<Test>> {
  const PROBLEM_DIR = `${PROBLEMS_DIR}/${slug}`

  const tree: TestTree = {
    tests: [
      {
        name: `(${slug}) assert problem dir exists`,
        callable: async () => {
          const { error } = await neverThrow(assertDirExists(PROBLEM_DIR))
          if (error) return error.message
        },
      },
    ],
    children: [
      {
        tests: [
          {
            name: `(${slug}) assert config.ts exists`,
            callable: async () => {
              const { error } = await neverThrow(
                assertFileExists(`${PROBLEM_DIR}/config.ts`),
              )
              if (error) return error.message
            },
          },
          {
            name: `(${slug}) assert page.md exists`,
            callable: async () => {
              const { error } = await neverThrow(
                assertFileExists(`${PROBLEM_DIR}/page.md`),
              )
              if (error) return error.message
            },
          },
        ],
        children: await (async (): Promise<Array<Test>> => {
          const tests: Array<Test> = []

          tests.push({
            name: `(${slug}) import`,
            callable: async () => {
              const { error, data } = await neverThrow(getProblemInfo(slug))
              if (error) return error.message
              if (!data) return "no data found"
            },
          })

          tests.push({
            name: `(${slug}) assert test workflow exists`,
            callable: async () => {
              const test_workflow = `${PROJECT_ROOT}/.github/workflows/autogenerated/test-${slug}.yml`
              const { error } = await neverThrow(
                assertFileExists(test_workflow),
              )
              if (error) return error.message
            },
          })

          tests.push({
            name: `(${slug}) assert deploy workflow exists`,
            callable: async () => {
              const deploy_workflow = `${PROJECT_ROOT}/.github/workflows/autogenerated/deploy-${slug}.yml`
              const { error } = await neverThrow(
                assertFileExists(deploy_workflow),
              )
              if (error) return error.message
            },
          })

          if (!process.env.SKIP_SUBMISSION_TESTS) {
            const problemInfo = await getProblemInfo(slug)

            if (!problemInfo.tests) problemInfo.tests = []
            problemInfo.tests.push({ testcase: "all", pass: false, input: "" })

            for (const {
              testcase,
              input,
              pass,
              index,
            } of problemInfo.tests.map((t, i) => ({
              ...t,
              index: i,
            }))) {
              if (testcase === "all") {
                for (const { id: testcaseId } of problemInfo.testcases) {
                  tests.push({
                    name: `(${slug}) test-${index}-testcase-${testcaseId}`,
                    callable: () =>
                      _runSubmissionTest(slug, testcaseId, input, pass),
                  })
                }
              } else if (testcase instanceof Array) {
                for (const testcaseId of testcase) {
                  tests.push({
                    name: `(${slug}) test-${index}-testcase-${testcaseId}`,
                    callable: () =>
                      _runSubmissionTest(slug, testcaseId, input, pass),
                  })
                }
              } else {
                tests.push({
                  name: `(${slug}) test-${index}-testcase-${testcase}`,
                  callable: () =>
                    _runSubmissionTest(slug, testcase, input, pass),
                })
              }
            }
          }

          return tests
        })(),
      },
    ],
  }

  return TestTreeToTests(tree)
}

async function _runSubmissionTest(
  slug: string,
  testcase: number,
  input: string,
  pass: boolean,
): Promise<string | undefined> {
  const { passed, output } = await runSubmissionAndGetOutput({
    problemSlug: slug,
    testcaseId: testcase,
    input,
    suffix: `test-${randomBytes(8).toString("hex")}`,
  })
  if (passed !== pass) {
    if (process.env.DEBUG_STDOUT)
      console.debug(`output (${slug}-${testcase} stdout): ${output.stdout}`)
    if (process.env.DEBUG_FS)
      console.debug(`output (${slug}-${testcase} fs): ${output.fs}`)
    return `expected to ${pass ? "pass" : "fail"} with input: ${input}`
  }
}

await main()
