"use client"

import { CommandKey, ReturnKey } from "@/components/keys"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EasyTooltip } from "@/components/ui/tooltip"
import { clientOS } from "@/lib/client"
import { newSubmission } from "@/lib/server/actions/new-submission"

import { usePathname, useRouter } from "next/navigation"
import { usePostHog } from "posthog-js/react"
import { useState } from "react"

export function SubmitPrompt({
  problemId,
  problemSlug,
}: {
  problemId: number
  problemSlug: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const posthog = usePostHog()

  const [input, setInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const os = clientOS()

  async function handleSubmit() {
    setSubmitting(true)
    posthog.capture("submission", {
      problemSlug,
    })
    const resp = await newSubmission({
      problemId,
      input,
    })
    router.replace(
      `${pathname}?tab=submissions&submission=${resp.submissionId}`,
    )
    setSubmitting(false)
  }

  return (
    <div className="flex gap-2">
      <div className="relative grow">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={submitting}
          className="border-2 border-neutral-400 font-mono"
          onKeyDown={async (e) => {
            if (submitting) return
            if (
              e.key === "Enter" &&
              ((os === "windows" && e.ctrlKey) ||
                (os === "mac" && e.metaKey) ||
                (os === "linux" && e.ctrlKey))
            ) {
              await handleSubmit()
            }
          }}
        />
        {["windows", "linux", "mac"].includes(os) ? (
          <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-1 text-sm text-neutral-400">
            <CommandKey />
            <ReturnKey />
          </div>
        ) : null}
      </div>
      <EasyTooltip
        tip={
          ["windows", "linux", "mac"].includes(os) ? (
            <div className="flex items-center gap-1 text-sm text-neutral-400">
              <CommandKey />
              <ReturnKey />
            </div>
          ) : undefined
        }
      >
        <Button
          disabled={submitting}
          onClick={handleSubmit}
          className="flex items-center"
        >
          Submit
        </Button>
      </EasyTooltip>
    </div>
  )
}
