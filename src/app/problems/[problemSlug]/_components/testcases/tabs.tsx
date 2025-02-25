"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { TestcaseTerminal } from "./terminal"

export function TestcaseTabs({
  problemId,
  problemSlug,
  testcases,
}: {
  problemId: number
  problemSlug: string
  testcases: number[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const _testcase = searchParams.get("testcase")
  const testcase = _testcase ? parseInt(_testcase) : 1

  function setTestcase(tc: string) {
    router.push(`${pathname}?tab=testcases&testcase=${tc}`)
  }

  return (
    <div>
      <Tabs
        defaultValue="1"
        value={testcase.toString()}
        onValueChange={setTestcase}
      >
        <TabsList className="w-full">
          {testcases.map((tc) => (
            <TabsTrigger key={tc} value={tc.toString()} className="flex-grow">
              Test Case {testcase}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="p-2">
        <TestcaseTerminal
          problemId={problemId}
          problemSlug={problemSlug}
          testcase={testcase}
        />
      </div>
    </div>
  )
}
