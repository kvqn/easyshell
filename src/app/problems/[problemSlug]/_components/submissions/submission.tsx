"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ReactDiffViewer from "react-diff-viewer-continued"
import { IoIosArrowBack } from "react-icons/io"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn, sleep } from "@/lib/utils"
import { getSubmissionInfo } from "@/server/actions/get-submission-info"
import { getTestcaseInfo } from "@/server/actions/get-testcase-info"
import type { FsType } from "@/server/utils/problem"

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
        const info = await getSubmissionInfo({ submissionId })
        setInfo(info)

        let fetchAgain = false
        for (const testcase of info.testcases) {
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
        <Link
          href={`${pathname}?tab=submissions&submission=${submissionId}`}
          className="flex items-center gap-2 pl-2"
        >
          <IoIosArrowBack className="m-0 p-0 text-xl" />
          <p>Back</p>
        </Link>
        <Testcase submissionId={submissionId} testcaseId={selectedTestcaseId} />
      </div>
    )

  return (
    <div>
      <h2 className="mt-4 text-center text-xl font-bold">
        Attempt #{info.submission.attempt}
      </h2>
      <Link
        href={`${pathname}?tab=submissions`}
        className="flex items-center gap-2 pl-2"
      >
        <IoIosArrowBack className="m-0 p-0 text-xl" />
        <p>Back</p>
      </Link>
      <div className="flex flex-wrap justify-center gap-4 p-8">
        {info.testcases.map((testcase) => (
          <div
            key={testcase.id}
            className={cn(
              "cursor-pointer rounded-xl border px-8 py-4 transition-colors",
              {
                "border-gray-500 bg-gray-200 hover:bg-gray-300":
                  testcase.status === "pending" ||
                  testcase.status === "running",
                "border-red-500 bg-red-200 hover:bg-red-300":
                  testcase.status === "finished" && !testcase.passed,
                "border-green-500 bg-green-200 hover:bg-green-300":
                  testcase.status === "finished" && testcase.passed,
              },
            )}
            onClick={() => setSelectedTestcaseId(testcase.id)}
          >
            <p className="font-semibold">Testcase #{testcase.id}</p>
            <p>
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
      <Accordion type="single" collapsible>
        {info.expected_stdout !== undefined ? (
          <AccordionItem value="stdout">
            <AccordionTrigger>Stdout</AccordionTrigger>
            <AccordionContent>
              <Diff expected={info.expected_stdout} actual={info.stdout} />
            </AccordionContent>
          </AccordionItem>
        ) : null}
        {info.expected_stderr !== undefined ? (
          <AccordionItem value="stderr">
            <AccordionTrigger>Stderr</AccordionTrigger>
            <AccordionContent>
              <Diff expected={info.expected_stderr} actual={info.stderr} />
            </AccordionContent>
          </AccordionItem>
        ) : null}
        {info.expected_fs !== undefined ? (
          <AccordionItem value="stderr">
            <AccordionTrigger>Files</AccordionTrigger>
            <AccordionContent>
              <FsDiff expected={info.expected_fs} actual={info.fs!} />
            </AccordionContent>
          </AccordionItem>
        ) : null}
      </Accordion>
    </div>
  )
}

function Diff({ expected, actual }: { expected: string; actual: string }) {
  return (
    <div className="overflow-hidden rounded-xl border text-xs">
      <ReactDiffViewer
        leftTitle="Expected"
        rightTitle="Actual"
        oldValue={expected}
        newValue={actual}
        splitView={true}
        hideLineNumbers={true}
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
