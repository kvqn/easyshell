import {
  RunAutocannon,
  createBenchmarkingContainers,
  headers,
  killAllBenchmarkingContainers,
} from "../utils"

import { Request } from "autocannon"

export async function BenchmarkEndpointExec({
  duration,
  n_containers,
  requests_per_second,
}: {
  duration: number
  n_containers: number
  requests_per_second: number
}) {
  console.log(
    `Benchmarking kill endpoint with ${requests_per_second} requests per second for ${duration} seconds with ${n_containers} containers`,
  )

  const requests: Array<Request> = []

  const containers = await createBenchmarkingContainers(n_containers)
  function randomContainer() {
    const randomIndex = Math.floor(Math.random() * containers.length)
    return containers[randomIndex]!
  }

  requests.push({
    setupRequest: (req) => {
      return {
        ...req,
        body: JSON.stringify({
          container_name: randomContainer(),
          command: "echo hello world",
        }),
      }
    },
    path: "/exec",
    method: "POST",
    headers: headers,
  })

  await RunAutocannon({
    title: `exec-${requests_per_second}-${duration}-${n_containers}`,
    duration: duration,
    requests: requests,
    overallRate: requests_per_second,
    connections: requests_per_second * 10,
  })

  await killAllBenchmarkingContainers()
}
