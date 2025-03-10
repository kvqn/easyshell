"use client"

import { Button } from "@/components/ui/button"

import { signIn } from "next-auth/react"
import {
  PiDiscordLogo,
  PiDiscordLogoDuotone,
  PiGithubLogo,
  PiGithubLogoDuotone,
  PiGoogleLogo,
  PiGoogleLogoDuotone,
} from "react-icons/pi"

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border p-8 shadow-xl">
      <div>
        <h1 className="text-center text-2xl font-semibold">easyshell.xyz</h1>
        <h2 className="text-center font-semibold text-gray-500">Login</h2>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border p-4 shadow-xs">
        <Button
          className="group flex items-center gap-4 hover:bg-gray-200"
          variant="secondary"
          onClick={async () => {
            await signIn("discord")
          }}
        >
          <div className="relative h-8 w-6">
            <PiDiscordLogo className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
            <PiDiscordLogoDuotone className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="grow text-center">Login with Discord</p>
        </Button>
        <Button
          className="group flex items-center gap-2 hover:bg-gray-200"
          variant="secondary"
          onClick={async () => {
            await signIn("github")
          }}
        >
          <div className="relative h-8 w-6">
            <PiGithubLogo className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
            <PiGithubLogoDuotone className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="grow text-center">Login with GitHub</p>
        </Button>
        <Button
          className="group flex items-center gap-2 hover:bg-gray-200"
          variant="secondary"
          onClick={async () => {
            await signIn("google")
          }}
        >
          <div className="relative h-8 w-6">
            <PiGoogleLogo className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
            <PiGoogleLogoDuotone className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="grow text-center">Login with Google</p>
        </Button>
      </div>
    </div>
  )
}
