import { Benchmark } from "./endpoints/query"

async function main() {
  await Benchmark({ duration: 30, requests_per_second: 5 })
  await Benchmark({ duration: 30, requests_per_second: 10 })
  await Benchmark({ duration: 30, requests_per_second: 20 })
  await Benchmark({ duration: 30, requests_per_second: 30 })
  await Benchmark({ duration: 30, requests_per_second: 50 })
  await Benchmark({ duration: 30, requests_per_second: 100 })
}

main()
  .then(() => {
    console.log("Done")
  })
  .catch((err) => {
    console.error(err)
  })
