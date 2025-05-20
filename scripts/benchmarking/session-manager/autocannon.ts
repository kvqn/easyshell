import autocannon, { Options, Request } from "autocannon"
import { existsSync, mkdirSync } from "fs"
import { writeFile } from "fs/promises"
import { getProblemInfo, getProblems } from "packages/problems"

const REPORTS_DIR = "reports"

if (!existsSync(REPORTS_DIR)) {
  mkdirSync(REPORTS_DIR)
}

const problems = await getProblems()

const testcases = (
  await Promise.all(
    problems.map(async (problem) => {
      const info = await getProblemInfo(problem)
      return info.testcases.map((tc) => `${problem}-${tc.id}`)
    }),
  )
).flat()

const headers = {
  authorization: `Bearer benchmarking`,
}

async function RunAutocannon({
  title,
  requests,
  connections,
  amount,
  overallRate,
  initialContext,
  duration,
}: {
  title: string
  requests: Array<Request>
  connections?: number
  amount?: number
  overallRate?: number
  initialContext?: object
  duration?: number
}) {
  let opts: Options = { url: "http://localhost:4000", requests }
  if (duration) {
    opts.duration = duration
  }
  if (connections) {
    opts.connections = connections
  }
  if (amount) {
    opts.amount = amount
  }
  if (overallRate) {
    opts.overallRate = overallRate
  }
  if (initialContext) {
    opts.initialContext = initialContext
  }

  const instance = autocannon(opts)

  // @ts-ignore
  autocannon.track(instance)

  const report = await instance
  const file = `${REPORTS_DIR}/autocannon-${title}.json`
  await writeFile(file, JSON.stringify(report, null, 2))
}

const created_containers: string[] = []
let count = 0
function uniqueContainerName() {
  count++
  const container_name = `benchmarking-${count}`
  created_containers.push(container_name)
  return container_name
}

function nextTestcase() {
  const testcase = testcases[count % testcases.length]
  return testcase
}

let _created_container_index = 0
function nextCreatedContainer() {
  const container_name =
    created_containers[_created_container_index % created_containers.length]
  _created_container_index++
  return container_name
}

async function benchmarkCreateRequests({
  requests,
  requests_per_second,
}: {
  requests: number
  requests_per_second: number
}) {
  const creation_requests: Array<Request> = []

  creation_requests.push({
    setupRequest: (req, ctx) => {
      const testcase = nextTestcase()
      return {
        ...req,
        body: JSON.stringify({
          image: `easyshell-${testcase}`,
          container_name: uniqueContainerName(),
        }),
      }
    },
    path: "/create",
    method: "POST",
    headers,
  })

  await RunAutocannon({
    title: `create-${requests}-${requests_per_second}`,
    requests: creation_requests,
    amount: requests,
    overallRate: requests_per_second,
    // initialContext: {
    //   count: 0,
    // },
    connections: requests_per_second * requests,
  })
}

let _created_container_for_exec_index = 0
function nextCreatedContainerForExec() {
  const container_name =
    created_containers[
      _created_container_for_exec_index % created_containers.length
    ]
  _created_container_for_exec_index++
  return container_name
}

async function benchmarkExecRequests({
  duration,
  requests_per_second,
}: {
  duration: number
  requests_per_second: number
}) {
  const exec_requests: Array<Request> = []
  exec_requests.push({
    setupRequest: (req) => {
      return {
        ...req,
        body: JSON.stringify({
          container_name: nextCreatedContainerForExec(),
          command: `echo test`,
        }),
      }
    },
    path: "/exec",
    method: "POST",
    headers,
  })
  await RunAutocannon({
    title: `exec-${duration}-${requests_per_second}`,
    requests: exec_requests,
    duration: duration,
    overallRate: requests_per_second,
    initialContext: {
      count: 0,
    },
    connections: requests_per_second,
  })
}

async function benchmarkKillRequests({
  requests,
  requests_per_second,
}: {
  requests: number
  requests_per_second: number
}) {
  const kill_requests: Array<Request> = []
  kill_requests.push({
    setupRequest: (req, ctx) => {
      return {
        ...req,
        body: JSON.stringify({
          container_name: nextCreatedContainer(),
        }),
      }
    },
    path: "/kill",
    method: "POST",
    headers,
  })
  await RunAutocannon({
    title: `kill-${requests}-${requests_per_second}`,
    requests: kill_requests,
    amount: requests,
    overallRate: requests_per_second,
    initialContext: {
      count: 0,
    },
    connections: requests_per_second * requests,
  })
}

await benchmarkCreateRequests({ requests: 100, requests_per_second: 50 })
await benchmarkExecRequests({ duration: 30, requests_per_second: 10 })
await benchmarkExecRequests({ duration: 30, requests_per_second: 100 })
await benchmarkExecRequests({ duration: 30, requests_per_second: 1000 })
await benchmarkExecRequests({ duration: 30, requests_per_second: 5000 })
await benchmarkKillRequests({ requests: 100, requests_per_second: 50 })
