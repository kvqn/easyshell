import {
  RunAutocannon,
  headers,
  killAllBenchmarkingContainers,
  randomTestcase,
  uniqueContainerName,
} from "../utils"

import { Request } from "autocannon"

export async function BenchmarkEndpointCreate({
  duration,
  requests_per_second,
}: {
  duration: number
  requests_per_second: number
}) {
  console.log(
    `Benchmarking create endpoint with ${requests_per_second} requests per second for ${duration} seconds`,
  )

  const requests: Array<Request> = []

  requests.push({
    setupRequest: (req) => {
      const testcase = randomTestcase()
      return {
        ...req,
        body: JSON.stringify({
          image: `easyshell-${testcase}`,
          container_name: `bench-${uniqueContainerName()}`,
        }),
      }
    },
    path: "/create",
    method: "POST",
    headers: headers,
  })

  await RunAutocannon({
    title: `create-${requests_per_second}-${duration}`,
    requests: requests,
    duration: duration,
    overallRate: requests_per_second,
    connections: requests_per_second * 10,
  })

  await killAllBenchmarkingContainers()
}
