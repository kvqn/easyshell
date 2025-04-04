"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"

export function Spoiler({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  const toggle = () => {
    setOpen(!open)
  }

  return (
    <div
      className={cn("relative", { "cursor-pointer": !open }, className)}
      onClick={toggle}
    >
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-sm font-semibold",
          { hidden: open },
        )}
      >
        Spoiler
      </div>
      <div className={cn("blur-sm", { "blur-none": open })}>{children}</div>
    </div>
  )
}
