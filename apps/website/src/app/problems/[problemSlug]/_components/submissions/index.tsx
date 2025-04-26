"use client"

import { PromptSettingsContextProvider } from "@/app/settings/_components/prompt-settings"
import { ClientOnly } from "@/components/client-only"
import type { getUserSubmissions } from "@/lib/server/queries"

import { PastSubmissions } from "./past-submissions"
import { Submission } from "./submission"
import { SubmitPrompt } from "./submit-prompt"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

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
      <Suspense fallback={<div>Loading</div>}>
        <div className="flex h-full flex-col gap-4">
          <ClientOnly>
            <PromptSettingsContextProvider>
              <SubmitPrompt problemId={problemId} problemSlug={problemSlug} />
            </PromptSettingsContextProvider>
          </ClientOnly>
          <PastSubmissions
            problemSlug={problemSlug}
            pastSubmissions={pastSubmissions}
          />
        </div>
      </Suspense>
    )

  return (
    <Suspense fallback={<div>Loading</div>}>
      <Submission submissionId={submission} />
    </Suspense>
  )
}
