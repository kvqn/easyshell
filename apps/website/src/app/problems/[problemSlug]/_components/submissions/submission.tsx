"use client"

import type { FsType } from "@easyshell/problems/schema"

import { Back } from "@/components/back"
import { getSubmissionInfo } from "@/lib/server/actions/get-submission-info"
import { getTestcaseInfo } from "@/lib/server/actions/get-testcase-info"
import { cn, sleep } from "@/lib/utils"

import moment from "moment"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ReactDiffViewer from "react-diff-viewer-continued"
import { PiCopySimple, PiCopySimpleDuotone } from "react-icons/pi"
import { toast } from "sonner"

export function Submission({ submissionId }: { submissionId: number }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const _testcase = searchParams.get("testcase")
  const selectedTestcaseId = _testcase ? parseInt(_testcase) : null

  function setSelectedTestcaseId(tc: number | null) {
    if (tc === null)
      router.replace(`${pathname}?tab=submissions&submission=${submissionId}`)
    else
      router.replace(
        `${pathname}?tab=submissions&submission=${submissionId}&testcase=${tc}`,
      )
  }

  const [info, setInfo] = useState<Awaited<
    ReturnType<typeof getSubmissionInfo>
  > | null>(null)

  useEffect(() => {
    void (async () => {
      while (true) {
        const newInfo = await getSubmissionInfo({ submissionId })
        setInfo(newInfo)
        let fetchAgain = false
        for (const testcase of newInfo.testcases) {
          if (testcase.status === "pending" || testcase.status === "running") {
            fetchAgain = true
            break
          }
        }
        if (!fetchAgain) break
        await sleep(1000)
      }
    })()
  }, [submissionId])

  if (!info) return <div>loading</div>

  if (selectedTestcaseId)
    return (
      <div className="h-full">
        <Back href={`${pathname}?tab=submissions&submission=${submissionId}`} />
        <Testcase submissionId={submissionId} testcaseId={selectedTestcaseId} />
      </div>
    )

  return (
    <div>
      <Back href={`${pathname}?tab=submissions`} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold">
            Attempt #{info.submission.attempt}
          </h2>
          <div className="text-xs text-neutral-400">
            {moment(info.submission.submittedAt).fromNow()}
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border p-8 shadow">
          <div className="flex items-end justify-between">
            <div className="text-xl font-semibold">Input</div>
            <div
              className="group relative h-4 w-4 cursor-pointer"
              onClick={async () => {
                await navigator.clipboard.writeText(info.submission.input)
                toast.success("Copied to clipboard")
              }}
            >
              <PiCopySimple className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity group-hover:opacity-0" />
              <PiCopySimpleDuotone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
          <div className="rounded-md border bg-neutral-200 px-2 py-1 text-center font-mono text-sm dark:bg-neutral-800">
            {info.submission.input}
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border p-8 shadow dark:bg-neutral-900">
          <div className="text-xl font-semibold">Testcases</div>
          <div className="flex flex-wrap justify-center gap-4 px-8">
            {info.testcases.map((testcase) => (
              <div
                key={testcase.id}
                className={cn(
                  "cursor-pointer rounded-xl border border-neutral-400 bg-neutral-100 px-6 py-2 transition-colors hover:bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                )}
                onClick={() => setSelectedTestcaseId(testcase.id)}
              >
                <p className="text-md font-semibold">Testcase #{testcase.id}</p>
                <p
                  className={cn("text-sm opacity-80", {
                    "text-neutral-200":
                      testcase.status === "pending" ||
                      testcase.status === "running",
                    "text-red-500":
                      testcase.status === "finished" && !testcase.passed,
                    "text-green-500":
                      testcase.status === "finished" && testcase.passed,
                  })}
                >
                  {testcase.status === "pending"
                    ? "Pending"
                    : testcase.status === "running"
                      ? "Running"
                      : testcase.passed
                        ? "Passed"
                        : "Failed"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Testcase({
  submissionId,
  testcaseId,
}: {
  submissionId: number
  testcaseId: number
}) {
  const [info, setInfo] = useState<Awaited<
    ReturnType<typeof getTestcaseInfo>
  > | null>(null)

  useEffect(() => {
    void (async () => {
      setInfo(await getTestcaseInfo({ submissionId, testcaseId }))
    })()
  }, [testcaseId, submissionId])

  if (!info) return <div>Loading...</div>

  return (
    <div className={cn("flex h-full flex-col gap-4")}>
      <div className="flex flex-col gap-0">
        <h1 className="text-center text-xl font-bold">
          Testcase #{testcaseId}
        </h1>
        <h2
          className={cn("text-center font-semibold", {
            "text-red-500": !info.passed,
            "text-green-500": info.passed,
          })}
        >
          {info.passed ? "Passed" : "Failed"}
        </h2>
      </div>
      {info.expected_stdout !== undefined ? (
        <div className="flex flex-col gap-2 rounded-xl border p-8 shadow">
          <div className="text-lg font-semibold">Stdout</div>
          <Diff expected={info.expected_stdout} actual={info.stdout} />
        </div>
      ) : null}
      {info.expected_stderr !== undefined ? (
        <Diff expected={info.expected_stderr} actual={info.stderr} />
      ) : null}
      {info.expected_fs !== undefined ? (
        <FsDiff expected={info.expected_fs} actual={info.fs!} />
      ) : null}
    </div>
  )
}

function Diff({ expected, actual }: { expected: string; actual: string }) {
  return (
    <div className="overflow-hidden rounded-md border text-xs" style={{}}>
      <ReactDiffViewer
        leftTitle="Expected"
        rightTitle="Actual"
        splitView={true}
        showDiffOnly={false}
        oldValue={expected}
        newValue={actual}
        hideLineNumbers={true}
        // hideMarkers={true}
        styles={{
          variables: {
            light: {
              addedGutterBackground: "#FFFFFF",
              addedBackground: "#FFFFFF",
              removedBackground: "#FFFFFF",
              wordAddedBackground: "#fecaca",
            },
          },
        }}
      />
    </div>
  )
}

function FsDiff({ expected, actual }: { expected: FsType; actual: FsType }) {
  const files = new Set<string>()
  for (const key in expected) files.add(key)
  for (const key in actual) files.add(key)

  return (
    <div>
      {Array.from(files.keys()).map((file) => (
        <div key={file}>{file}</div>
      ))}
    </div>
  )
}
