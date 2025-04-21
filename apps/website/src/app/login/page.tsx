"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import {
  PiDiscordLogo,
  PiDiscordLogoDuotone,
  PiEnvelope,
  PiEnvelopeDuotone,
  PiGithubLogo,
  PiGithubLogoDuotone,
  PiGoogleLogo,
  PiGoogleLogoDuotone,
} from "react-icons/pi"
import { toast } from "sonner"

export default function Page() {
  const searchParams = useSearchParams()
  const callback = searchParams.get("callback") ?? "/"
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border p-8 shadow-xl">
      <div>
        <h1 className="text-center text-2xl font-semibold">easyshell.xyz</h1>
        <h2 className="text-center font-semibold text-gray-500">Login</h2>
      </div>
      <div className="w-full px-8 py-4">
        <Card className="flex w-full flex-col gap-4 p-4">
          <Button
            className="group flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-neutral-200 dark:hover:text-black"
            variant="secondary"
            onClick={async () => {
              await signIn("discord", { callbackUrl: callback })
            }}
          >
            <div className="relative h-8 w-6">
              <PiDiscordLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
              <PiDiscordLogoDuotone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="grow text-center">Login with Discord</p>
          </Button>
          <Button
            className="group flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-200 dark:hover:text-black"
            variant="secondary"
            onClick={async () => {
              await signIn("github", { callbackUrl: callback })
            }}
          >
            <div className="relative h-8 w-6">
              <PiGithubLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
              <PiGithubLogoDuotone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="grow text-center">Login with GitHub</p>
          </Button>
          <Button
            className="group flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-200 dark:hover:text-black"
            variant="secondary"
            onClick={async () => {
              await signIn("google", { callbackUrl: callback })
            }}
          >
            <div className="relative h-8 w-6">
              <PiGoogleLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
              <PiGoogleLogoDuotone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="grow text-center">Login with Google</p>
          </Button>
        </Card>
      </div>
      <Separator>
        <p className="bg-white p-2 text-xs font-semibold text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600">
          OR
        </p>
      </Separator>
      <div className="w-full px-8 py-4">
        <Card className="flex w-full flex-col gap-4 px-6 py-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold">Email</div>
            <Input placeholder="Enter your email address" className="w-full" />
          </div>
          <Button
            className="group flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-200 dark:hover:text-black"
            variant="secondary"
            onClick={async () => {
              toast.error("This feature is not yet implemented.")
            }}
          >
            <div className="relative h-8 w-6">
              <PiEnvelope className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl transition-opacity group-hover:opacity-0" />
              <PiEnvelopeDuotone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="grow text-center">Login with Email</p>
          </Button>
        </Card>
      </div>
    </div>
  )
}
