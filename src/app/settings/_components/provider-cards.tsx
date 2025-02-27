"use client"

import { signIn } from "next-auth/react"
import {
  PiDiscordLogo,
  PiDiscordLogoDuotone,
  PiGithubLogo,
  PiGithubLogoDuotone,
  PiGoogleLogo,
  PiGoogleLogoDuotone,
} from "react-icons/pi"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

export function DiscordCard({ connected }: { connected: boolean }) {
  return (
    <div
      className="pl-4 pr-6 py-2 flex items-center border rounded-full shadow bg-neutral-50 gap-2 cursor-pointer hover:bg-neutral-100 transition-colors"
      onClick={async () => {
        if (connected) {
          toast.success("Yoo Hoo!", {
            description: "You're already connected to Discord.",
          })
          return
        }
        await signIn("discord")
      }}
    >
      {connected ? (
        <PiDiscordLogoDuotone className="w-6 h-6" />
      ) : (
        <PiDiscordLogo className="w-6 h-6" />
      )}
      <div className="flex flex-col items-center">
        <p className="font-semibold">Discord</p>
        <p
          className={cn("text-xs text-neutral-400", {
            "text-emerald-600": connected,
          })}
        >
          {connected ? "Connected" : "Not connected"}
        </p>
      </div>
    </div>
  )
}

export function GithubCard({ connected }: { connected: boolean }) {
  return (
    <div
      className="pl-4 pr-6 py-2 flex items-center border rounded-full shadow bg-neutral-50 gap-2 cursor-pointer hover:bg-neutral-100 transition-colors"
      onClick={async () => {
        if (connected) {
          toast.success("Yoo Hoo!", {
            description: "You're already connected to GitHub.",
          })
          return
        }
        await signIn("github")
      }}
    >
      {connected ? (
        <PiGithubLogoDuotone className="w-6 h-6" />
      ) : (
        <PiGithubLogo className="w-6 h-6" />
      )}
      <div className="flex flex-col items-center">
        <p className="font-semibold">GitHub</p>
        <p
          className={cn("text-xs text-neutral-400", {
            "text-emerald-600": connected,
          })}
        >
          {connected ? "Connected" : "Not connected"}
        </p>
      </div>
    </div>
  )
}

export function GoogleCard({ connected }: { connected: boolean }) {
  return (
    <div
      className="pl-4 pr-6 py-2 flex items-center border rounded-full shadow bg-neutral-50 gap-2 cursor-pointer hover:bg-neutral-100 transition-colors"
      onClick={async () => {
        if (connected) {
          toast.success("Yoo Hoo!", {
            description: "You're already connected to Google.",
          })
          return
        }
        await signIn("google")
      }}
    >
      {connected ? (
        <PiGoogleLogoDuotone className="w-6 h-6" />
      ) : (
        <PiGoogleLogo className="w-6 h-6" />
      )}
      <div className="flex flex-col items-center">
        <p className="font-semibold">Google</p>
        <p
          className={cn("text-xs text-neutral-400", {
            "text-emerald-600": connected,
          })}
        >
          {connected ? "Connected" : "Not connected"}
        </p>
      </div>
    </div>
  )
}
