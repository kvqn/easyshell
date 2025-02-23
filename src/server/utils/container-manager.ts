import { env } from "@/env"
import { z } from "zod"
import { StatusCodes } from "http-status-codes"

const ContainerManagerExecResponseSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
})

//const ContainerManagerExecErrorSchema = z.object({
//  critical: z.boolean(),
//  message: z.string(),
//  error: z.string(),
//})

export async function containerManagerExec({
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
  const isContainerRunning = await containerManagerIsRunning(containerName)
  if (!isContainerRunning)
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
    console.log("resp", resp)
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

  let json: any
  try {
    json = await resp.json()
    console.log("resp_json", json)
  } catch {
    return {
      status: "error",
      type: "critical_server_error",
      message: "Failed to parse response from container manager",
    }
  }

  if (resp.status === StatusCodes.LOCKED)
    return {
      status: "error",
      type: "container_error",
      message: "The container is locked because it is running another command",
    }

  if (resp.status === StatusCodes.INTERNAL_SERVER_ERROR)
    return {
      status: "error",
      type: "container_error",
      message: "The container encountered an error",
    }

  let parsing_result = ContainerManagerExecResponseSchema.safeParse(json)

  if (!parsing_result.success)
    return {
      status: "error",
      type: "critical_server_error",
      message: "Failed to parse response from container manager",
    }

  return {
    status: "success",
    ...parsing_result.data,
  }
}

const ContainerManagerIsRunningResponseSchema = z.object({
  is_running: z.boolean(),
})

export async function containerManagerIsRunning(containerName: string) {
  const resp = await fetch(`${env.CONTAINER_MANAGER_URL}/is-running`, {
    method: "POST",
    body: JSON.stringify({
      container_name: containerName,
    }),
  })
  if (!resp.ok) {
    throw new Error(await resp.text())
  }
  const resp_body = ContainerManagerIsRunningResponseSchema.parse(
    await resp.json(),
  )
  return resp_body.is_running
}

export async function containerManagerCreate(args: {
  container_name: string
  image: string
  volume_mounts: Array<{
    host_path: string
    container_path: string
  }>
  entry_point: string
}) {
  const resp = await fetch(`${env.CONTAINER_MANAGER_URL}/create`, {
    method: "POST",
    body: JSON.stringify(args),
  })
  if (!resp.ok) {
    throw new Error(await resp.text())
  }
}

export async function containerManagerKill(containerName: string) {
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
