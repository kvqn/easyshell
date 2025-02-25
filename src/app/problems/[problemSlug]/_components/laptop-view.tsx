import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ProblemHeading } from "./heading"
import { ProblemMarkdown } from "./markdown"
import { ProblemHints } from "./problem-hints"
import { Submissions } from "./submissions"
import { SubmissionsContextProvider } from "./submissions/submissions-context"
import { Testcases } from "./testcases"

export function LaptopView({ problemSlug }: { problemSlug: string }) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="p-4">
        <div>
          <ProblemHeading />
          <ProblemMarkdown slug={problemSlug} />
          <ProblemHints slug={problemSlug} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="flex w-full flex-col p-4">
        <Tabs defaultValue="submissions" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="testcases" className="text-md flex-grow">
              Testcases
            </TabsTrigger>
            <TabsTrigger value="submissions" className="text-md flex-grow">
              Submissions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="testcases">
            <Testcases />
          </TabsContent>
          <TabsContent value="submissions" className="h-full">
            <SubmissionsContextProvider>
              <Submissions />
            </SubmissionsContextProvider>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
