import { RunAutocannon, randomTestcase, uniqueContainerName } from "../utils"

import { Request } from "autocannon"

export async function Benchmark({
  duration,
  requests_per_second,
}: {
  duration: number
  requests_per_second: number
}) {
  console.log(
    `Benchmarking with ${requests_per_second} requests per second for ${duration} seconds`,
  )

  const requests: Array<Request> = []

  requests.push({
    setupRequest: (req) => {
      const testcase = randomTestcase()
      const testcase_split = testcase.split("-")
      const problemSlug = testcase_split.slice(0, -1).join("-")
      const testcaseId = testcase_split.slice(-1)[0]
      return {
        ...req,
        body: JSON.stringify({
          problemSlug,
          testcaseId,
          input: "echo hello world",
          suffix: uniqueContainerName(),
        }),
      }
    },
    path: "/query",
    method: "POST",
  })

  await RunAutocannon({
    title: `submission-manager-${requests_per_second}-${duration}`,
    duration: duration,
    requests: requests,
    overallRate: requests_per_second,
    connections: requests_per_second * 10,
  })
}
