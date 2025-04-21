"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { EasyTooltip } from "@/components/ui/tooltip"
import { getTerminalSession } from "@/lib/server/actions/get-terminal-session"
import { isSessionAlive } from "@/lib/server/actions/is-session-alive"
import { killTerminalSessions } from "@/lib/server/actions/kill-terminal-sessions"
import { submitTerminalSessionCommand } from "@/lib/server/actions/submit-terminal-session-command"
import { cn } from "@/lib/utils"

import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { BsGearWideConnected } from "react-icons/bs"
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
      if (submissionResponse.type === "took_too_long") {
        toast.error("Aborted", {
          description: submissionResponse.message,
        })
        return
      }
      setOnlineStatus({
        isOnline: false,
        lastChecked: new Date(),
      })
      if (submissionResponse.type === "session_not_running")
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
      setOnlineStatus({
        isOnline: true,
        lastChecked: new Date(),
      })
    }
  }, [session])

  useEffect(() => {
    if (!running) {
      inputRef.current?.focus()
    }
  }, [running])

  useEffect(() => {
    void (async () => {
      setSession(null)
      const session = await getTerminalSession({
        problemId: problemId,
        testcaseId: testcase,
      })
      setSession(session)
    })()
  }, [problemId, testcase, restarted])

  const [settingsOpen, setSettingsOpen] = useState(false)

  const [onlineStatus, setOnlineStatus] = useState<{
    isOnline: boolean
    lastChecked: Date
  }>({ isOnline: true, lastChecked: new Date() })

  useEffect(() => {
    const interval = setInterval(() => {
      void (async () => {
        if (!session) return
        setOnlineStatus({
          isOnline: await isSessionAlive(session.id),
          lastChecked: new Date(),
        })
      })()
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [onlineStatus, session])

  if (!session)
    return (
      <div className="flex flex-col rounded-md border-4 border-gray-400 font-geist-mono">
        <div className="relative flex h-80 flex-col overflow-scroll bg-black px-2 py-1 whitespace-pre-line">
          <p className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md bg-neutral-800 px-4 text-center font-semibold text-white opacity-100 transition-opacity select-none hover:opacity-0">
            {problemSlug}-{testcase}
          </p>
          <div
            className={cn(
              "absolute top-1/2 left-1/2 z-20 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black",
            )}
          >
            {restarting ? (
              <p className="animate-spin text-white">Restarting</p>
            ) : (
              <p className="text-neutral-600">Loading</p>
            )}
          </div>
        </div>
        <div className="flex">
          <input
            className={cn(
              "grow bg-neutral-800 px-2 py-1 text-white outline-hidden",
            )}
          />
          <button className="w-20 bg-green-800 px-2 text-neutral-200 select-none hover:bg-green-700"></button>
        </div>
      </div>
    )

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative flex grow flex-col rounded-md border-4 border-gray-400 font-geist-mono">
        <div
          className="flex grow flex-col overflow-scroll bg-black px-2 py-1 whitespace-pre-line"
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
            className="w-20 bg-green-800 px-2 text-neutral-200 select-none hover:bg-green-700"
          >
            {running ? (
              <ImSpinner3 className="m-auto animate-spin" />
            ) : (
              "submit"
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-full grow items-center justify-between rounded-md border bg-neutral-100 px-4 text-xs dark:bg-neutral-800">
          <div className="flex flex-col">
            <p className="font-semibold">
              {problemSlug}-{testcase}-session-{session.id}
            </p>
            <p className="text-neutral-400">
              created {moment(session.createdAt).fromNow()}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-2 shadow-xs",
                {
                  "border-green-200 bg-green-100 shadow-green-200 dark:border-green-800 dark:bg-green-900/60 dark:shadow-green-800/60":
                    onlineStatus.isOnline,
                  "border-red-200 bg-red-100 shadow-red-200 dark:border-red-800 dark:bg-red-900/60 dark:shadow-red-800/60":
                    !onlineStatus.isOnline,
                },
              )}
            >
              <div
                className={cn("size-1.5 rounded-full shadow-xl", {
                  "bg-green-500 shadow-green-300": onlineStatus.isOnline,
                  "bg-red-500 shadow-red-300": !onlineStatus.isOnline,
                })}
              ></div>
              <p
                className={cn({
                  "text-green-600": onlineStatus.isOnline,
                  "text-red-600": !onlineStatus.isOnline,
                })}
              >
                {onlineStatus.isOnline ? "online" : "offline"}
              </p>
            </div>
            <p className="text-neutral-400">
              checked {moment(onlineStatus.lastChecked).fromNow()}
            </p>
          </div>
        </div>
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <EasyTooltip tip="Terminal Settings">
              <div
                className={cn(
                  "group flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border bg-neutral-100 text-neutral-500 transition-all hover:w-10 hover:border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700",
                )}
                onClick={() => setSettingsOpen(!settingsOpen)}
              >
                <BsGearWideConnected />
              </div>
            </EasyTooltip>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Terminal Settings</DialogTitle>
              <DialogDescription>
                Customize your terminal experience.
              </DialogDescription>
            </DialogHeader>

            <div className="*p-4 flex flex-col gap-4 p-4 *:rounded-md *:p-4 *:shadow-sm">
              <Card className="space-y-2">
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
              </Card>
              <Card className="flex items-center gap-2">
                <Checkbox
                  checked={false}
                  onClick={() => {
                    toast.error("This feature is not available yet")
                  }}
                />
                <p>Show Times</p>
              </Card>
              <Card>
                <Button
                  className="w-full bg-green-800 text-neutral-200 hover:bg-green-700"
                  onClick={handleRestartTerminal}
                  disabled={restarting}
                >
                  {restarting ? "Restating ..." : "Restart Terminal"}
                </Button>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
