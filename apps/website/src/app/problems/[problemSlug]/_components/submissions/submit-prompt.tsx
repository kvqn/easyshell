"use client"

import { CommandKey, ReturnKey } from "@/components/keys"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EasyTooltip } from "@/components/ui/tooltip"
import { clientOS } from "@/lib/client"
import { newSubmission } from "@/lib/server/actions/new-submission"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export function SubmitPrompt({ problemId }: { problemId: number }) {
  const pathname = usePathname()
  const router = useRouter()

  const [input, setInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const os = clientOS()

  async function handleSubmit() {
    setSubmitting(true)
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
          <div className="flex gap-1 items-center text-neutral-400 text-sm absolute right-4 top-1/2 -translate-y-1/2">
            <CommandKey />
            <ReturnKey />
          </div>
        ) : null}
      </div>
      <EasyTooltip
        tip={
          ["windows", "linux", "mac"].includes(os) ? (
            <div className="flex gap-1 items-center text-neutral-400 text-sm">
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
