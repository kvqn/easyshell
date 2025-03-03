import { getPublicTestcaseInfo } from "@easyshell/problems"

import { ensureAuth } from "@/server/auth"
import { getUserSubmissions } from "@/server/queries"

import { Problem } from "./problem"
import { Submissions } from "./submissions"
import { ProblemPageTabs } from "./tabs"
import { TestcaseTabs } from "./testcases/tabs"

export async function MobileView({
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
    <div className="p-2">
      <ProblemPageTabs
        tabs={[
          {
            title: "Problem",
            value: "problem",
            content: <Problem slug={problemSlug} />,
          },
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
        defaultValue="problem"
      />
    </div>
  )
}
