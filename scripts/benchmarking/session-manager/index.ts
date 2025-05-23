import { BenchmarkEndpointCreate } from "./endpoints/create"
import { BenchmarkEndpointExec } from "./endpoints/exec"
import { BenchmarkEndpointKill } from "./endpoints/kill"

async function main() {
  // await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 5 })
  // await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 10 })
  // await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 20 })
  // await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 30 })
  // await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 50 })
  // await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 100 })

  await BenchmarkEndpointExec({
    duration: 100,
    n_containers: 5,
    requests_per_second: 5,
  })
  await BenchmarkEndpointExec({
    duration: 100,
    n_containers: 10,
    requests_per_second: 10,
  })
  await BenchmarkEndpointExec({
    duration: 100,
    n_containers: 20,
    requests_per_second: 20,
  })
  await BenchmarkEndpointExec({
    duration: 30,
    n_containers: 30,
    requests_per_second: 30,
  })
  await BenchmarkEndpointExec({
    duration: 30,
    n_containers: 50,
    requests_per_second: 50,
  })
  await BenchmarkEndpointExec({
    duration: 30,
    n_containers: 100,
    requests_per_second: 100,
  })
  await BenchmarkEndpointExec({
    duration: 30,
    n_containers: 500,
    requests_per_second: 500,
  })
  await BenchmarkEndpointExec({
    duration: 30,
    n_containers: 1000,
    requests_per_second: 1000,
  })

  // await BenchmarkEndpointKill({ n_requests: 100, requests_per_second: 5 })
  // await BenchmarkEndpointKill({ n_requests: 100, requests_per_second: 10 })
  // await BenchmarkEndpointKill({ n_requests: 200, requests_per_second: 20 })
  // await BenchmarkEndpointKill({ n_requests: 300, requests_per_second: 30 })
  // await BenchmarkEndpointKill({ n_requests: 300, requests_per_second: 50 })
  // await BenchmarkEndpointKill({ n_requests: 500, requests_per_second: 100 })
}

main()
  .then(() => {
    console.log("Done")
  })
  .catch((err) => {
    console.error(err)
  })
