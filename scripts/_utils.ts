import { stat } from "fs/promises"

export async function assertDirExists(path: string) {
  const info = await stat(path)
  if (!info.isDirectory()) throw Error(`Directory ${path} does not exist`)
}

export async function assertFileExists(path: string) {
  const info = await stat(path)
  if (!info.isFile()) throw Error(`File ${path} does not exist`)
}
