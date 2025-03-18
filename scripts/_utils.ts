import { sleep } from "@easyshell/utils"

import { stat } from "fs/promises"

export async function assertDirExists(path: string) {
  try {
    const info = await stat(path)
    if (!info.isDirectory())
      throw Error(`Path ${path} exists but is not a directory`)
  } catch (e) {
    throw Error(`Directory ${path} does not exist`)
  }
}

export async function assertFileExists(path: string) {
  try {
    const info = await stat(path)
    if (!info.isFile()) throw Error(`Path ${path} exists but is not a file`)
  } catch (e) {
    throw Error(`File ${path} does not exist`)
  }
}

export type Task = {
  name: string
  callable: () => Promise<string | void>
}

export async function RunParallelStuff({
  tasks,
  parallel_limit,
}: {
  tasks: Array<Task>
  parallel_limit: number
}) {
  console.log(
    `Going to run ${tasks.length} tasks with ${parallel_limit} parallel limit.\n`,
  )
  let running = 0
  let index = 0

  function _taskWrapper(task: Task) {
    return async () => {
      const result = await task.callable()
      running--
      if (result) {
        process.stdout.write(`\r${task.name}: ${result}\n`)
      }
      process.stdout.write(
        `\rProgress [ ${index - running} / ${tasks.length} ]`,
      )
    }
  }

  const promises = Array<Promise<void>>()

  while (index < tasks.length) {
    while (running >= parallel_limit) await sleep(100)
    running++
    promises.push(_taskWrapper(tasks[index]!)())
    index++
  }

  await Promise.all(promises)

  process.stdout.write("\r\x1b[2K\n")
}
