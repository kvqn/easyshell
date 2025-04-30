"use client"

import { clientOS } from "@/lib/client"

import { ClientOnly } from "./client-only"

import { IoReturnDownBackSharp } from "react-icons/io5"
import { PiCommand, PiControl } from "react-icons/pi"

export function CommandKey() {
  const os = clientOS()

  return <ClientOnly>{os === "mac" ? <PiCommand /> : <PiControl />}</ClientOnly>
}

export function ReturnKey() {
  return <IoReturnDownBackSharp />
}
