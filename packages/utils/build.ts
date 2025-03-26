// ====================================================
// Utility exports that are available during build time
// ====================================================
import type { FsType } from "@easyshell/problems/schema"

import { $ } from "execa"
import { readdir } from "fs/promises"
import { stat } from "fs/promises"
import { readFile } from "fs/promises"
import { join } from "path"

let _PROJECT_ROOT = process.env.PROJECT_ROOT

if (!_PROJECT_ROOT) {
  try {
    _PROJECT_ROOT = $.sync`git rev-parse --show-toplevel`.stdout
  } catch (e) {
    throw Error("Not a git repository")
  }
}

export const PROJECT_ROOT = _PROJECT_ROOT
export const PROBLEMS_DIR = `${PROJECT_ROOT}/packages/problems/data/problems`

export async function getFs(path: string): Promise<FsType> {
  const files = await readdir(path, { recursive: true })
  const fs: FsType = {}
  for (const file of files) {
    const isFile = (await stat(join(path, file))).isFile()
    if (isFile) fs[file] = (await readFile(join(path, file))).toString()
  }
  return fs
}
