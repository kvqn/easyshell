import { BenchmarkEndpointCreate } from "./endpoints/create"

async function main() {
  await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 5 })
  await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 10 })
  await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 20 })
  await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 30 })
  await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 50 })
  await BenchmarkEndpointCreate({ duration: 30, requests_per_second: 100 })
}

main()
  .then(() => {
    console.log("Done")
  })
  .catch((err) => {
    console.error(err)
  })
