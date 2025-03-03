import type { FsType, ProblemConfig } from "@easyshell/problems"
import { getFs } from "@easyshell/problems/utils"

const SLUG = "rm-that-file"

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
    if (file !== "secrets/portal.txt") {
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
  id: 7,
  slug: SLUG,
  title: "Remove That File",
  description: `A single file is standing in the way—time to delete it and clear the clutter! 🗑️`,
  tags: ["Basics"],
  testcases: [
    await testcaseConfig({ id: 1, isPublic: true }),
    await testcaseConfig({ id: 2, isPublic: true }),
  ],
}

export default config
