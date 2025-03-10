"use client"

import { useUser } from "@/lib/client"

import { redirect } from "next/navigation"
import { toast } from "sonner"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = useUser()
  if (!user) {
    toast("You are already logged out")
    redirect("/")
  }
  return children
}
