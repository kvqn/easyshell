"use client"

import type { getUserSubmissions } from "@/server/queries"

import { PastSubmissions } from "./past-submissions"
import { Submission } from "./submission"
import { SubmitPrompt } from "./submit-prompt"

import { useSearchParams } from "next/navigation"

export function Submissions({
  problemId,
  problemSlug,
  pastSubmissions,
}: {
  problemId: number
  problemSlug: string
  pastSubmissions: Awaited<ReturnType<typeof getUserSubmissions>>
}) {
  const searchParams = useSearchParams()

  const _submission = parseInt(searchParams.get("submission") ?? "")
  const submission = isNaN(_submission) ? null : _submission

  if (submission === null)
    return (
      <div className="flex h-full flex-col gap-4">
        <SubmitPrompt problemId={problemId} />
        <PastSubmissions
          problemSlug={problemSlug}
          pastSubmissions={pastSubmissions}
        />
      </div>
    )

  return <Submission submissionId={submission} />
}
