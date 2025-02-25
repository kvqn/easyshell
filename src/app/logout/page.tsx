"use client"

import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col gap-4 rounded-xl border p-8">
        <h2 className="text-center font-semibold">Are you sure?</h2>
        <Button
          className="flex items-center gap-2"
          variant={"destructive"}
          onClick={async () => {
            await signOut()
          }}
        >
          Log Out
        </Button>
      </div>
    </div>
  )
}
