import { getProblemInfo, getProblems } from "@/server/utils/problem"
import { writeFile } from "fs/promises"
import { cp } from "fs/promises"
import { mkdir } from "fs/promises"
import { rm } from "fs/promises"
import { $ } from "execa"

import "./lint"

const WORKING_DIR = ".easyshell"

await rm(WORKING_DIR, { recursive: true, force: true })

function dockerBuild({ tag, dir }: { tag: string; dir: string }) {
  console.log("building", tag)
  return $`docker build -t ${tag} ${dir}`
}

await dockerBuild({
  tag: "easyshell-base",
  dir: "tools/problems/easyshell-base",
})

const problems = await getProblems()

for (const problem of problems) {
  const info = await getProblemInfo(problem)
  for (const testcase of info.testcases) {
    const tag = `easyshell-${problem}-${testcase.id}`
    await mkdir(`.easyshell/images/${tag}`, {
      recursive: true,
    })

    await cp(
      `./problems/${problem}/testcases/${testcase.folder}`,
      `.easyshell/images/${tag}/home`,
      {
        recursive: true,
      },
    )

    await writeFile(
      `.easyshell/images/${tag}/Dockerfile`,
      `
FROM easyshell-base
COPY home /home

ENTRYPOINT ["/input.sh"]
`,
    )

    await dockerBuild({
      tag: tag,
      dir: `.easyshell/images/${tag}`,
    })
  }
}
