import { getFs } from "@/server/utils/paths"
import type { FsType, ProblemConfig } from "@/server/utils/problem"

const SLUG = "bulk-move"

async function testcaseConfig({
  id,
  isPublic,
}: {
  id: number
  isPublic: boolean
}) {
  const originalFs = await getFs(`./problems/${SLUG}/testcases/${id}`)
  const newFs: FsType = {}
  for (const file in originalFs) {
    if (file.endsWith(".log")) {
      const basename = file.split("/").pop()!
      newFs[`logs/${basename}`] = originalFs[file]!
    } else {
      newFs[file] = originalFs[file]!
    }
  }

  return {
    id: id,
    folder: `${id}`,
    public: isPublic,
    expected_fs: newFs,
  }
}

const config: ProblemConfig = {
  id: 6,
  slug: SLUG,
  title: "Bulk Move",
  description: `A scattered mess of log files? Gather them all into one place while leaving everything else untouched! 📂`,
  tags: ["Basics"],
  capture_stdout: false,
  capture_stderr: false,
  capture_exit_code: false,
  capture_fs: true,
  testcases: [
    await testcaseConfig({ id: 1, isPublic: true }),
    await testcaseConfig({ id: 2, isPublic: true }),
    await testcaseConfig({ id: 3, isPublic: false }),
  ],
}

export default config
