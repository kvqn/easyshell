import { RunAutocannon, createBenchmarkingContainers, headers } from "../utils"

import { Request } from "autocannon"

export async function BenchmarkEndpointKill({
  n_requests,
  requests_per_second,
}: {
  n_requests: number
  requests_per_second: number
}) {
  console.log(
    `Benchmarking kill endpoint with ${requests_per_second} requests per second for ${n_requests} requests`,
  )

  const requests: Array<Request> = []

  const containers = await createBenchmarkingContainers(n_requests)
  let _i = 0
  function nextContainer() {
    const container_name = containers[_i % containers.length]
    _i++
    return container_name
  }

  requests.push({
    setupRequest: (req) => {
      return {
        ...req,
        body: JSON.stringify({
          container_name: nextContainer(),
        }),
      }
    },
    path: "/kill",
    method: "POST",
    headers: headers,
  })

  await RunAutocannon({
    title: `kill-${requests_per_second}-${n_requests}`,
    amount: n_requests,
    requests: requests,
    overallRate: requests_per_second,
    connections: requests_per_second * 10,
  })
}
