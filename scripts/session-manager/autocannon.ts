import autocannon from "autocannon"

const instance = autocannon({
  url: "http://localhost:8090",
})

autocannon.track(instance)
