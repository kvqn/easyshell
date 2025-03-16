import { env } from "@/env"
import { STATUS_INTERNAL_SERVER_ERROR, STATUS_LOCKED } from "@/lib/utils"

import { z } from "zod"

const SessionManagerExecResponseSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
})

//const SessionManagerExecErrorSchema = z.object({
//  critical: z.boolean(),
//  message: z.string(),
//  error: z.string(),
//})

export async function sessionManagerExec({
  containerName,
  command,
}: {
  containerName: string
  command: string
}): Promise<
  | {
      status: "success"
      stdout: string
      stderr: string
    }
  | {
      status: "error"
      type:
        | "took_too_long"
        | "container_not_running"
        | "container_error"
        | "critical_server_error"
      message: string
    }
> {
  const isSessionRunning = await sessionManagerIsRunning(containerName)
  if (!isSessionRunning)
    return {
      status: "error",
      type: "container_not_running",
      message: "The container is not running",
    }

  let resp: Response
  try {
    resp = await fetch(`${env.CONTAINER_MANAGER_URL}/exec`, {
      method: "POST",
      body: JSON.stringify({
        container_name: containerName,
        command,
      }),
      signal: AbortSignal.timeout(5000),
    })
  } catch (e) {
    if (e instanceof Error && e.name === "TimeoutError")
      return {
        status: "error",
        type: "took_too_long",
        message: "The command took too long to execute",
      }
    if (e instanceof Error && e.name === "TypeError")
      return {
        status: "error",
        type: "critical_server_error",
        message: "Request Failed (container manager might be down)",
      }

    return {
      status: "error",
      type: "critical_server_error",
      message: "Request Failed",
    }
  }

  let json: unknown
  try {
    json = await resp.json()
  } catch {
    return {
      status: "error",
      type: "critical_server_error",
      message: "Failed to parse response from container manager",
    }
  }

  if (resp.status === STATUS_LOCKED)
    return {
      status: "error",
      type: "container_error",
      message: "The container is locked because it is running another command",
    }

  if (resp.status === STATUS_INTERNAL_SERVER_ERROR)
    return {
      status: "error",
      type: "container_error",
      message: "The container encountered an error",
    }

  const parsing_result = SessionManagerExecResponseSchema.safeParse(json)

  if (!parsing_result.success)
    return {
      status: "error",
      type: "critical_server_error",
      message: "Failed to parse response from container manager",
    }

  const data = parsing_result.data

  return {
    status: "success",
    stdout: data.stdout,
    stderr: data.stderr,
  }
}

const SessionManagerIsRunningResponseSchema = z.object({
  is_running: z.boolean(),
})

export async function sessionManagerIsRunning(containerName: string) {
  const resp = await fetch(`${env.CONTAINER_MANAGER_URL}/is-running`, {
    method: "POST",
    body: JSON.stringify({
      container_name: containerName,
    }),
  })
  if (!resp.ok) {
    throw new Error(await resp.text())
  }
  const resp_body = SessionManagerIsRunningResponseSchema.parse(
    await resp.json(),
  )
  return resp_body.is_running
}

export async function sessionManagerCreate(args: {
  container_name: string
  image: string
}) {
  const resp = await fetch(`${env.CONTAINER_MANAGER_URL}/create`, {
    method: "POST",
    body: JSON.stringify(args),
  })
  if (!resp.ok) {
    throw new Error(await resp.text())
  }
}

export async function sessionManagerKill(containerName: string) {
  const resp = await fetch(`${env.CONTAINER_MANAGER_URL}/kill`, {
    method: "POST",
    body: JSON.stringify({
      container_name: containerName,
    }),
  })
  if (!resp.ok) {
    throw new Error(await resp.text())
  }
}
