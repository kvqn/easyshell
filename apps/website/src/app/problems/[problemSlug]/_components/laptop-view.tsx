import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { auth } from "@/lib/server/auth"
import { getPublicTestcaseInfo } from "@/lib/server/problems"
import { getUserSubmissions } from "@/lib/server/queries"

import { LoginToProceed } from "./login-to-proceed"
import { Problem } from "./problem"
import { Submissions } from "./submissions"
import { ProblemPageTabs } from "./tabs"
import { TestcaseTabs } from "./testcases/tabs"

import { Suspense } from "react"

export async function LaptopView({
  problemId,
  problemSlug,
}: {
  problemId: number
  problemSlug: string
}) {
  const session = await auth()
  const user = session?.user

  const testcases = await getPublicTestcaseInfo(problemSlug)
  const testcaseIds = testcases.map((testcase) => testcase.id)
  const submissions = user
    ? await getUserSubmissions({ problemId, userId: user.id })
    : null

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
              content: user ? (
                <Suspense fallback={<div>Loading</div>}>
                  <TestcaseTabs
                    problemId={problemId}
                    problemSlug={problemSlug}
                    testcases={testcaseIds}
                  />
                </Suspense>
              ) : (
                <LoginToProceed />
              ),
            },
            {
              title: "Submissions",
              value: "submissions",
              content: submissions ? (
                <Suspense fallback={<div>Loading</div>}>
                  <Submissions
                    problemId={problemId}
                    problemSlug={problemSlug}
                    pastSubmissions={submissions}
                  />
                </Suspense>
              ) : (
                <LoginToProceed />
              ),
            },
          ]}
          defaultValue="submissions"
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
