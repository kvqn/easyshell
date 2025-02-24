import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Testcases } from "./testcases"
import { Submissions } from "./submissions"
import { SubmissionsContextProvider } from "./submissions/submissions-context"
import { ProblemHeading } from "./heading"
import { ProblemMarkdown } from "./markdown"
import { ProblemHints } from "./problem-hints"

export function MobileView({ problemSlug }: { problemSlug: string }) {
  return (
    <Tabs defaultValue="problem" className="h-full px-4">
      <TabsList className="w-full">
        <TabsTrigger value="problem" className="text-md flex-grow">
          Problem
        </TabsTrigger>
        <TabsTrigger value="testcases" className="text-md flex-grow">
          Testcases
        </TabsTrigger>
        <TabsTrigger value="submissions" className="text-md flex-grow">
          Submissions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="problem">
        <ProblemHeading />
        <ProblemMarkdown slug={problemSlug} />
        <ProblemHints slug={problemSlug} />
      </TabsContent>
      <TabsContent value="testcases">
        <Testcases />
      </TabsContent>
      <TabsContent value="submissions" className="h-full">
        <SubmissionsContextProvider>
          <Submissions />
        </SubmissionsContextProvider>
      </TabsContent>
    </Tabs>
  )
}
