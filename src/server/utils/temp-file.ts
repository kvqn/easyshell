import fs from "fs/promises"
import { v4 as uuidv4 } from "uuid"

export async function createTempFile(content: string): Promise<string> {
  const uuid = uuidv4()
  const filePath = `/tmp/input-${uuid}.sh`
  // create file
  await fs.writeFile(filePath, content)

  return filePath
}
