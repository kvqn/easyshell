"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { getTerminalSession } from "@/lib/server/actions/get-terminal-session"
import { killTerminalSessions } from "@/lib/server/actions/kill-terminal-sessions"
import { submitTerminalSessionCommand } from "@/lib/server/actions/submit-terminal-session-command"
import { cn } from "@/lib/utils"

import { useEffect, useRef, useState } from "react"
import { ImSpinner3 } from "react-icons/im"
import { toast } from "sonner"

export function TestcaseTerminal({
  problemId,
  problemSlug,
  testcase,
}: {
  problemId: number
  problemSlug: string
  testcase: number
}) {
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof getTerminalSession>
  > | null>(null)

  const [running, setRunning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const [options, setOptions] = useState<{
    fontSize: number
    showTimes: boolean
  }>({
    fontSize: 1,
    showTimes: false,
  })

  const [restarted, setRestarted] = useState(0)
  const [restarting, setRestarting] = useState(false)

  async function handleRestartTerminal() {
    setSession(null)
    setRestarting(true)
    await killTerminalSessions({ problemId, testcaseId: testcase })
    setRestarted((prev) => prev + 1)
    setRestarting(false)
  }

  async function handleSubmit() {
    if (!session) return
    if (!promptHistory[promptHistoryIndex]) return
    setRunning(true)
    const submissionResponse = await submitTerminalSessionCommand({
      sessionId: session.id,
      command: promptHistory[promptHistoryIndex],
    })
    if (submissionResponse.status === "success") {
      const log = submissionResponse.log
      setSession((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          logs: [...prev.logs, log],
        }
      })
    } else {
      if (submissionResponse.type === "took_too_long")
        toast.error("Aborted", {
          description: submissionResponse.message,
        })
      else if (submissionResponse.type === "session_not_running")
        toast.error("Failed", {
          description: submissionResponse.message,
        })
      else if (submissionResponse.type === "session_error")
        toast.error("Failed", {
          description: submissionResponse.message,
        })
      else if (submissionResponse.type === "critical_server_error")
        toast.error("Critical Error", {
          description: submissionResponse.message,
        })
    }
    setRunning(false)
  }

  const [promptHistory, setPromptHistory] = useState<string[]>([])
  const [promptHistoryIndex, setPromptHistoryIndex] = useState<number>(0)

  function handlePromptUpArrow() {
    if (promptHistoryIndex > 0) {
      setPromptHistoryIndex((prev) => prev - 1)
    }
  }

  function handlePromptDownArrow() {
    if (promptHistoryIndex < promptHistory.length - 1) {
      setPromptHistoryIndex((prev) => prev + 1)
    }
  }

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    })
    if (session) {
      setPromptHistory([...session.logs.map((log) => log.stdin), ""])
      setPromptHistoryIndex(session.logs.length + 1)
    }
  }, [session])

  useEffect(() => {
    if (!running) {
      inputRef.current?.focus()
    }
  }, [running])

  useEffect(() => {
    void (async () => {
      const session = await getTerminalSession({
        problemId: problemId,
        testcaseId: testcase,
      })
      setSession(session)
    })()
  }, [problemId, testcase, restarted])

  if (!session)
    return (
      <div className="flex flex-col rounded-md border-4 border-gray-400 font-geist-mono">
        <div className="relative flex h-80 flex-col overflow-scroll whitespace-pre-line bg-black px-2 py-1">
          <p className="absolute left-1/2 top-0 -translate-x-1/2 select-none rounded-b-md bg-neutral-800 px-4 text-center font-semibold text-white opacity-100 transition-opacity hover:opacity-0">
            {problemSlug}-{testcase}
          </p>
          <div
            className={cn(
              "absolute left-1/2 top-1/2 z-20 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black",
              {
                "z-[-20]": !restarting,
              },
            )}
          >
            <p className="animate-spin text-white">Restarting</p>
          </div>
        </div>
        <div className="flex">
          <input
            className={cn(
              "grow bg-neutral-800 px-2 py-1 text-white outline-hidden",
            )}
          />
          <button className="w-20 select-none bg-green-800 px-2 text-neutral-200 hover:bg-green-700"></button>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex flex-col rounded-md border-4 border-gray-400 font-geist-mono">
        <p className="absolute left-1/2 top-0 -translate-x-1/2 select-none rounded-b-md bg-neutral-800 px-4 text-center font-semibold text-white opacity-100 transition-opacity hover:opacity-0">
          {problemSlug}-{testcase}
        </p>
        <div
          className="flex h-80 flex-col overflow-scroll whitespace-pre-line bg-black px-2 py-1"
          ref={terminalRef}
          style={{
            fontSize: `${options.fontSize}rem`,
          }}
        >
          {session.logs.map((log) => (
            <div key={log.id}>
              <p className="text-white">{`>>> ${log.stdin}`}</p>
              {log.stdout.length > 0 && (
                <p className="text-neutral-400">{log.stdout}</p>
              )}
              {log.stderr.length > 0 && (
                <p className="text-red-600">{log.stderr}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex">
          <div className="flex grow bg-neutral-800 text-white">
            <p className="py-1 pl-2">{`>>>`}</p>
            <input
              ref={inputRef}
              value={promptHistory[promptHistoryIndex] ?? ""}
              onChange={(e) => {
                setPromptHistory((prev) => {
                  const newPromptHistory = [...prev]
                  newPromptHistory[promptHistoryIndex] = e.target.value
                  return newPromptHistory
                })
              }}
              disabled={running}
              className={cn(
                "grow bg-neutral-800 px-2 py-1 text-white outline-hidden",
                {
                  "text-neutral-400": running,
                },
              )}
              autoFocus
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await handleSubmit()
                }
                if (e.key === "ArrowUp") {
                  handlePromptUpArrow()
                }
                if (e.key === "ArrowDown") {
                  handlePromptDownArrow()
                }
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={running}
            className="w-20 select-none bg-green-800 px-2 text-neutral-200 hover:bg-green-700"
          >
            {running ? (
              <ImSpinner3 className="m-auto animate-spin" />
            ) : (
              "submit"
            )}
          </button>
        </div>
      </div>
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem
          value={`options`}
          className="border-top-0 rounded-lg border bg-neutral-100 shadow-sm"
        >
          <AccordionTrigger className="text-md rounded-lg border bg-white px-4 py-2 font-semibold shadow-sm hover:bg-neutral-50">
            <p className="grow text-center">Terminal Options</p>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="flex flex-col gap-4 p-4 *:rounded-md *:bg-white *:p-4 *:shadow-sm">
              <div className="space-y-2">
                <label htmlFor="font-size" className="font-semibold">
                  Font Size
                </label>
                <Slider
                  name="font-size"
                  value={options.fontSize}
                  max={2}
                  step={0.1}
                  onValueChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      fontSize: val,
                    }))
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox />
                <p>Show Times</p>
              </div>
              <div>
                <Button
                  className="w-full bg-green-800 text-neutral-200"
                  onClick={handleRestartTerminal}
                  disabled={restarting}
                >
                  {restarting ? "Restating ..." : "Restart Terminal"}
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
