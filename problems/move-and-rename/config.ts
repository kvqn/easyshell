import { readFile } from "fs/promises"

import type { ProblemConfig } from "@/server/utils/problem"

const SLUG = "move-and-rename"

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
      "index.html": (
        await readFile(`./problems/${SLUG}/testcases/${id}/index.htlm`)
      ).toString(),
    },
  }
}

const config: ProblemConfig = {
  id: 5,
  slug: SLUG,
  title: "Move And Rename",
  description: `Sometimes, files end up in the wrong place with the wrong name.`,
  tags: ["Basics"],
  testcases: [await testcaseConfig({ id: 1, isPublic: true })],
}

export default config
