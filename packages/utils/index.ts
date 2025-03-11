import type { FsType } from "@easyshell/problems/schema"

import { $, ExecaError } from "execa"
import { readdir } from "fs/promises"
import { stat } from "fs/promises"
import { readFile } from "fs/promises"
import { join } from "path"
import yauzl, { type Entry } from "yauzl"

export async function getFs(path: string): Promise<FsType> {
  const files = await readdir(path, { recursive: true })
  const fs: FsType = {}
  for (const file of files) {
    const isFile = (await stat(join(path, file))).isFile()
    if (isFile) fs[file] = (await readFile(join(path, file))).toString()
  }
  return fs
}

export async function unzip(
  fs_zip_base64: string,
): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const zip = Buffer.from(fs_zip_base64, "base64")
    const fs: Record<string, string> = {}
    yauzl.fromBuffer(zip, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(err)
        return
      }

      zipfile.readEntry()
      zipfile.on("entry", (entry: Entry) => {
        if (entry.fileName.endsWith("/")) {
          zipfile.readEntry()
        } else {
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) {
              reject(err)
              return
            }

            let data = ""
            readStream.on("data", (chunk) => {
              data += chunk
            })
            readStream.on("end", () => {
              fs[entry.fileName] = data
              zipfile.readEntry()
            })
          })
        }
      })
      zipfile.on("end", () => {
        resolve(fs)
      })
    })
  })
}

type Success<T> = {
  data: T
  error: null
}

type Failure<E> = {
  data: null
  error: E
}

type Result<T, E = Error> = Success<T> | Failure<E>

export async function neverThrow<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as E }
  }
}

let _PROJECT_ROOT = process.env.PROJECT_ROOT

if (!_PROJECT_ROOT) {
  try {
    _PROJECT_ROOT = (await $`git rev-parse --show-toplevel`).stdout
  } catch (e) {
    if (e instanceof ExecaError) {
      throw Error("Not a git repository")
    }
    throw Error("Unknown error")
  }
}

export const PROJECT_ROOT = _PROJECT_ROOT
export const PROBLEMS_DIR = `${PROJECT_ROOT}/problems`

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
