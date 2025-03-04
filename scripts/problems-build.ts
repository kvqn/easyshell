import { getProblemInfo, getProblems } from "@easyshell/problems"
import { PROJECT_ROOT } from "@easyshell/utils"
import { $ } from "execa"
import { writeFile } from "fs/promises"
import { cp } from "fs/promises"
import { mkdir } from "fs/promises"
import { rm } from "fs/promises"

import "./problems-lint"

const WORKING_DIR = `${PROJECT_ROOT}/.easyshell`

await rm(WORKING_DIR, { recursive: true, force: true })

function dockerBuild({ tag, dir }: { tag: string; dir: string }) {
  console.log("building", tag)
  return $`docker build -t ${tag} ${dir}`
}

await mkdir(`${WORKING_DIR}/images/easyshell-base`, {
  recursive: true,
})

await cp(
  `${PROJECT_ROOT}/apps/entrypoint`,
  `${WORKING_DIR}/images/easyshell-base/entrypoint`,
  { recursive: true },
)

await writeFile(
  `${WORKING_DIR}/images/easyshell-base/Dockerfile`,
  `
FROM alpine:3.21 AS build

RUN apk add go

COPY entrypoint /src/entrypoint

RUN go build -C /src/entrypoint -o /bin/entrypoint

FROM alpine:3.21 AS base

RUN apk add zip

EXPOSE 8080

COPY --from=build /bin/entrypoint /entrypoint
`,
)

await dockerBuild({
  tag: "easyshell-base",
  dir: `${WORKING_DIR}/images/easyshell-base`,
})

const problems = await getProblems()

for (const problem of problems) {
  const info = await getProblemInfo(problem)
  for (const testcase of info.testcases) {
    const tag = `easyshell-${problem}-${testcase.id}`
    await mkdir(`${WORKING_DIR}/images/${tag}`, {
      recursive: true,
    })

    await cp(
      `./problems/${problem}/testcases/${testcase.folder}`,
      `${WORKING_DIR}/images/${tag}/home`,
      {
        recursive: true,
      },
    )

    await writeFile(
      `${WORKING_DIR}/images/${tag}/Dockerfile`,
      `
FROM easyshell-base
COPY home /home

ENTRYPOINT ["/entrypoint"]
`,
    )

    await dockerBuild({
      tag: tag,
      dir: `${WORKING_DIR}/images/${tag}`,
    })
  }
}
