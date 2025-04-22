"use client"

import { LoginForm } from "./_components/form"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function Client({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callback = searchParams.get("callback") ?? "/"

  useEffect(() => {
    if (loggedIn) {
      toast("You are already logged in")
      router.push(callback)
    }
  }, [router, loggedIn, callback])

  if (loggedIn) return null

  return <LoginForm callback={callback} />
}
