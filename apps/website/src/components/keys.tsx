"use client"

import { clientOS } from "@/lib/client"

import { ClientOnly } from "./client-only"

import { IoMdReturnLeft } from "react-icons/io"

export function CommandKey() {
  const os = clientOS()

  return (
    <ClientOnly>
      {os === "mac" ? (
        <span className="font-mono">⌘</span>
      ) : (
        <span className="font-mono">Ctrl</span>
      )}
    </ClientOnly>
  )
}

export function ReturnKey() {
  return <IoMdReturnLeft />
}
