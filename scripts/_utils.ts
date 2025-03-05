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
