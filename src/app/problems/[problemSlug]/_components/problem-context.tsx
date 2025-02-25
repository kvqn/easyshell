"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { getProblemInfo } from "@/server/actions/get-problem-info"

export const ProblemContext = createContext<Awaited<
  ReturnType<typeof getProblemInfo>
> | null>(null)

export function useProblem() {
  const problem = useContext(ProblemContext)
  if (!problem) throw new Error("useProblem must be used within ProblemContext")
  return problem
}

export function ProblemProvider({
  children,
  slug,
}: {
  children: React.ReactNode
  slug: string
}) {
  const [problem, setProblem] = useState<Awaited<
    ReturnType<typeof getProblemInfo>
  > | null>(null)

  useEffect(() => {
    void (async () => {
      const info = await getProblemInfo(slug)
      setProblem(info)
    })()
  }, [slug])

  if (!problem) return <div>loading</div>

  return (
    <ProblemContext.Provider value={problem}>
      {children}
    </ProblemContext.Provider>
  )
}
