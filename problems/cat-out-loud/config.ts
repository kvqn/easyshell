import type { ProblemConfig } from "@/server/utils/problem"
import { readFile } from "fs/promises"

const SLUG = "cat-out-loud"

async function testcaseConfig({
  id,
  isPublic,
}: {
  id: number
  isPublic: boolean
}) {
  return {
    id: id,
    folder: `${id}`,
    public: isPublic,
    expected_stdout: (
      await readFile(`./problems/${SLUG}/testcases/${id}/notes.txt`)
    ).toString(),
  }
}

const config: ProblemConfig = {
  id: 2,
  slug: SLUG,
  title: "Read a File",
  description: `Bring the contents of any file right into your terminal view. No GUIs allowed! 🖥️`,
  tags: ["Basics"],
  capture_stdout: true,
  capture_stderr: false,
  capture_exit_code: false,
  capture_fs: false,
  testcases: [
    await testcaseConfig({ id: 1, isPublic: true }),
    await testcaseConfig({ id: 2, isPublic: true }),
    await testcaseConfig({ id: 3, isPublic: false }),
  ],
}

export default config
