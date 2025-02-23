"use client"

import { getTerminalSession } from "@/server/actions/get-terminal-session"
import { useEffect, useRef, useState } from "react"
import { useProblem } from "./problem-context"
import { submitTerminalSessionCommand } from "@/server/actions/submit-terminal-session-command"
import { ImSpinner3 } from "react-icons/im"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Slider } from "@/components/ui/slider"
import { killTerminalSessions } from "@/server/actions/kill-terminal-sessions"

export function TestcaseTerminal({ testcase }: { testcase: number }) {
  const { id: problemId, slug: problemSlug } = useProblem()

  const [session, setSession] = useState<Awaited<
    ReturnType<typeof getTerminalSession>
  > | null>(null)

  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  //const [showOptions, setShowOptions] = useState(false)

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
    setRunning(true)
    const log = await submitTerminalSessionCommand({
      sessionId: session.id,
      command: input,
    })
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        logs: [...prev.logs, log],
      }
    })
    setInput("")
    setRunning(false)
  }

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    })
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
      console.log("session", session)
      setSession(session)
    })()
  }, [problemId, testcase, restarted])

  if (!session)
    return (
      <div className="flex flex-col rounded-md border-4 border-gray-400 font-geist-mono">
        <div className="relative flex h-80 flex-col overflow-scroll whitespace-pre-line bg-black px-2 py-1">
          <p className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-md bg-neutral-800 px-4 text-center font-semibold text-white">
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
              "flex-grow bg-neutral-800 px-2 py-1 text-white outline-none",
            )}
          />
          <button className="w-20 select-none bg-green-800 px-2 text-neutral-200 hover:bg-green-700"></button>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex flex-col rounded-md border-4 border-gray-400 font-geist-mono">
        <p className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-md bg-neutral-800 px-4 text-center font-semibold text-white">
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
          <input
            ref={inputRef}
            value={`>>> ${input}`}
            onChange={(e) => setInput(e.target.value.slice(4))}
            disabled={running}
            className={cn(
              "flex-grow bg-neutral-800 px-2 py-1 text-white outline-none",
              {
                "text-neutral-400": running,
              },
            )}
            autoFocus
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleSubmit()
              }
            }}
          />
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
          className="border-top-0 rounded-lg border bg-neutral-100 shadow"
        >
          <AccordionTrigger className="text-md rounded-lg border bg-white px-4 py-2 font-semibold shadow hover:bg-neutral-50">
            <p className="flex-grow text-center">Terminal Options</p>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="flex flex-col gap-4 p-4 *:rounded-md *:bg-white *:p-4 *:shadow">
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
