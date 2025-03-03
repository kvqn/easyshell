import type { FsType } from "@easyshell/problems"
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
        console.log("fs", fs)
        resolve(fs)
      })
    })
  })
}
