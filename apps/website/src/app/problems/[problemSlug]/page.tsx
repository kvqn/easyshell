import { getProblemInfo, getProblems } from "@easyshell/problems"

import { DesktopContainer, MobileContainer } from "@/components/media"

import { LaptopView } from "./_components/laptop-view"
import { MobileView } from "./_components/mobile-view"
import { ProblemNotFound } from "./_components/not-found-page"

import type { Metadata } from "next"

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

  const { id: problemId } = await getProblemInfo(problemSlug)

  return (
    <>
      <DesktopContainer>
        <LaptopView problemSlug={problemSlug} problemId={problemId} />
      </DesktopContainer>
      <MobileContainer>
        <MobileView problemSlug={problemSlug} problemId={problemId} />
      </MobileContainer>
    </>
  )
}
