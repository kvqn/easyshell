import { PiTerminalWindow } from "react-icons/pi"

export function Loading() {
  return (
    <div className="flex items-center justify-center relative h-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
        <div className="relative size-40">
          <PiTerminalWindow className="size-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-300 -z-8" />
          <div className="h-[60%] absolute top-1/2 -translate-y-1/2 bg-neutral-100 w-1/2 left-[15%] -z-9 animate-progress" />
        </div>
      </div>
      <div className="text-4xl font-bold font-clash-display text-neutral-700">
        <span>Loading your stuff</span>
      </div>
    </div>
  )
}
