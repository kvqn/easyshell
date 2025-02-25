import type { Metadata } from "next"

import { DesktopContainer, MobileContainer } from "@/components/media"
import { getProblems } from "@/server/utils/problem"

import { LaptopView } from "./_components/laptop-view"
import { MobileView } from "./_components/mobile-view"
import { ProblemNotFound } from "./_components/not-found-page"
import { ProblemProvider } from "./_components/problem-context"
import { QueryParamsProvider } from "./_components/query-params-context"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ problemSlug: string }>
}): Promise<Metadata> {
  const { problemSlug } = await params
  return {
    title: `easyshell - ${problemSlug}`,
  }
}

export async function generateStaticParams() {
  const problems = await getProblems()
  return problems.map((problem) => ({
    problemSlug: problem,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ problemSlug: string }>
}) {
  const { problemSlug } = await params
  const valid = (await getProblems()).includes(problemSlug)
  if (!valid) {
    return <ProblemNotFound />
  }

  return (
    <ProblemProvider slug={problemSlug}>
      <QueryParamsProvider>
        <DesktopContainer>
          <LaptopView problemSlug={problemSlug} />
        </DesktopContainer>
        <MobileContainer>
          <MobileView problemSlug={problemSlug} />
        </MobileContainer>
      </QueryParamsProvider>
    </ProblemProvider>
  )
}
