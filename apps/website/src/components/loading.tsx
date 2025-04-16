import { PiTerminalWindow } from "react-icons/pi"

export function Loading() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="relative size-40">
          <PiTerminalWindow className="-z-8 absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 text-neutral-300" />
          <div className="-z-9 animate-progress absolute left-[15%] top-1/2 h-[60%] w-1/2 -translate-y-1/2 bg-neutral-100" />
        </div>
      </div>
      <div className="font-clash-display text-4xl font-bold text-neutral-700">
        <span>Loading your stuff</span>
      </div>
    </div>
  )
}
