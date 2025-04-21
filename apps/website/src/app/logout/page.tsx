"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { signOut } from "next-auth/react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="flex w-fit flex-col rounded-xl border px-8 py-4">
        <h2 className="text-lg font-semibold">{`You're about to log out`}</h2>
        <h3 className="text-sm text-neutral-400">{`Are you sure you want to log out?`}</h3>
        <div className="mt-4 flex gap-2 *:*:w-full *:grow">
          <Link href="/">
            <Button variant={"secondary"}>Cancel</Button>
          </Link>
          <Button
            variant={"destructive"}
            onClick={async () => {
              await signOut()
            }}
          >
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  )
}
