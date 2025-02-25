"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { z } from "zod"

type QueryParams = {
  testcase: number | null
  submission: number | null
  tab: "testcase" | "submission" | "problem"
  setTestcase: (testcase: number) => void
  setSubmission: (submission: number) => void
  setTab: (tab: "testcase" | "submission" | "problem") => void
}

const QueryParams_TabSchema = z
  .enum(["testcase", "submission", "problem"])
  .default("problem")
const QueryParams_SubmissionSchema = z.number().nullable()
const QueryParams_TestcaseSchema = z.number().nullable()

const QueryParamsContext = createContext<QueryParams | null>(null)

export function useQueryParams() {
  const queryParams = useContext(QueryParamsContext)
  if (!queryParams)
    throw new Error("useQueryParams must be used within QueryParamsContext")
  return queryParams
}

export function QueryParamsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const parsing_tab = QueryParams_TabSchema.safeParse(searchParams.get("tab"))
  const parsing_submission = QueryParams_SubmissionSchema.safeParse(
    searchParams.get("submission"),
  )
  const parsing_testcase = QueryParams_TestcaseSchema.safeParse(
    searchParams.get("testcase"),
  )

  const tab = parsing_tab.success ? parsing_tab.data : "problem"
  const testcase = parsing_testcase.success ? parsing_testcase.data : null
  const submission = parsing_submission.success ? parsing_submission.data : null

  function routerReplace({
    tab,
    testcase,
    submission,
  }: {
    tab: "testcase" | "submission" | "problem"
    testcase: number | null
    submission: number | null
  }) {
    let queryParams = ""
    if (tab) queryParams += `tab=${tab}`
    if (submission !== null) queryParams += `&submission=${submission}`
    if (testcase !== null) queryParams += `&testcase=${testcase}`
    router.replace(`${pathname}?${queryParams}`, { scroll: false })
  }

  function setTab(tab: "testcase" | "submission" | "problem") {
    routerReplace({ tab, testcase, submission })
  }

  function setTestcase(testcase: number) {
    routerReplace({ tab, testcase, submission })
  }

  function setSubmission(submission: number) {
    routerReplace({ tab, testcase, submission })
  }

  useEffect(() => {
    if (tab == "problem")
      routerReplace({ tab: "problem", testcase: null, submission: null })
    else if (tab == "testcase")
      routerReplace({ tab: "testcase", testcase, submission: null })
    else if (tab == "submission")
      routerReplace({ tab: "submission", testcase: testcase, submission })
  }, [tab, testcase, submission])

  return (
    <QueryParamsContext.Provider
      value={{ tab, testcase, submission, setTab, setTestcase, setSubmission }}
    >
      {children}
    </QueryParamsContext.Provider>
  )
}
