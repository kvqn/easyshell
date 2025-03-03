import { readdir } from "fs/promises"
import { stat } from "fs/promises"
import { readFile } from "fs/promises"
import { join } from "path"

import type { FsType } from "."

export async function getFs(path: string): Promise<FsType> {
  const files = await readdir(path, { recursive: true })
  const fs: FsType = {}
  for (const file of files) {
    const isFile = (await stat(join(path, file))).isFile()
    if (isFile) fs[file] = (await readFile(join(path, file))).toString()
  }
  return fs
}
