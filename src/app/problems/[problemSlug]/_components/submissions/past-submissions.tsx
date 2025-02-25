"use client"

import moment from "moment"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FaCheck, FaXmark } from "react-icons/fa6"
import { ImSpinner3 } from "react-icons/im"

import { useProblem } from "@/app/problems/[problemSlug]/_components/problem-context"
import { cn } from "@/lib/utils"
import { getPastSubmissions } from "@/server/actions/get-past-submissions"

import { useSubmissionsContext } from "./submissions-context"

export function PastSubmissions() {
  const { id: problemId } = useProblem()
  const [pastSubmissions, setPastSubmissions] = useState<Awaited<
    ReturnType<typeof getPastSubmissions>
  > | null>(null)
  const { setSelectedSubmissionId } = useSubmissionsContext()

  useEffect(() => {
    void (async () => {
      const past_submissions = await getPastSubmissions({ problemId })
      console.log(past_submissions)
      setPastSubmissions(past_submissions)
    })()
  }, [problemId])

  if (!pastSubmissions) return <div>loading</div>

  if (pastSubmissions.length === 0)
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative top-14 flex flex-col">
          <p className="text-center text-xl font-semibold text-gray-600 lg:text-2xl">
            No submissions yet
          </p>
          <p className="text-md text-center text-gray-400 lg:text-lg">
            Create a submission using the the prompt above
          </p>
          <Image
            src="/images/arrow.svg"
            width={100}
            height={50}
            alt="arrow-pointing-to-prompt"
            unoptimized
            className="absolute left-0 top-8 z-[-1] -translate-x-[30%] -translate-y-full scale-75 lg:-translate-x-1/2 lg:scale-100"
          />
        </div>
      </div>
    )

  return (
    <div className="flex flex-col gap-4 border-t p-4">
      <h3 className="text-center font-semibold">Past Submissions</h3>
      {pastSubmissions.map((submission, idx) => (
        <button
          key={submission.id}
          onClick={() => setSelectedSubmissionId(submission.id)}
          className={cn(
            "flex items-center gap-2 rounded border p-2 transition-colors",
            {
              "border-gray-500 bg-gray-200 text-gray-800 hover:bg-gray-300":
                submission.status === "running",
              "border-green-500 bg-green-200 text-green-800 hover:bg-green-300":
                submission.status === "passed",
              "border-red-500 bg-red-200 text-red-800 hover:bg-red-300":
                submission.status === "failed",
            },
          )}
        >
          {submission.status === "passed" ? (
            <FaCheck />
          ) : submission.status === "failed" ? (
            <FaXmark />
          ) : (
            <ImSpinner3 className="animate-spin" />
          )}
          <p>Attempt #{pastSubmissions.length - idx}</p>
          <p className="flex-grow text-right">
            {moment(submission.submittedAt).fromNow()}
          </p>
        </button>
      ))}
    </div>
  )
}
