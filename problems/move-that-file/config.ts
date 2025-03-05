import type { ProblemConfig } from "@easyshell/problems"
import { PROBLEMS_DIR } from "@easyshell/utils"
import { readFile } from "fs/promises"

const SLUG = "move-that-file"

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
    expected_fs: {
      "datadir/payload.json": (
        await readFile(`${PROBLEMS_DIR}/${SLUG}/testcases/${id}/payload.json`)
      ).toString(),
    },
  }
}

const config: ProblemConfig = {
  id: 4,
  slug: "move-that-file",
  title: "Move That File",
  description: `Move a file from one location to another—because sometimes, things just need to be somewhere else. 🚀`,
  tags: ["Basics"],
  testcases: [
    await testcaseConfig({ id: 1, isPublic: true }),
    await testcaseConfig({ id: 2, isPublic: false }),
  ],
}

export default config
