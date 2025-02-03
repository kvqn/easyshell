import yauzl from "yauzl"

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
      zipfile.on("entry", (entry) => {
        if (/\/$/.test(entry.fileName)) {
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
