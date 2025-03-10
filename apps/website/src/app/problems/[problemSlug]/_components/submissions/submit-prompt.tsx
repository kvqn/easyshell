"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { newSubmission } from "@/server/actions/new-submission"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export function SubmitPrompt({ problemId }: { problemId: number }) {
  const pathname = usePathname()
  const router = useRouter()

  const [input, setInput] = useState("")
  const [submitting, setSubmitting] = useState(false)

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
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={submitting}
        className="border-2 border-neutral-400 font-mono"
      />
      <Button disabled={submitting} onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  )
}
