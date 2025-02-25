"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProblemPageTabs({
  tabs,
  defaultValue,
}: {
  tabs: Array<{ title: string; value: string; content: React.ReactNode }>
  defaultValue: string
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const tab = searchParams.get("tab") ?? defaultValue

  function setTab(newTab: string) {
    router.replace(`${pathname}?tab=${newTab}`)
  }

  return (
    <Tabs
      defaultValue={defaultValue}
      value={tab}
      onValueChange={setTab}
      className="h-full"
    >
      <TabsList className="w-full">
        {tabs.map(({ title, value }) => (
          <TabsTrigger key={value} value={value} className="text-md flex-grow">
            {title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ value, content }) => (
        <TabsContent key={value} value={value}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
