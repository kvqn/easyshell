import type { ProblemConfig } from "@easyshell/problems/schema"
import { testcaseDir } from "@easyshell/utils/build"

import { readFile } from "fs/promises"
import { readdir } from "fs/promises"
import { join } from "path"

const SLUG = "grep-version-2"

async function testcaseConfig({
  id,
  isPublic,
}: {
  id: number
  isPublic: boolean
}): Promise<ProblemConfig["testcases"][number]> {
  const testcase_dir = testcaseDir(SLUG, id)
  const file = (await readdir(testcase_dir, { recursive: true })).find((path) =>
    path.endsWith("__about__.py"),
  )
  if (!file) throw Error(`__about__.py not found in ${testcase_dir}`)

  const text = (await readFile(join(testcase_dir, file))).toString()
  const matches = /^[^#'"]?\s*__version__\s*=\s*['"](.*)['"]/.exec(text)
  console.log(matches)
  if (!matches) throw Error(`__version__ not found in ${file}`)
  const version = matches[1]
  if (!version) throw Error(`__version__ not found in ${file}`)

  return {
    id: id,
    public: isPublic,
  }
}

const config: ProblemConfig = {
  id: 16,
  slug: SLUG,
  title: "Grep Version 2",
  description: "Extract version number from your project",
  difficulty: "medium",
  tags: ["Basics"],
  testcases: [
    await testcaseConfig({
      id: 1,
      isPublic: true,
    }),
  ],
  tests: [
    {
      testcase: "all",
      pass: true,
      input: `cat "$(find -name __about__.py)" | grep -oP '^[^#'"]?\s*__version__\s*=\s*['"](.*)['"]`,
    },
  ],
}

export default config
