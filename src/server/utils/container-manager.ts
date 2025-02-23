import { env } from "@/env"
import { z } from "zod"

const ContainerManagerExecResponseSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
})

export async function containerManagerExec({
  containerName,
  command,
}: {
  containerName: string
  command: string
}) {
  const resp = await fetch(`${env.CONTAINER_MANAGER_URL}/exec`, {
    method: "POST",
    body: JSON.stringify({
      container_name: containerName,
      command,
    }),
  })
  if (!resp.ok) {
    throw new Error(await resp.text())
  }
  const resp_body = ContainerManagerExecResponseSchema.parse(await resp.json())
  return resp_body
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
