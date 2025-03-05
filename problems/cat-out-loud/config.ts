import type { ProblemConfig } from "@easyshell/problems"
import { PROBLEMS_DIR } from "@easyshell/utils"
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
      await readFile(`${PROBLEMS_DIR}/${SLUG}/testcases/${id}/notes.txt`)
    ).toString(),
  }
}

const config: ProblemConfig = {
  id: 2,
  slug: SLUG,
  title: "Read a File",
  description: `Bring the contents of any file right into your terminal view. No GUIs allowed! 🖥️`,
  tags: ["Basics"],
  testcases: [
    await testcaseConfig({ id: 1, isPublic: true }),
    await testcaseConfig({ id: 2, isPublic: true }),
    await testcaseConfig({ id: 3, isPublic: false }),
  ],
}

export default config
