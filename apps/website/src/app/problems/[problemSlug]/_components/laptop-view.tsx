import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ensureAuth } from "@/lib/server/auth"
import { getPublicTestcaseInfo } from "@/lib/server/problems"
import { getUserSubmissions } from "@/lib/server/queries"

import { Problem } from "./problem"
import { Submissions } from "./submissions"
import { ProblemPageTabs } from "./tabs"
import { TestcaseTabs } from "./testcases/tabs"

export async function LaptopView({
  problemId,
  problemSlug,
}: {
  problemId: number
  problemSlug: string
}) {
  const testcases = await getPublicTestcaseInfo(problemSlug)
  const testcaseIds = testcases.map((testcase) => testcase.id)
  const { id: userId } = await ensureAuth()
  const submissions = await getUserSubmissions({ problemId, userId })

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <Problem slug={problemSlug} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="flex w-full flex-col p-2">
        <ProblemPageTabs
          tabs={[
            {
              title: "Testcases",
              value: "testcases",
              content: (
                <TestcaseTabs
                  problemId={problemId}
                  problemSlug={problemSlug}
                  testcases={testcaseIds}
                />
              ),
            },
            {
              title: "Submissions",
              value: "submissions",
              content: (
                <Submissions
                  problemId={problemId}
                  problemSlug={problemSlug}
                  pastSubmissions={submissions}
                />
              ),
            },
          ]}
          defaultValue="submissions"
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
