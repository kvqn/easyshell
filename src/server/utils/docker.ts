import {
  containerManagerCreate,
  containerManagerIsRunning,
} from "./container-manager"

export async function dockerRun(args: { image: string; name: string }) {
  // TODO: checks
  await containerManagerCreate({
    container_name: args.name,
    image: args.image,
  })
}

export async function isContainerRunning(container_name: string) {
  return await containerManagerIsRunning(container_name)
}
