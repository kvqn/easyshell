"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { newSubmission } from "@/server/actions/new-submission"
import { useState } from "react"
import { useProblem } from "@/app/problems/[problemSlug]/_components/problem-context"
import { useSubmissionsContext } from "./submissions-context"

export function SubmitPrompt() {
  const [input, setInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { id: problemId } = useProblem()
  const { setSelectedSubmissionId } = useSubmissionsContext()

  async function handleSubmit() {
    setSubmitting(true)
    const resp = await newSubmission({
      problemId,
      input,
    })
    setSelectedSubmissionId(resp.submissionId)
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
